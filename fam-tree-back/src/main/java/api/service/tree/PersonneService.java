package api.service.tree;

import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.PersonneVisibility;
import api.model.tree.Relation;
import api.model.user.User;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationRepository;
import api.repository.tree.RelationshipConfirmationRepository;
import api.repository.user.UserRepository;
import api.service.relation.RelationshipConfirmationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonneService {
    private final PersonneRepository personneRepository;
    private final RelationRepository relationRepository;
    private final UserRepository userRepository;
    private final FamilyTreeRepository familyTreeRepository;
    private final RelationshipConfirmationRepository relationshipConfirmationRepository;
    private final  RelationshipConfirmationService relationshipConfirmationService;

    public List<Map<String, Object>> findByTreeId(Long treeId) {
        List<Personne> personnes = personneRepository.findByTreeId(treeId);
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        Optional<FamilyTree> optTree = familyTreeRepository.findByUser(currUser);

        if(optTree.isPresent()) {
            FamilyTree tree = optTree.get();
            boolean result = tree.getId().equals(treeId);
            return personnes.stream()
                    .map(personne -> convertToTreeFormat(personne, result, currUser))
                    .collect(Collectors.toList());
        } else {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + currUser.getId());
        }
    }

    public Long createAndSaveNewPerson(Map<String, Object> personneData, Map<String, Long> idMapping, List<Map<String, Object>> updateNodesList) {
        Personne newPersonne = new Personne();

        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        FamilyTree familyTree = familyTreeRepository.findByUserId(currUser.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + currUser.getId());
        });
        newPersonne.setTreeId(familyTree.getId());

        String email = "";
        if(!updateNodesList.isEmpty()) {
            Map<String, Object> firstNodeData = updateNodesList.get(0);
            email = (String) personneData.get("email");
        }
        /*newPersonne.setEmail(email);*/
        updatePersonneAttributes(newPersonne, personneData, true, null);

        // Récupérer l'ID bizarre ou utiliser l'ID réel si le tempId est null.
        String tempId = (String) personneData.get("id");
        if (tempId != null && !tempId.isEmpty()) {
            newPersonne.setTempId(tempId);
        }

        newPersonne = personneRepository.save(newPersonne);

        if (!areParentChildRelationsValid(newPersonne.getTreeId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Relation parent-enfant invalide (après création de la personne).");
        }

        return newPersonne.getId();
    }


    public void treeNodeManaging(Map<String, Object> requestBody) {
        Map<String, Object> updatedNode = (Map<String, Object>) requestBody.get("updatedNode");
        if (updatedNode == null) {
            System.err.println("Aucun 'updatedNode' trouvé dans la requête.");
            return;
        }

        Map<String, Long> idMapping = new HashMap<>();

        handleAddNodesData(updatedNode, idMapping);
        handleUpdateNodesData(updatedNode, idMapping);
        handleRemoveNodeId(updatedNode);
    }

    private void handleAddNodesData(Map<String, Object> updatedNode, Map<String, Long> idMapping) {
        List<Map<String, Object>> addNodesData = getAsListOfMap(updatedNode.get("addNodesData"));
        List<Map<String, Object>> updateNodesList = (List<Map<String, Object>>) updatedNode.get("updateNodesData");

        if (!addNodesData.isEmpty()) {
            for (Map<String, Object> nodeData : addNodesData) {
                Long newPersonId = createAndSaveNewPerson(nodeData, idMapping, updateNodesList);
                createRelationForNewPerson(newPersonId, idMapping, nodeData);
            }
        }
    }


    private void handleUpdateNodesData(Map<String, Object> updatedNode, Map<String, Long> idMapping) {
        List<Map<String, Object>> addNodesData = getAsListOfMap(updatedNode.get("addNodesData"));
        List<Map<String, Object>> updateNodesData = getAsListOfMap(updatedNode.get("updateNodesData"));

        // Vérifiez si les listes addNodesData et updateNodesData existent et ont du contenu
        boolean hasAddNodesData = addNodesData != null && !addNodesData.isEmpty();
        boolean hasUpdateNodesData = updateNodesData != null && !updateNodesData.isEmpty();

        // Assurez-vous que la liste updateNodesData est non vide avant de continuer
        if (hasUpdateNodesData) {
            for (Map<String, Object> nodeData : updateNodesData) {
                Long personId;

                // Déterminez quelle méthode updatePersonne appeler en fonction des conditions
                if (hasAddNodesData) {
                    // Si addNodesData est non vide
                    personId = updatePersonne(nodeData, idMapping, updateNodesData, false);
                } else {
                    // Si addNodesData est vide ([])
                    personId = updatePersonne(nodeData, idMapping, updateNodesData, true);
                }

                // Créer des relations pour la nouvelle personne
                createRelationForNewPerson(personId, idMapping, nodeData);
            }
        }
    }



    private void handleRemoveNodeId(Map<String, Object> updatedNode) {
        if (updatedNode.containsKey("removeNodeId")) {
            Long removeNodeId = null;
            try {
                removeNodeId = Long.valueOf(updatedNode.get("removeNodeId").toString());
            } catch (NullPointerException err) {
                System.err.println(err);
            }
            if (removeNodeId != null) {
                Personne removedPerson = personneRepository.findById(removeNodeId).orElse(null);
                Long treeId = removedPerson != null ? removedPerson.getTreeId() : null;

                deleteRelatedRelations(removeNodeId); // Supprime d'abord les relations associées
                deleteRelationShipConfirmation(removeNodeId);
                personneRepository.deleteById(removeNodeId); // Ensuite, supprime la personne

                /*if (treeId != null && !areParentChildRelationsValid(treeId)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Relation parent-enfant invalide (après sup de la personne).");
                }*/
            }
        }
    }


    public Long updatePersonne(Map<String, Object> nodeData, Map<String, Long> idMapping, List<Map<String, Object>> updateNodesList, boolean updateOnly) {
        Object idObject = nodeData.get("id");
        Long realId = resolveId(idObject, idMapping);
        Personne personneToUpdate = personneRepository.findById(realId)
                .orElseThrow(() -> new RuntimeException("Personne not found with ID: " + realId));

        String email = "";
        if(!updateNodesList.isEmpty()) {
            Map<String, Object> firstNodeData = updateNodesList.get(0);
            email = (String) firstNodeData.get("email");
        }

        updatePersonneAttributes(personneToUpdate, nodeData, updateOnly, email);
        if (!ObjectUtils.isEmpty(idMapping)) {
            createRelationForNewPerson(realId, idMapping, nodeData);
        }
        /*if (!areParentChildRelationsValid(personneToUpdate.getTreeId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Relation parent-enfant invalide (après mise à jour de la personne).");
        }*/
        personneRepository.save(personneToUpdate);
        return personneToUpdate.getId();
    }


    private Long resolveId(Object idObject, Map<String, Long> idMapping) {
        if (idObject instanceof List) {
            List<?> idList = (List<?>) idObject;
            if (!idList.isEmpty()) {
                Object lastId = idList.get(idList.size() - 1);
                return getIdFromObject(lastId, idMapping);
            } else {
                System.out.println("Warning: Empty ID list received in resolveId for object: " + idObject);
                return null;
            }
        } else {
            return getIdFromObject(idObject, idMapping);
        }
    }


    private Long getIdFromObject(Object idObject, Map<String, Long> idMapping) {
        if (idObject instanceof String) {
            String tempId = (String) idObject;
            Long realId = null;
            if (tempId != null && !tempId.isEmpty()) {
                realId = idMapping.get(tempId);
                if (realId == null) {
                    Optional<Personne> personneOpt = personneRepository.findByTempId(tempId);
                    if (personneOpt.isPresent()) {
                        realId = personneOpt.get().getId();
                    }
                }
            }
            if (realId == null) {
                try {
                    realId = Long.parseLong(tempId);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Invalid ID format: " + tempId);
                }
            }
            return realId;
        } else if (idObject instanceof Number) {
            return ((Number) idObject).longValue();
        } else {
            throw new RuntimeException("Unrecognized ID type: " + idObject);
        }
    }


    private List<Map<String, Object>> getAsListOfMap(Object object) {
        if (object instanceof List<?>) {
            return (List<Map<String, Object>>) object;
        }
        return new ArrayList<>();
    }

    private Map<String, Object> convertToTreeFormat(Personne personne, boolean result, User currentUser) {

        Map<String, Object> formattedPersonne = new HashMap<>();
        formattedPersonne.put("id", personne.getId());
        if(personne.getIs_registered()) {
            formattedPersonne.put("name", personne.getName() + "_t");
        } else {
            if(personne.getName() != null) {
                formattedPersonne.put("name", personne.getName() + "_f");
            } else {
                formattedPersonne.put("name", personne.getName());
            }
        }

        Date born = personne.getBorn();
        if(born != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); // Example pattern, change as needed
            String formattedDate = sdf.format(born);
            formattedPersonne.put("born", formattedDate);
        } else {
            formattedPersonne.put("born", born);
        }

        formattedPersonne.put("gender", personne.getGender());
        formattedPersonne.put("photo", personne.getPhoto());
        formattedPersonne.put("city", personne.getCity());
        formattedPersonne.put("country", personne.getCountry());
        formattedPersonne.put("email", personne.getEmail());
        formattedPersonne.put("phone", personne.getPhone());
        formattedPersonne.put("visibility", personne.getVisibility());

        if(result) {
            formattedPersonne.put("currentUser", true);
        } else {
            if(personne.getVisibility().equals(PersonneVisibility.PROTECTED)) {
                if(currentUser.getEmail().equals(personne.getEmail())) {
                    formattedPersonne.put("protectedUser", true);
                } else {
                    formattedPersonne.put("protectedUser", false);
                }
            }
            formattedPersonne.put("currentUser", false);
        }

        // Récupérer les relations pour cette personne
        Optional<List<Relation>> relationsOpt = relationRepository.findByPerson_Id(personne.getId());
        List<Relation> relations = relationsOpt.orElse(Collections.emptyList());

        // Trouver les identifiants des partenaires
        List<Long> partnerIds = relations.stream()
                .filter(rel -> rel.getPerson().equals(personne) && rel.getPartner() != null)
                .map(rel -> rel.getPartner().getId())
                .distinct()
                .collect(Collectors.toList());
        formattedPersonne.put("pids", partnerIds);

        // Traiter les mères et pères
        // Trouver les identifiants de la mère et du père, en considérant toutes les relations
        Set<Long> motherIds = new HashSet<>();
        Set<Long> fatherIds = new HashSet<>();
        relations.forEach(rel -> {
            if (rel.getMother() != null) {
                motherIds.add(rel.getMother().getId());
            }
            if (rel.getFather() != null) {
                fatherIds.add(rel.getFather().getId());
            }
        });

        // S'il y a plus d'un ID, cela pourrait indiquer un problème de données ou un cas spécial à gérer.
        if (motherIds.size() == 1) {
            formattedPersonne.put("mid", motherIds.iterator().next());
        }
        if (fatherIds.size() == 1) {
            formattedPersonne.put("fid", fatherIds.iterator().next());
        }

        return formattedPersonne;
    }

    private void deleteRelatedRelations(Long personId) {
        Optional<List<Relation>> relationsAsPerson = relationRepository.findByPerson_Id(personId);
        relationsAsPerson.ifPresent(relationRepository::deleteAll);

        Optional<List<Relation>> relationsAsMother = relationRepository.findByMother_Id(personId);
        relationsAsMother.ifPresent(relationRepository::deleteAll);

        Optional<List<Relation>> relationsAsFather = relationRepository.findByPartner_Id(personId);
        relationsAsFather.ifPresent(relationRepository::deleteAll);

    }

    public void deleteRelationShipConfirmation(Long targetMemberId) {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        Optional<Personne> optTargetPersonne = personneRepository.findById(targetMemberId);
        if(optTargetPersonne.isPresent()) {
            Personne targetPersonne = optTargetPersonne.get();
            Optional<User> optTargetUser = userRepository.findByEmail(targetPersonne.getEmail());
            if(optTargetUser.isPresent()) {
                User targetUser = optTargetUser.get();
                relationshipConfirmationRepository.deleteBySourceMemberAndTargetMember(currUser, targetUser);
            }
        }

    }

    private void createRelationForNewPerson(Long personId, Map<String, Long> idMapping, Map<String, Object> nodeData) {
        Relation newRelation = new Relation();
        newRelation.setPerson(personneRepository.findById(personId).orElseThrow(
                () -> new RuntimeException("Personne not found with ID: " + personId)));
        if (nodeData.containsKey("pids")) {
            Long partnerId = resolveId(nodeData.get("pids"), idMapping);
            if (partnerId != null) {
                newRelation.setPartner(personneRepository.findById(partnerId)
                        .orElseThrow(() -> new RuntimeException("Partner not found with ID: " + partnerId)));
            }
        }
        if (nodeData.containsKey("mid")) {
            Long motherId = resolveId(nodeData.get("mid"), idMapping);
            newRelation.setMother(personneRepository.findById(motherId)
                    .orElseThrow(() -> new RuntimeException("Mother not found with ID: " + motherId)));
        }
        if (nodeData.containsKey("fid")) {
            Long fatherId = resolveId(nodeData.get("fid"), idMapping);
            newRelation.setFather(personneRepository.findById(fatherId)
                    .orElseThrow(() -> new RuntimeException("Father not found with ID: " + fatherId)));
        }
        relationRepository.save(newRelation);
    }

    private void updatePersonneAttributes(Personne personne, Map<String, Object> attributes, boolean updateOnly, String email) {
        boolean isExisting = personneRepository.existsByEmailAndTreeId(email, personne.getTreeId());
        if(updateOnly) {
            Optional<User> targetMember = userRepository.findByEmail(email);

            if (targetMember.isPresent() && !isExisting) {
                relationshipConfirmationService.requestRelationshipConfirmation(email, personne.getId());
                if(attributes.containsKey("visibility")) {
                    String visibilityValue = (String) attributes.get("visibility");
                    PersonneVisibility visibility = PersonneVisibility.valueOf(visibilityValue);
                    personne.setVisibility(visibility);
                }
                return;
            } else {
                System.out.println("Les conditions pour entrer dans le 'if' n'ont pas été remplies.");
            }
        }

        if (attributes.containsKey("name")) {
            personne.setName((String) attributes.get("name"));
        }
        if (attributes.containsKey("gender")) {
            personne.setGender((String) attributes.get("gender"));
        }
        if (attributes.containsKey("born") && attributes.get("born") != "" && attributes.get("born") != null) {
            Date born = convertStringToDate((String) attributes.get("born"));
            if (born != null) {
                personne.setBorn(born);
            }
        }
        if (attributes.containsKey("photo")) {
            personne.setPhoto((String) attributes.get("photo"));
        }
        if (attributes.containsKey("city")) {
            personne.setCity((String) attributes.get("city"));
        }
        if (attributes.containsKey("country")) {
            personne.setCountry((String) attributes.get("country"));
        }
        if (attributes.containsKey("email") && !isExisting) {
            personne.setEmail((String) attributes.get("email"));
        }
        if (attributes.containsKey("phone")) {
            personne.setPhone((String) attributes.get("phone"));
        }
        if (attributes.containsKey("tree_id")) {
            personne.setTreeId((Long) attributes.get("tree_id"));
        }
        if(attributes.containsKey("visibility")) {
            String visibilityValue = (String) attributes.get("visibility");
            PersonneVisibility visibility = PersonneVisibility.valueOf(visibilityValue);
            personne.setVisibility(visibility);
        }
    }

    public Date convertStringToDate(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return dateFormat.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    private boolean isBirthDateValid(Personne parent, Personne child) {
        return parent.getBorn().before(child.getBorn());
    }
    public boolean areParentChildRelationsValid(Long treeId) {
        List<Personne> personnes = personneRepository.findByTreeId(treeId);
        for (Personne personne : personnes) {
            Optional<List<Relation>> optionalRelations = relationRepository.findByPerson_Id(personne.getId());
            if (optionalRelations.isPresent()) {
                List<Relation> relations = optionalRelations.get();
                for (Relation relation : relations) {
                    if (relation.getMother() != null && !isBirthDateValid(relation.getMother(), personne)) {
                        return false;
                    }
                    if (relation.getFather() != null && !isBirthDateValid(relation.getFather(), personne)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

}


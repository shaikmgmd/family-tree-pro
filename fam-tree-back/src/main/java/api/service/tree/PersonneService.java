package api.service.tree;

import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.Relation;
import api.model.user.User;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationRepository;
import api.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

//
@Service
@RequiredArgsConstructor
public class PersonneService {
    private final PersonneRepository personneRepository;
    private final RelationRepository relationRepository;
    private final UserRepository userRepository;
    private final FamilyTreeRepository familyTreeRepository;

    // Méthodes CRUD pour Personne

    public List<Map<String, Object>> findByTreeId(Long treeId) {
        List<Personne> personnes = personneRepository.findByTreeId(treeId);
        return personnes.stream().map(this::convertToTreeFormat).collect(Collectors.toList());
    }

    public Long createAndSaveNewPerson(Map<String, Object> personneData, Map<String, Long> idMapping) {
        System.out.println(idMapping);
        Personne newPersonne = new Personne();
        updatePersonneAttributes(newPersonne, personneData);
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        FamilyTree familyTree = familyTreeRepository.findByUserId(currUser.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + currUser.getId());
        });
        newPersonne.setTreeId(familyTree.getId());

        // Récupérer l'ID bizarre ou utiliser l'ID réel si le tempId est null.
        String tempId = (String) personneData.get("id");
        if (tempId != null && !tempId.isEmpty()) {
            newPersonne.setTempId(tempId); // Set the temporary ID only if it's not null and not empty
        }
        newPersonne = personneRepository.save(newPersonne);
        /*if (!areParentChildRelationsValid(newPersonne.getTreeId())) {
            //System.out.println("\nKAKA INVALIDE\n");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Relation parent-enfant invalide (après création de la personne).");
        }*/

        return newPersonne.getId();
    }

    public void treeNodeManaging(Map<String, Object> requestBody) {
        Map<String, Object> updatedNode = (Map<String, Object>) requestBody.get("updatedNode");
        if (updatedNode == null) {
            System.out.println("Aucun 'updatedNode' trouvé dans la requête.");
            return;
        }

        Map<String, Long> idMapping = new HashMap<>();
        System.out.println("Updated Node: " + updatedNode);

        // Traitement de addNodesData
        handleAddNodesData(updatedNode, idMapping);

        // Traitement de updateNodesData
        handleUpdateNodesData(updatedNode, idMapping);

        // Traitement de removeNodeId
        handleRemoveNodeId(updatedNode);
    }

    private void handleAddNodesData(Map<String, Object> updatedNode, Map<String, Long> idMapping) {
        List<Map<String, Object>> addNodesData = getAsListOfMap(updatedNode.get("addNodesData"));
        if (!addNodesData.isEmpty()) {
            for (Map<String, Object> nodeData : addNodesData) {
                Long newPersonId = createAndSaveNewPerson(nodeData, idMapping);
                createRelationForNewPerson(newPersonId, idMapping, nodeData);
            }
        }
    }


    private void handleUpdateNodesData(Map<String, Object> updatedNode, Map<String, Long> idMapping) {
        List<Map<String, Object>> updateNodesData = getAsListOfMap(updatedNode.get("updateNodesData"));
        for (Map<String, Object> nodeData : updateNodesData) {
            Long personId = updatePersonne(nodeData, idMapping);
            createRelationForNewPerson(personId, idMapping, nodeData); // Handle relation updates
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
                personneRepository.deleteById(removeNodeId); // Ensuite, supprime la personne

                /*if (treeId != null && !areParentChildRelationsValid(treeId)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Relation parent-enfant invalide (après sup de la personne).");
                }*/
            }
        }
    }


    private Long updatePersonne(Map<String, Object> nodeData, Map<String, Long> idMapping) {
        Object idObject = nodeData.get("id");
        Long realId = resolveId(idObject, idMapping);
        // Vérifier si l'ID est une chaîne ou un nombre et le traiter en conséquence
        /*if (idObject instanceof String) {
            String tempId = (String) idObject;
            realId = idMapping.getOrDefault(tempId, null);
            if (realId == null) {
                throw new RuntimeException("ID bizarre non trouvé dans le mapping: " + tempId);
            }
        } else if (idObject instanceof Number) {
            realId = ((Number) idObject).longValue(); // Convertir en Long pour les ID
        } else {
            throw new RuntimeException("Type d'ID non reconnu: " + idObject);
        }*/
        Personne personneToUpdate = personneRepository.findById(realId)
                .orElseThrow(() -> new RuntimeException("Personne not found with ID: " + realId));
        updatePersonneAttributes(personneToUpdate, nodeData);
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
                return null; // Or handle as appropriate for your application
            }
        } else {
            return getIdFromObject(idObject, idMapping);
        }
    }





    private Long getIdFromObject(Object idObject, Map<String, Long> idMapping) {
        if (idObject instanceof String) {
            String tempId = (String) idObject;
            Long realId = null;

            // If tempId is not null and not empty, try to get the real ID from the idMapping or the database.
            if (tempId != null && !tempId.isEmpty()) {
                realId = idMapping.get(tempId);
                if (realId == null) {
                    // If it's not in the idMapping, look in the database.
                    Optional<Personne> personneOpt = personneRepository.findByTempId(tempId);
                    if (personneOpt.isPresent()) {
                        realId = personneOpt.get().getId();
                    }
                }
            }

            // If realId is still null, assume tempId is actually the real ID and parse it.
            if (realId == null) {
                try {
                    realId = Long.parseLong(tempId);
                } catch (NumberFormatException e) {
                    throw new RuntimeException("Invalid ID format: " + tempId);
                }
            }

            return realId;
        } else if (idObject instanceof Number) {
            // Just return the long value for numbers.
            return ((Number) idObject).longValue();
        } else {
            throw new RuntimeException("Unrecognized ID type: " + idObject);
        }
    }




    private List<Map<String, Object>> getAsListOfMap(Object object) {
        System.out.println("Object =" + object);
        if (object instanceof List<?>) {
            return (List<Map<String, Object>>) object;
        }
        return new ArrayList<>();
    }

    private Map<String, Object> convertToTreeFormat(Personne personne) {

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

    private void createRelationForNewPerson(Long personId, Map<String, Long> idMapping, Map<String, Object> nodeData) {
        Relation newRelation = new Relation();
        System.out.println("Creating relation for Person ID: " + personId);
        System.out.println("Node Data: " + nodeData);
        System.out.println("ID Mapping: " + idMapping);

        newRelation.setPerson(personneRepository.findById(personId).orElseThrow(
                () -> new RuntimeException("Personne not found with ID: " + personId)));

        if (nodeData.containsKey("pids")) {
            Long partnerId = resolveId(nodeData.get("pids"), idMapping);
            if(partnerId != null) {
                // Set partner only if ID is not null
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

    private void updatePersonneAttributes(Personne personne, Map<String, Object> attributes) {
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
        if (attributes.containsKey("email")) {
            personne.setEmail((String) attributes.get("email"));
        }
        if (attributes.containsKey("phone")) {
            personne.setPhone((String) attributes.get("phone"));
        }
        if (attributes.containsKey("tree_id")) {
            personne.setTreeId((Long) attributes.get("tree_id"));
        }
    }

    public Date convertStringToDate(String dateString) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return dateFormat.parse(dateString);
        } catch (ParseException e) {
            // Handle the exception if the date string is not in the expected format
            e.printStackTrace();
            return null;
        }
    }

    /*private boolean isBirthDateValid(Personne parent, Personne child) {
        System.out.println("date de naissance parent : " + parent.getBorn() + "\n");
        System.out.println("date de naissance enfant : " + child.getBorn());
        return parent.getBorn().before(child.getBorn());
    }*/

    /*public boolean areParentChildRelationsValid(Long treeId) {
        List<Personne> personnes = personneRepository.findByTreeId(treeId);
        for (Personne personne : personnes) {
            Optional<List<Relation>> optionalRelations = relationRepository.findByPerson_Id(personne.getId());
            if (optionalRelations.isPresent()) {
                List<Relation> relations = optionalRelations.get();
                for (Relation relation : relations) {
                    if (relation.getMother() != null && !isBirthDateValid(relation.getMother(), personne)) {
                        System.out.println("\nLIEN INVALIDE\n");
                        return false;
                    }
                    if (relation.getFather() != null && !isBirthDateValid(relation.getFather(), personne)) {
                        System.out.println("\nLIEN INVALIDE\n");
                        return false;
                    }
                }
            }
        }
        System.out.println("\nLIEN VALIDE\n");
        return true;
    }*/

}


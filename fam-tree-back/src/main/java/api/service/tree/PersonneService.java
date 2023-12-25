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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
        Personne newPersonne = new Personne();
        updatePersonneAttributes(newPersonne, personneData);
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        FamilyTree familyTree = familyTreeRepository.findByUserId(currUser.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + currUser.getId());
        });
        newPersonne.setTreeId(familyTree.getId());
        newPersonne = personneRepository.save(newPersonne);

        // Récupérer l'ID bizarre et le mapper au nouvel ID réel
        String tempId = (String) personneData.get("id");
        if (tempId != null) {
            idMapping.put(tempId, newPersonne.getId());
        }

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
            updatePersonne(nodeData, idMapping);
        }
    }

    private void handleRemoveNodeId(Map<String, Object> updatedNode) {
        if (updatedNode.containsKey("removeNodeId")) {
            Long removeNodeId = Long.valueOf(updatedNode.get("removeNodeId").toString());
            if (removeNodeId != null) {
                deleteRelatedRelations(removeNodeId); // Supprime d'abord les relations associées
                personneRepository.deleteById(removeNodeId); // Ensuite, supprime la personne
            }
        }
    }


    private void updatePersonne(Map<String, Object> nodeData, Map<String, Long> idMapping) {
        Object idObject = nodeData.get("id");
        Long realId;
        // Vérifier si l'ID est une chaîne ou un nombre et le traiter en conséquence
        if (idObject instanceof String) {
            String tempId = (String) idObject;
            realId = idMapping.getOrDefault(tempId, null);
            if (realId == null) {
                throw new RuntimeException("ID bizarre non trouvé dans le mapping: " + tempId);
            }
        } else if (idObject instanceof Number) {
            realId = ((Number) idObject).longValue(); // Convertir en Long pour les ID numériques
        } else {
            throw new RuntimeException("Type d'ID non reconnu: " + idObject);
        }
        Personne personneToUpdate = personneRepository.findById(realId)
                .orElseThrow(() -> new RuntimeException("Personne not found with ID: " + realId));
        updatePersonneAttributes(personneToUpdate, nodeData);
        if (!ObjectUtils.isEmpty(idMapping)) {
            createRelationForNewPerson(realId, idMapping, nodeData);
        }
        personneRepository.save(personneToUpdate);
    }


    private Long resolveId(Object idObject, Map<String, Long> idMapping) {
        if (idObject instanceof List) {
            // Extraire le dernier élément si idObject est une liste
            List<?> idList = (List<?>) idObject;
            if (!idList.isEmpty()) {
                Object lastId = idList.get(idList.size() - 1);
                return getIdFromObject(lastId, idMapping);
            }
        } else {
            // Gérer les cas de chaîne ou de nombre unique
            return getIdFromObject(idObject, idMapping);
        }
        throw new RuntimeException("resolveId ERROR : " + idObject);
    }

    private Long getIdFromObject(Object idObject, Map<String, Long> idMapping) {
        if (idObject instanceof String) {
            String tempId = (String) idObject;
            if (idMapping.containsKey(tempId)) {
                return idMapping.get(tempId);
            }
            return Long.parseLong(tempId);
        } else if (idObject instanceof Number) {
            return ((Number) idObject).longValue();
        }
        throw new RuntimeException("getIdFromObject ERROR : " + idObject);
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
        formattedPersonne.put("name", personne.getName());
        formattedPersonne.put("gender", personne.getGender());
        /*formattedPersonne.put("born", formatDate(personne.getBorn()));*/
        formattedPersonne.put("born", personne.getBorn());
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
        relations.stream()
                .filter(rel -> rel.getPerson().equals(personne))
                .findFirst()
                .ifPresent(rel -> {
                    if (rel.getMother() != null) {
                        formattedPersonne.put("mid", rel.getMother().getId());
                    }
                    if (rel.getFather() != null) {
                        formattedPersonne.put("fid", rel.getFather().getId());
                    }
                });

        return formattedPersonne;
    }


    private void updateRelationsWithNewPersons(Personne personne, Map<String, Object> nodeData, Map<String, Long> idMapping) {
        // Mise à jour des relations
        /*updatePartnerIds(personne, nodeData, idMapping);*/
        /*updateMotherId(personne, nodeData, idMapping);
        updateFatherId(personne, nodeData, idMapping);*/
    }

    private void updatePartnerIds(Personne personne, Map<String, Object> nodeData, Map<String, Long> idMapping) {
        List<String> partnerIds = (List<String>) nodeData.get("pids");
        System.out.println("partnerIds =>" + partnerIds);
        if (partnerIds != null) {
            for (int i = 0; i < partnerIds.size(); i++) {
                String tempId = partnerIds.get(i);
                if (idMapping.containsKey(tempId)) {
                    partnerIds.set(i, idMapping.get(tempId).toString());
                }
            }
        }
        // Continuez à traiter les autres champs (mid, fid) de la même manière
    }


// Méthodes similaires pour updateMotherId et updateFatherId


    private void updateMotherId(Personne personne, Map<String, Object> nodeData, Map<String, Long> idMapping) {
        Long motherId = (Long) nodeData.get("mid");
        if (motherId != null && idMapping.containsKey(motherId)) {
            // Remplacer l'identifiant temporaire par l'identifiant réel
            nodeData.put("mid", idMapping.get(motherId));
        }
    }


    private void updateFatherId(Personne personne, Map<String, Object> nodeData, Map<String, Long> idMapping) {
        Long fatherId = (Long) nodeData.get("fid");
        if (fatherId != null && idMapping.containsKey(fatherId)) {
            // Remplacer l'identifiant temporaire par l'identifiant réel
            nodeData.put("fid", idMapping.get(fatherId));
        }
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
        System.out.println("idMapping => " + idMapping);
        System.out.println("nodeData => " + nodeData);

        newRelation.setPerson(personneRepository.findById(personId).orElseThrow(
                () -> new RuntimeException("Personne not found with ID: " + personId)));

        if (nodeData.containsKey("pids")) {
            Long partnerId = resolveId(nodeData.get("pids"), idMapping);
            newRelation.setPartner(personneRepository.findById(partnerId)
                    .orElseThrow(() -> new RuntimeException("Partner not found with ID: " + partnerId)));
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

    private String formatDate(Date date) {
        // Format de la date selon vos besoins
        return new SimpleDateFormat("yyyy-MM-dd").format(date);
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

}


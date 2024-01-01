package api.service.tree;

import api.model.tree.*;
import api.repository.tree.*;
import api.repository.user.UserRepository;
//import api.service.relationship.RelationshipConfirmationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

//
@Service
@RequiredArgsConstructor
public class FamilyTreeService {

    private final FamilyTreeRepository familyTreeRepository;
    private final RelationRepository relationRepository;
    private final PersonneService personneService;
    private final PersonneRepository personneRepository;
    private final UserRepository userRepository;

    public List<Map<String, Object>> getFamilyTreeByUserId(Long userId) {
        Optional<FamilyTree> optTree = familyTreeRepository.findByUserId(userId);

        // Vérifier si l'Optional contient une valeur avant de l'utiliser
        if (optTree.isPresent()) {
            FamilyTree tree = optTree.get();
            List<Map<String, Object>> lp = personneService.findByTreeId(tree.getId());
            return lp;
        } else {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + userId);
        }
    }

    private List<Relation> getRelations(Personne person) {
        if (person != null) {
            Optional<List<Relation>> listRelationOpt = relationRepository.findByPerson_Id(person.getId());
            if (listRelationOpt.isPresent()) {
                return listRelationOpt.get();
            }
        }
        return Collections.emptyList();
    }


    public List<Personne> traverseBFS(Personne rootPerson) {
        if (rootPerson == null) return Collections.emptyList();

        List<Personne> visited = new ArrayList<>();
        Queue<Personne> queue = new LinkedList<>();
        queue.offer(rootPerson);

        while (!queue.isEmpty()) {
            Personne current = queue.poll();
            if (!visited.contains(current)) {
                visited.add(current);
                List<Relation> relations = getRelations(current);
                for (Relation relation : relations) {
                    if (relation.getPartner() != null && !visited.contains(relation.getPartner())) {
                        queue.offer(relation.getPartner());
                    }
                    queue.addAll(findChildren(current, visited));
                }
            }
        }
        return visited;
    }

    public Set<Personne> traverseDFS(Personne rootPerson) {
        Set<Personne> visited = new HashSet<>();
        dfsHelper(rootPerson, visited);
        return visited;
    }

    private void dfsHelper(Personne current, Set<Personne> visited) {
        if (current == null || visited.contains(current)) return;

        visited.add(current);
        System.out.println(current.getName());

        List<Relation> relations = getRelations(current);
        for (Relation relation : relations) {
            dfsHelper(relation.getPartner(), visited);
            // Recursively visit children
            findChildren(current, visited).forEach(child -> dfsHelper(child, visited));
        }
    }

    private List<Personne> findChildren(Personne parent, Collection<Personne> visited) {
        // This method should return all Personne entities that have the given parent as either mother or father
        // and have not yet been visited.
        List<Personne> children = new ArrayList<>();
        Optional<List<Relation>> motherRelationsOpt = relationRepository.findByMother_Id(parent.getId());
        Optional<List<Relation>> fatherRelationsOpt = relationRepository.findByFather_Id(parent.getId());
        List<Relation> motherRelations = motherRelationsOpt.get();
        List<Relation> fatherRelations = fatherRelationsOpt.get();
        for (Relation relation : motherRelations) {
            if (!visited.contains(relation.getPerson())) {
                children.add(relation.getPerson());
            }
        }
        for (Relation relation : fatherRelations) {
            if (!visited.contains(relation.getPerson())) {
                children.add(relation.getPerson());
            }
        }
        return children;
    }

}

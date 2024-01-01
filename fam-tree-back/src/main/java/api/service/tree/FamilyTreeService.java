package api.service.tree;

import api.model.tree.*;
import api.repository.tree.*;
import api.repository.user.UserRepository;
//import api.service.relationship.RelationshipConfirmationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

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
                for (Relation relation : getRelations(current)) {
                    queue.offer(relation.getPartner());
                    queue.offer(relation.getMother());
                    queue.offer(relation.getFather());
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
        // Here you would process the current person, e.g., print their name
        System.out.println(current.getName());

        // Assume getRelations() is a method that retrieves all Relation objects for the current person
        List<Relation> relations = getRelations(current);
        if (relations != null) {
            for (Relation relation : relations) {
                dfsHelper(relation.getPartner(), visited);
                dfsHelper(relation.getMother(), visited);
                dfsHelper(relation.getFather(), visited);
                // And so on for other relatives...
            }
        }
    }
}

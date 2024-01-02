package api.controller.tree;

import api.common.ApiResponse;
import api.model.tree.Personne;
//import api.service.relationship.RelationshipConfirmationService;
import api.model.user.User;
import api.repository.tree.PersonneRepository;
import api.repository.user.UserRepository;
import api.service.tree.FamilyTreeService;
import api.service.tree.PersonneService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("${api.base.url}/family-tree")
@RequiredArgsConstructor
public class FamilyTreeController {
    private final FamilyTreeService familyTreeService;
    private final PersonneService personneService;


    // A eviter
    private final UserRepository userRepository;
    private final PersonneRepository personneRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFamilyTree(@PathVariable Long userId) {
        ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>(familyTreeService.getFamilyTreeByUserId(userId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/bfs")
    public ResponseEntity<ApiResponse<List<Personne>>> getFamilyTreeBFS() {
        ApiResponse<List<Personne>> response = new ApiResponse<>(familyTreeService.traverseBFS(getCurrentUser()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/dfs")
    public ResponseEntity<ApiResponse<Set<Personne>>> getFamilyTreeDFS() {
        ApiResponse<Set<Personne>> response = new ApiResponse<>(familyTreeService.traverseDFS(getCurrentUser()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> addNewUser(@RequestBody Object request, @PathVariable Long userId) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> requestMap = objectMapper.convertValue(request, new TypeReference<Map<String, Object>>() {
            });


            personneService.treeNodeManaging(requestMap);
            ApiResponse<String> response = new ApiResponse<>("Ok");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            System.err.println("Exception interceptée dans le contrôleur: " + e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>(e.getReason()), e.getStatusCode());
        } catch (Exception e) {
            System.err.println("Exception inattendue dans le contrôleur: " + e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>("Une erreur inattendue est survenue"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Personne getCurrentUser() {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        Optional<Personne> personneOpt = personneRepository.findByEmail(currUser.getEmail());

        if (!personneOpt.isPresent()) {
            System.err.println("No Personne associated with the current user's email.");
        }
        return personneOpt.get();
    }

}

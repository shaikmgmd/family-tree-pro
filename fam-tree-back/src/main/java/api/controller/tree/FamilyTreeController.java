package api.controller.tree;

import api.common.ApiResponse;
import api.model.adhesion.AdhesionRequest;
import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.TreeNode;
import api.model.tree.relationship.AddMemberRequest;
import api.service.tree.FamilyTreeService;
import api.service.tree.PersonneService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.base.url}/family-tree")
@RequiredArgsConstructor
public class FamilyTreeController {
    private final FamilyTreeService familyTreeService;
    private final PersonneService personneService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFamilyTree(@PathVariable Long userId) {
        System.out.println("User ID => " + userId);
        ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>(familyTreeService.getFamilyTreeByUserId(userId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /*@PostMapping("/{userId}/{sourceMemberId}")
    public ResponseEntity<ApiResponse<String>> addNewUser(@RequestBody AddMemberRequest request, @PathVariable Long userId, @PathVariable Long sourceMemberId) {
        System.out.println("request => " + request);
        familyTreeService.addMemberToTree(userId, sourceMemberId, request);
        ApiResponse<String> response = new ApiResponse<>("User ajouté à l'arbre");
        System.out.println(response);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }*/

    /*@PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> addNewUser(@RequestBody Object request, @PathVariable Long userId) {
        System.out.println("\nZZZZZZZZZZZZZZZZZZZZZZZZZZZ\n");
        System.out.println("request => " + request);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> requestMap = objectMapper.convertValue(request, new TypeReference<Map<String, Object>>() {});

        personneService.treeNodeManaging(requestMap);

        ApiResponse<String> response = new ApiResponse<>("Ok");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }*/
    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<String>> addNewUser(@RequestBody Object request, @PathVariable Long userId) {
        try {
            System.out.println("\nDébut de l'ajout d'un utilisateur\n");
            System.out.println("request => " + request);

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> requestMap = objectMapper.convertValue(request, new TypeReference<Map<String, Object>>() {});

            personneService.treeNodeManaging(requestMap);

            ApiResponse<String> response = new ApiResponse<>("Ok");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            // Log de l'exception pour confirmer qu'elle a bien été remontée jusqu'ici.
            System.out.println("Exception interceptée dans le contrôleur: " + e.getMessage());

            // Renvoyer la réponse avec le statut et le message de l'exception.
            // Remplacez getStatus() par getStatusCode()
            return new ResponseEntity<>(new ApiResponse<>(e.getReason()), e.getStatusCode());
        } catch (Exception e) {
            // Pour toutes les autres exceptions inattendues.
            System.out.println("Exception inattendue dans le contrôleur: " + e.getMessage());
            return new ResponseEntity<>(new ApiResponse<>("Une erreur inattendue est survenue"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}


package api.controller.tree;

import api.common.ApiResponse;
import api.model.adhesion.AdhesionRequest;
import api.model.tree.FamilyTree;
import api.model.tree.TreeNode;
import api.model.tree.relationship.AddMemberRequest;
import api.service.tree.FamilyTreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base.url}/family-tree")
@RequiredArgsConstructor
public class FamilyTreeController {
    private final FamilyTreeService familyTreeService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<TreeNode>> getFamilyTree(@PathVariable Long userId) {
        System.out.println("User ID => " + userId);
        ApiResponse<TreeNode> response = new ApiResponse<>(familyTreeService.getFamilyTreeByUserId(userId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{userId}/{sourceMemberId}")
    public ResponseEntity<ApiResponse<String>> addNewUser(@RequestBody AddMemberRequest request, @PathVariable Long userId, @PathVariable Long sourceMemberId) {
        System.out.println("request => " + request);
        familyTreeService.addMemberToTree(userId, sourceMemberId, request);
        ApiResponse<String> response = new ApiResponse<>("User ajouté à l'arbre");
        System.out.println(response);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}


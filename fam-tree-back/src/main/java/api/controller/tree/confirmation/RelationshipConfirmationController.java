package api.controller.tree.confirmation;

import api.common.ApiResponse;
import api.service.relationship.RelationshipConfirmationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base.url}/relationship-confirmation")
@RequiredArgsConstructor
public class RelationshipConfirmationController {
    private final RelationshipConfirmationService relationshipConfirmationService;
    @GetMapping("/{confirmation}")
    public ResponseEntity<ApiResponse<String>> stringCodeConfirmation(@PathVariable String confirmation) {
        System.out.println("confirmationString => "+confirmation);
        ApiResponse<String> response = new ApiResponse<>(relationshipConfirmationService.confirmRelationship(confirmation));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

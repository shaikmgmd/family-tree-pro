package api.controller.relation;

import api.common.ApiResponse;
import api.model.tree.EmailDTO;
import api.service.relation.RelationshipConfirmationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("${api.base.url}/relationship-confirmation")
@RequiredArgsConstructor
public class RelationshipConfirmationController {
    private final RelationshipConfirmationService relationshipConfirmationService;

    @PostMapping("/accept/{confirmation}")
    public ResponseEntity<ApiResponse<String>> stringCodeConfirmation(@PathVariable String confirmation) {
        ApiResponse<String> response = new ApiResponse<>(relationshipConfirmationService.confirmRelationship(confirmation));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/refuse/{confirmation}")
    public ResponseEntity<ApiResponse<String>> stringCodeConfirmationRefuse(@PathVariable String confirmation) {
        ApiResponse<String> response = new ApiResponse<>(relationshipConfirmationService.confirmRelationshipRefuse(confirmation));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/add-existing-user")
    public ResponseEntity<ApiResponse<String>> sendMailExistingUser(@RequestBody EmailDTO emailDto) {

        String emailToAdd = emailDto.getEmail();
        Long nodeId = emailDto.getNodeId();

        relationshipConfirmationService.requestRelationshipConfirmation(emailToAdd, nodeId);

        ApiResponse<String> response = new ApiResponse<>("Ok");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}



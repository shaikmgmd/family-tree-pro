package api.controller.tree.confirmation;

import api.common.ApiResponse;
import api.model.tree.EmailDTO;
import api.service.relationship.RelationshipConfirmationService;
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
        System.out.println("confirmationString => "+ confirmation);
        ApiResponse<String> response = new ApiResponse<>(relationshipConfirmationService.confirmRelationship(confirmation));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//    @PostMapping("/{userId}")
//    public ResponseEntity<ApiResponse<String>> sendMailExistingUser(@RequestBody String emailOfMemberToAdd,
//                                                                    @RequestBody FamilyMember sourceMember,
//                                                                    @RequestBody RelationshipType relationshipType,
//
//                                                                    @PathVariable Long userId) {
//        System.out.println("request => " + emailOfMemberToAdd);
//
//        relationshipConfirmationService.requestRelationshipConfirmation(emailOfMemberToAdd, sourceMember, relationshipType);
//
//        ApiResponse<String> response = new ApiResponse<>("Ok");
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

        @PostMapping("/add-existing-user")
        public ResponseEntity<ApiResponse<String>> sendMailExistingUser(@RequestBody EmailDTO emailDto) {

            String emailToAdd = emailDto.getEmail();
            Long nodeId = emailDto.getNodeId();

            System.out.println("EMAIL => " + emailToAdd);
            System.out.println("NODE ID => " + nodeId);

            relationshipConfirmationService.requestRelationshipConfirmation(emailToAdd, nodeId);

            //
            ApiResponse<String> response = new ApiResponse<>("Ok");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
}



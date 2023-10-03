package api.controller.adhesion;

import api.common.ApiResponse;
import api.model.adhesion.AdhesionRequest;
import api.model.adhesion.AdhesionStatus;
import api.model.auth.request.LoginReq;
import api.model.auth.request.SignUpReq;
import api.model.auth.response.LoginRes;
import api.model.user.User;
import api.service.adhesion.AdhesionService;
import api.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("${api.base.url}/adhesion")
@RequiredArgsConstructor
public class AdhesionController {
    private final AdhesionService adhesionRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<AdhesionRequest>> createAdhesionRequest(@RequestBody AdhesionRequest request) {
        ApiResponse<AdhesionRequest> response = new ApiResponse<>(adhesionRequestService.createAdhesionRequest(request));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<AdhesionRequest>>> getRequestsByStatus(
            @RequestParam(name = "status") AdhesionStatus status) {
        ApiResponse<List<AdhesionRequest>> response = new ApiResponse<>(adhesionRequestService.getAllRequestsByStatus(status));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/approve/{requestId}")
    public ResponseEntity<ApiResponse<AdhesionRequest>> approveRequest(@PathVariable Long requestId) {
        ApiResponse<AdhesionRequest> response = new ApiResponse<>(adhesionRequestService.approveRequest(requestId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reject/{requestId}")
    public ResponseEntity<ApiResponse<AdhesionRequest>> rejectRequest(@PathVariable Long requestId) {
        ApiResponse<AdhesionRequest> response = new ApiResponse<>(adhesionRequestService.rejectRequest(requestId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

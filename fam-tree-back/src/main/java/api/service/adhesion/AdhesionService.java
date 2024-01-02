package api.service.adhesion;

import api.model.adhesion.AdhesionRequest;
import api.model.adhesion.AdhesionStatus;
import api.repository.adhesion.AdhesionRepository;
import api.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdhesionService {
    private final AuthService authService;
    private final AdhesionRepository adhesionRepository;

    public AdhesionRequest createAdhesionRequest(AdhesionRequest request) {
        return adhesionRepository.save(request);
    }

    public List<AdhesionRequest> getAllRequestsByStatus(AdhesionStatus status) {
        return adhesionRepository.findByStatus(status);
    }


    public AdhesionRequest approveRequest(Long requestId) {
        AdhesionRequest request = adhesionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(AdhesionStatus.APPROVED);
        authService.approveAdhesion(request);
        return adhesionRepository.save(request);
    }

    public AdhesionRequest rejectRequest(Long requestId) {
        AdhesionRequest request = adhesionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(AdhesionStatus.REJECTED);
        return adhesionRepository.save(request);
    }
}


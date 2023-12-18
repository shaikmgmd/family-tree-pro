package api.service.adhesion;

import api.model.adhesion.AdhesionRequest;
import api.model.adhesion.AdhesionStatus;
import api.repository.adhesion.AdhesionRepository;
import api.service.auth.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdhesionServiceTest {

    @Mock
    private AdhesionRepository adhesionRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AdhesionService adhesionService;

    private AdhesionRequest request;

    @BeforeEach
    void setUp() {
        request = new AdhesionRequest();
    }

    @Test
    void createAdhesionRequestTest() {
        when(adhesionRepository.save(request)).thenReturn(request);

        AdhesionRequest result = adhesionService.createAdhesionRequest(request);
        assertEquals(request, result);
        verify(adhesionRepository).save(request);
    }

    @Test
    void getAllRequestsByStatusTest() {
        when(adhesionRepository.findByStatus(AdhesionStatus.PENDING)).thenReturn(Collections.singletonList(request));

        List<AdhesionRequest> results = adhesionService.getAllRequestsByStatus(AdhesionStatus.PENDING);
        assertFalse(results.isEmpty());
        assertEquals(request, results.get(0));
        verify(adhesionRepository).findByStatus(AdhesionStatus.PENDING);
    }

    @Test
    void approveRequestTest_Success() {
        Long requestId = 1L;
        when(adhesionRepository.findById(requestId)).thenReturn(Optional.of(request));
        when(adhesionRepository.save(request)).thenReturn(request);

        AdhesionRequest result = adhesionService.approveRequest(requestId);
        assertEquals(AdhesionStatus.APPROVED, result.getStatus());
        verify(authService).approveAdhesion(request);
        verify(adhesionRepository).save(request);
    }

    @Test
    void approveRequestTest_NotFound() {
        Long requestId = 1L;
        when(adhesionRepository.findById(requestId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> adhesionService.approveRequest(requestId));
    }

    @Test
    void rejectRequestTest() {
        Long requestId = 1L;
        when(adhesionRepository.findById(requestId)).thenReturn(Optional.of(request));
        when(adhesionRepository.save(request)).thenReturn(request);

        AdhesionRequest result = adhesionService.rejectRequest(requestId);
        assertEquals(AdhesionStatus.REJECTED, result.getStatus());
        verify(adhesionRepository).save(request);
    }

    @Test
    void rejectRequestTest_NotFound() {
        Long requestId = 1L;
        when(adhesionRepository.findById(requestId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> adhesionService.rejectRequest(requestId));
    }

}

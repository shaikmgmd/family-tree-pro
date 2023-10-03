package api.repository.adhesion;

import api.model.adhesion.AdhesionRequest;
import api.model.adhesion.AdhesionStatus;
import api.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdhesionRepository extends JpaRepository<AdhesionRequest, Long> {
    List<AdhesionRequest> findByStatus(AdhesionStatus status);
}


package api.service.role;

import api.model.adhesion.AdhesionRequest;
import api.model.role.Role;
import api.model.user.User;
import api.model.user_role.UserRole;
import api.repository.adhesion.AdhesionRepository;
import api.repository.role.RoleRepository;
import api.repository.user.UserRepository;
import api.repository.user_role.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
//
@Service
@RequiredArgsConstructor
public class RoleService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AdhesionRepository adhesionRepository;
    private final UserRoleRepository userRoleRepository;

    public String addAdminRoleToUser(Long userId) {
        AdhesionRequest adReq = adhesionRepository.findById(userId).orElseThrow(() -> new RuntimeException("Adhesin request not found"));
        User user = userRepository.findByEmail(adReq.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        Role adminRole = roleRepository.findByName("ADMIN");

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(adminRole);

        userRoleRepository.save(userRole);

        return "Nouveau ADMIN : " + userId;
    }

    @Transactional
    public String removeAdminRoleFromUser(Long userId) {
        AdhesionRequest adReq = adhesionRepository.findById(userId).orElseThrow(() -> new RuntimeException("Adhesin request not found"));
        User user = userRepository.findByEmail(adReq.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        Role adminRole = roleRepository.findByName("ADMIN");

        userRoleRepository.deleteByUserAndRole(user, adminRole);

        return "Nouveau ADMIN retiré : " + userId;
    }
}


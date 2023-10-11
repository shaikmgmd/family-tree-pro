package api.service.auth;

import api.model.adhesion.AdhesionRequest;
import api.model.auth.request.LoginReq;
import api.model.auth.request.SignUpReq;
import api.model.auth.response.ErrorRes;
import api.model.auth.response.LoginRes;
import api.model.role.Role;
import api.model.tree.FamilyMember;
import api.model.tree.FamilyTree;
import api.model.user.User;
import api.model.user_role.UserRole;
import api.repository.adhesion.AdhesionRepository;
import api.repository.role.RoleRepository;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.FamilyTreeRepository;
import api.repository.user.UserRepository;
import api.security.JwtUtil;
import api.service.mail.MailService;
import api.utils.CodeUtils;
import api.utils.FTProPrecondition;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AdhesionRepository adhesionRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final FamilyTreeRepository familyTreeRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final MailService emailService;

    public LoginRes login(LoginReq loginReq) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginReq.getPrivateCode(), loginReq.getPassword()));

            String privateCode = authentication.getName();
            User user = userRepository.findByPrivateCode(privateCode);

            String token = jwtUtil.createToken(user);

            List<String> roles = user.getUserRoles().stream().map(ur -> ur.getRole().getName()).collect(Collectors.toList());

            LoginRes loginRes = new LoginRes(user.getPrivateCode(), token, roles);

            System.out.println(loginRes);
            return loginRes;
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid private code or password");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    public void approveAdhesion(AdhesionRequest request) {
        User newUser = new User(
                request.getLastName(), request.getFirstName(), request.getBirthDate(), request.getNationality(),
                generatePublicCode(), generatePrivateCode(),
                request.getSocialSecurityNumber(),
                request.getIdCardPath(), request.getPhotoPath(),
                request.getEmail(), passwordEncoder.encode(request.getFirstName())
        );

        Role userRole = roleRepository.findByName("USER");
        if (userRole == null) {
            userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);
        }

        UserRole newUserRole = new UserRole();
        newUserRole.setUser(newUser);
        newUserRole.setRole(userRole);
        newUser.getUserRoles().add(newUserRole);

        User user = userRepository.save(newUser);

        // Initialize Family Tree for the user
        FamilyTree tree = new FamilyTree();
        tree.setUser(user);
        familyTreeRepository.save(tree);

        // Add the user as the first node/member in the tree
        FamilyMember member = new FamilyMember();
        member.setUser(user);
        member.setTree(tree);
        member.setName(user.getFirstName());
        member.setBirthDate(user.getBirthDate());
        familyMemberRepository.save(member);

        emailService.sendCodesByEmail(user.getEmail(), user.getPublicCode(), user.getPrivateCode());
    }

    public User handleFirstLoginPasswordUpdate(String privateCode, String newPassword) {
        User user = userRepository.findByPrivateCode(privateCode);
        if (user == null) {
            throw new RuntimeException("User not found with private code: " + privateCode);
        }

        if (!user.isFirstLogin()) {
            throw new RuntimeException("Password already set by user.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFirstLogin(false);
        return userRepository.save(user);
    }

    private String generatePublicCode() {
        return CodeUtils.generatePublicCode();
    }

    private String generatePrivateCode() {
        return CodeUtils.generatePrivateCode();
    }
}

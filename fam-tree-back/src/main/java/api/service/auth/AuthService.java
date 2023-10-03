package api.service.auth;

import api.model.adhesion.AdhesionRequest;
import api.model.auth.request.LoginReq;
import api.model.auth.request.SignUpReq;
import api.model.auth.response.ErrorRes;
import api.model.auth.response.LoginRes;
import api.model.user.User;
import api.repository.adhesion.AdhesionRepository;
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

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AdhesionRepository adhesionRepository;
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
            LoginRes loginRes = new LoginRes(user.getEmail(), token);

            return loginRes;
        } catch (BadCredentialsException e) {
            ErrorRes errorResponse = new ErrorRes(HttpStatus.BAD_REQUEST, "Invalid private code or password");
            System.err.println(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse));
        } catch (Exception e) {
            ErrorRes errorResponse = new ErrorRes(HttpStatus.BAD_REQUEST, e.getMessage());
            System.err.println(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse));
        }
        return null;
    }

    public void approveAdhesion(AdhesionRequest request) {
        User newUser = new User(
                request.getLastName(), request.getFirstName(), request.getBirthDate(), request.getNationality(),
                generatePublicCode(), generatePrivateCode(),
                request.getSocialSecurityNumber(),
                request.getIdCardPath(), request.getPhotoPath(),
                request.getEmail(), passwordEncoder.encode(request.getFirstName())
        );

        User user = userRepository.save(newUser);

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

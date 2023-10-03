package api.service.user;

import api.model.user.User;
import api.model.user.UserUpdate;
import api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User updateUser(UserUpdate userUpdate) {
        // Récupérez le privateCode de l'utilisateur courant
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Récupérez l'utilisateur à partir de la base de données
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        if (currUser == null) {
            throw new RuntimeException("User not found");
        }

        if (null != userUpdate.getAddress()) {
            currUser.setAddress(userUpdate.getAddress());
        }
        if (null != userUpdate.getEmail()) {
            currUser.setEmail(userUpdate.getEmail());
        }
        if (null != userUpdate.getPhone()) {
            currUser.setPhone(userUpdate.getPhone());
        }

        userRepository.save(currUser);
        return currUser;
    }

}

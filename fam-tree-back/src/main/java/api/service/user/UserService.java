package api.service.user;

import api.model.user.User;
import api.model.user.UserUpdate;
import api.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentConnectedUser() {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        return currUser;
    }

    public User updateUser(UserUpdate userUpdate) {
        // Récupérez le privateCode de l'utilisateur courant
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Récupérez l'utilisateur à partir de la base de données
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);
        if (currUser == null) {
            throw new RuntimeException("User not found");
        }
        if (null != userUpdate.getEmail()) {
            // Vérifiez si l'email existe déjà
            Optional<User> existingUserWithEmail = userRepository.findByEmail(userUpdate.getEmail());

            // Si l'email existe déjà et n'appartient pas à l'utilisateur actuel, lever une exception
            if (existingUserWithEmail.isPresent() &&
                    !existingUserWithEmail.get().getPrivateCode().equals(currentPrivateCode)) {
                throw new RuntimeException("L'email est déjà utilisé");
            }

            currUser.setEmail(userUpdate.getEmail());
        }

        if (null != userUpdate.getAddress()) {
            currUser.setAddress(userUpdate.getAddress());
        }
        if (null != userUpdate.getPhone()) {
            currUser.setPhone(userUpdate.getPhone());
        }

        userRepository.save(currUser);
        return currUser;
    }

    public User getUserById(Long userId) {
        // Récupérer l'utilisateur par son ID en utilisant Optional
        Optional<User> userOptional = userRepository.findById(userId);

        // Vérifier si l'utilisateur a été trouvé et le retourner, sinon lancer une exception
        return userOptional.orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec ID: " + userId));
    }

    public List<User> getAllUsersExceptCurrent(int page, int size) {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = getCurrentConnectedUser();

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findAll(pageable);

        List<User> users = usersPage.getContent().stream()
                .filter(user -> !user.getPrivateCode().equals(currentUser.getPrivateCode()))
                .collect(Collectors.toList());

        System.out.println("Users from database: " + users);
        return users;
    }
}

package api.service.user;

import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.Relation;
import api.model.user.User;
import api.model.user.UserUpdate;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationRepository;
import api.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

//
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FamilyTreeRepository familyTreeRepository;
    private final PersonneRepository personneRepository;
    private final RelationRepository relationRepository;

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

    public User findUserById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec ID: " + userId));
    }

    // user presents dans l'arbre
    public List<User> findAllUsersExceptCurrentWoutPagination() {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByPrivateCode(currentPrivateCode);
        Personne currentPerson = personneRepository.findByEmail(currentUser.getEmail()).orElse(null);

        Set<Long> treeIdsWithCurrentUser = new HashSet<>();
        if (currentPerson != null) {
            treeIdsWithCurrentUser.add(currentPerson.getTreeId());
        }

        Set<User> relatedUsersSet = treeIdsWithCurrentUser.stream()
                .flatMap(treeId -> personneRepository.findByTreeId(treeId).stream())
                .distinct()
                .map(personne -> userRepository.findByEmail(personne.getEmail()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(user -> !user.getPrivateCode().equals(currentUser.getPrivateCode()))
                .collect(Collectors.toSet());

        return new ArrayList<>(relatedUsersSet);
    }



    public List<User> getAllUsersExceptCurrent(int page, int size) {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByPrivateCode(currentPrivateCode);
        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findAll(pageable);
        List<User> users = usersPage.getContent().stream()
                .filter(user -> !user.getPrivateCode().equals(currentUser.getPrivateCode()))
                .collect(Collectors.toList());
        return users;
    }

    public boolean hasMore(int page, int size) {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByPrivateCode(currentPrivateCode);
        Pageable pageable = PageRequest.of(page + 1, size);
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.hasContent();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

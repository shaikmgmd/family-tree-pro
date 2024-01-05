package api.service.user;

import api.model.chat.Chat;
import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.Relation;
import api.model.user.User;
import api.model.user.UserUpdate;
import api.repository.chat.ChatRepository;
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
    private final ChatRepository chatRepository;

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
        // Récupérer le privateCode de l'utilisateur actuel
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByPrivateCode(currentPrivateCode);

        // Vérifier si l'utilisateur actuel a été trouvé
        if (currentUser == null) {
            // Gérer le cas où l'utilisateur actuel n'est pas trouvé
            return Collections.emptyList();
        }

        // Essayer la première méthode (basée sur les treeIds)
        Set<User> relatedUsersSet = tryFirstMethod(currentUser);

        // Si la première méthode ne retourne aucun résultat, essayer la deuxième méthode (basée sur les chats)
        if (relatedUsersSet.isEmpty()) {
            relatedUsersSet = trySecondMethod(currentUser);
        }

        // Convertir le set en liste et la retourner
        return new ArrayList<>(relatedUsersSet);
    }

    private Set<User> tryFirstMethod(User currentUser) {
        String currentPrivateCode = currentUser.getPrivateCode();
        Personne currentPerson = personneRepository.findByEmailAndTreeId(currentUser.getEmail(), currentUser.getId()).orElse(null);

        // Préparer un ensemble pour les utilisateurs associés
        Set<User> relatedUsersSet = new HashSet<>();

        // Vérifier si l'utilisateur actuel a un treeId associé
        if (currentPerson != null) {
            Long currentTreeId = currentPerson.getTreeId();

            // Récupérer toutes les personnes dans le même arbre que l'utilisateur actuel
            List<Personne> personnesInSameTree = personneRepository.findByTreeId(currentTreeId);

            // Pour chaque personne dans le même arbre
            for (Personne personne : personnesInSameTree) {
                // Trouver tous les utilisateurs correspondant à l'email de la personne
                List<User> users = userRepository.findAllByEmail(personne.getEmail());

                // Filtrer les utilisateurs pour ne conserver que ceux qui sont dans le même arbre et qui ne sont pas l'utilisateur actuel
                users.stream()
                        .filter(user -> user.getId().equals(currentTreeId) && !user.getPrivateCode().equals(currentPrivateCode))
                        .forEach(relatedUsersSet::add);
            }
        }

        return relatedUsersSet;
    }


    private Set<User> trySecondMethod(User currentUser) {
        List<Chat> chats = chatRepository.findAllByUserId1OrUserId2(currentUser.getId(), currentUser.getId());
        Set<User> relatedUsersSet = new HashSet<>();

        for (Chat chat : chats) {
            Long otherUserId = chat.getUserId1().equals(currentUser.getId()) ? chat.getUserId2() : chat.getUserId1();
            userRepository.findById(otherUserId).ifPresent(relatedUsersSet::add);
        }

        return relatedUsersSet;
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

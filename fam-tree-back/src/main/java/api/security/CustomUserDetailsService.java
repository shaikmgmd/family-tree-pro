package api.security;

import api.model.user.User;
import api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String privateCode) throws UsernameNotFoundException {
        User user = userRepository.findByPrivateCode(privateCode);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with privateCode: " + privateCode);
        }

        // Récupération des rôles associés à l'utilisateur depuis la base de données
        List<String> roles = user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getName())
                .collect(Collectors.toList());

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getPrivateCode())
                        .password(user.getPassword())
                        .roles(roles.toArray(new String[0]))
                        .build();
        return userDetails;
    }
}
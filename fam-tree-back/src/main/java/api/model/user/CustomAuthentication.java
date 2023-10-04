package api.model.user;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CustomAuthentication extends UsernamePasswordAuthenticationToken {
    private String token;

    public CustomAuthentication(String privateCode, String token) {
        super(privateCode, null, Collections.emptyList());
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}

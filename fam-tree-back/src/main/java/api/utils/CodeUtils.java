package api.utils;

import api.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Component
public class CodeUtils {

    private static UserRepository userRepository;

    private static final Random RANDOM = new Random();

    private static final Set<String> recentCodes = new HashSet<>();

    @Autowired
    public CodeUtils(UserRepository userRepository) {
        CodeUtils.userRepository = userRepository;
    }

    public static void setUserRepository(UserRepository userRepository) {
        CodeUtils.userRepository = userRepository;
    }

    public static String generateCode() {
        int randomCode = 10000000 + RANDOM.nextInt(90000000);
        return String.valueOf(randomCode);
    }

    public static String generatePublicCode() {
        return generateCode();
    }

    public static String generatePrivateCode() {
        String code;
        synchronized (recentCodes) {
            do {
                code = generateCode();
            } while (recentCodes.contains(code) || userRepository.findByPrivateCode(code) != null);
            recentCodes.add(code);
        }
        return code;
    }
}


package api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("test")
public class TestConfig {

    @Bean
    public CommandLineRunner runTests() {
        return args -> {
            // Logique pour exécuter les tests ici
        };
    }
}

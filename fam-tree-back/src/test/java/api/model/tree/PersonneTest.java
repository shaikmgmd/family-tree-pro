package api.model.tree;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PersonneTest {
    @Test
    void testPersonneAttributes() {
        // Créer une instance de Personne
        Personne personne = new Personne();

        // Définir les attributs
        Long id = 1L;
        String name = "John Doe";
        String gender = "Male";
        Date born = new Date();
        String photo = "path/to/photo.jpg";
        String email = "johndoe@example.com";
        String phone = "1234567890";
        String city = "City";
        String country = "Country";
        Long treeId = 1L;
        String address = "123 Main St";
        String tempId = "temp123";
        Boolean is_registered = true;

        // Utiliser les setters
        personne.setId(id);
        personne.setName(name);
        personne.setGender(gender);
        personne.setBorn(born);
        personne.setPhoto(photo);
        personne.setEmail(email);
        personne.setPhone(phone);
        personne.setCity(city);
        personne.setCountry(country);
        personne.setTreeId(treeId);
        personne.setAddress(address);
        personne.setTempId(tempId);
        personne.setIs_registered(is_registered);

        // Vérifier les valeurs avec les getters
        assertEquals(id, personne.getId());
        assertEquals(name, personne.getName());
        assertEquals(gender, personne.getGender());
        assertEquals(born, personne.getBorn());
        assertEquals(photo, personne.getPhoto());
        assertEquals(email, personne.getEmail());
        assertEquals(phone, personne.getPhone());
        assertEquals(city, personne.getCity());
        assertEquals(country, personne.getCountry());
        assertEquals(treeId, personne.getTreeId());
        assertEquals(address, personne.getAddress());
        assertEquals(tempId, personne.getTempId());
        assertEquals(is_registered, personne.getIs_registered());
    }
}

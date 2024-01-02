package api.model.tree;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "personne")
public class Personne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String gender;
    private Date born;
    private String photo;
    private String email;
    private String phone;
    private String city;
    private String country;
    private Long treeId; // Ajouté pour lier à un arbre spécifique
    private String address;
    @Column(name = "temp_id")
    private String tempId;
    private Boolean is_registered = false;
    @Enumerated(EnumType.STRING)
    private PersonneVisibility visibility = PersonneVisibility.PUBLIC;
}

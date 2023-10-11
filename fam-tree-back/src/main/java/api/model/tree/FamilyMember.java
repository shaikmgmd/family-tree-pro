package api.model.tree;
import api.model.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "family_member")
public class FamilyMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tree_id")
    @JsonIgnore
    private FamilyTree tree;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;  // This can be null if the family member isn't registered as a user.

    @Column(name = "name")
    private String name;

    @Column(name = "birthdate")
    private LocalDate birthDate;

    @Override
    public String toString() {
        return "FamilyMember{" +
                "id=" + id +
                ", treeId=" + (tree != null ? tree.getId() : "null") +
                ", userId=" + (user != null ? user.getId() : "null") +
                ", name='" + name + '\'' +
                ", birthDate=" + birthDate +
                '}';
    }

}

package api.model.tree;

import api.model.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@Table(name = "family_tree")
public class FamilyTree {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL)
    private Set<FamilyMember> members = new HashSet<>();

    public FamilyMember getRootMember() {
        // Retourne le membre le plus âgé de l'arbre
        return members.stream()
                .min(Comparator.comparing(FamilyMember::getBirthDate))
                .orElse(null);
    }
}
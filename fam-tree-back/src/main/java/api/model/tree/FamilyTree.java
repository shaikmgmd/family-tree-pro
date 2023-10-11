package api.model.tree;

import api.model.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
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

    @Override
    public String toString() {
        return "FamilyTree{" +
                "id=" + id +
                ", user=" + user +
                ", members=" + members +
                '}';
    }
}

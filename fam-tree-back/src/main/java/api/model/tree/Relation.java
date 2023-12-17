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
@Table(name = "relation")
public class Relation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Personne person;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    private Personne partner;

    @ManyToOne
    @JoinColumn(name = "mother_id")
    private Personne mother;

    @ManyToOne
    @JoinColumn(name = "father_id")
    private Personne father;
}

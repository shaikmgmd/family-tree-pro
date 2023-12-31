package api.model.view;

import api.model.BaseEntityWithAudit;
import api.model.tree.FamilyTree;
import api.model.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "view")
public class View extends BaseEntityWithAudit {
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "tree_id", nullable = false)
    private FamilyTree tree;
}

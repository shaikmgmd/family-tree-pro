package api.model.tree;

import api.model.tree.relationship.RelationshipType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class TreeNode {
    private FamilyMember member;
    private List<TreeNode> children;
    private boolean isRegistered;
    private String relationName; // Nom de la relation par rapport au membre racine

    public TreeNode(FamilyMember member, String relationName) {
        this.member = member;
        this.children = new ArrayList<>();
        this.isRegistered = member.getUser() != null;
        this.relationName = relationName;
    }

    public TreeNode(FamilyMember member) {
        this.member = member;
        this.children = new ArrayList<>();
        this.isRegistered = member.getUser() != null;
    }

    @JsonProperty("isRegistered")
    public boolean isRegistered() {
        return isRegistered;
    }

    @JsonProperty("relationName")
    public String relationName() {
        return relationName;
    }

    // Méthode pour ajouter un enfant et déterminer la relation
    public void addChild(TreeNode child, RelationshipType relationshipType) {
        String childRelationName = determineRelationName(relationshipType, this.relationName);
        child.setRelationName(childRelationName);
        this.children.add(child);
    }

    public void addChild(TreeNode child) {
        this.children.add(child);
    }

    public String determineRelationName(RelationshipType relationshipType, String parentRelationName) {
        if (relationshipType == RelationshipType.PARENT) {
            if (parentRelationName == null) {
                return "Père/Mère";
            } else if (parentRelationName.equals("Père/Mère")) {
                return "Grand-père/Grand-mère";
            } else if (parentRelationName.equals("Grand-père/Grand-mère")) {
                return "Arrière-grand-père/Arrière-grand-mère";
            }
            // Ajouter d'autres cas au besoin
        } else if (relationshipType == RelationshipType.CHILD) {
            if (parentRelationName == null) {
                return "Fils/Fille";
            } else if (parentRelationName.equals("Père/Mère")) {
                return "Petit-fils/Petite-fille";
            } else if (parentRelationName.equals("Grand-père/Grand-mère")) {
                return "Arrière-petit-fils/Arrière-petite-fille";
            }
            // Ajouter d'autres cas au besoin
        }
        return "Inconnu";
    }

}

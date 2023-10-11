package api.model.tree;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TreeNode {
    private FamilyMember member;
    private List<TreeNode> children;

    public TreeNode(FamilyMember member) {
        this.member = member;
        this.children = new ArrayList<>();
    }

    public void addChild(TreeNode child) {
        this.children.add(child);
    }

    @Override
    public String toString() {
        return "TreeNode{" +
                "member=" + member +
                ", children=" + children +
                '}';
    }
}


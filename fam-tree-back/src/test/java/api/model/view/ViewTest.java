package api.model.view;

import api.model.tree.FamilyTree;
import api.model.user.User;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ViewTest {
    @Test
    void testUserAssociation() {
        View view = new View();
        User user = new User();  // Assume User is a properly instantiated object
        view.setUser(user);

        assertEquals(user, view.getUser(), "The User should be associated with the View");
    }

    @Test
    void testTreeAssociation() {
        View view = new View();
        FamilyTree tree = new FamilyTree();  // Assume FamilyTree is a properly instantiated object
        view.setTree(tree);

        assertEquals(tree, view.getTree(), "The FamilyTree should be associated with the View");
    }

    /*@Test
    void testThatAlwaysFails() {
        assertEquals(1, 2, "Ce test échouera toujours car 1 n'est pas égal à 2.");
    }*/
}

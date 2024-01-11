package api.model.tree;

/*
import api.model.user.User;
import api.utils.CodeUtils;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
*/

//@ExtendWith(MockitoExtension.class)
//public class FamilyTreeTest extends CodeUtils {
//    @Test
//    void testFamilyTreeId() {
//        // Créer une instance de FamilyTree
//        FamilyTree familyTree = new FamilyTree();
//
//        // Définir et vérifier l'ID
//        Long expectedId = 1L;
//        familyTree.setId(expectedId);
//        assertEquals(expectedId, familyTree.getId());
//    }
//
//    @Test
//    void testFamilyTreeUserAssociation() {
//        // Créer une instance de FamilyTree et User
//        FamilyTree familyTree = new FamilyTree();
//        User user = new User();
//        Long userId = 2L;
//
//        // Définir l'utilisateur et vérifier l'association
//        user.setId(userId);
//        familyTree.setUser(user);
//
//        assertEquals(user, familyTree.getUser());
//        assertEquals(userId, familyTree.getOwnerId());
//    }
//
//    @Test
//    void testGetOwnerIdWhenUserIsNull() {
//        // Créer une instance de FamilyTree sans User
//        FamilyTree familyTree = new FamilyTree();
//
//        // Vérifier que getOwnerId renvoie null
//        assertNull(familyTree.getOwnerId());
//    }
//}

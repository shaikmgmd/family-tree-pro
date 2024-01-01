package api.service.view;

import api.model.tree.FamilyTree;
import api.model.user.User;
import api.repository.tree.FamilyTreeRepository;
import api.repository.user.UserRepository;
import api.repository.view.ViewRepository;
import api.service.view.ViewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ViewServiceTest {

    @Mock
    private ViewRepository viewRepository;

    @Mock
    private FamilyTreeRepository familyTreeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ViewService viewService;

    private User user;
    private FamilyTree familyTree;

    @BeforeEach
    public void setUp() {
        user = new User();
        familyTree = new FamilyTree();
        familyTree.setId(1L);
    }

    @Test
    void getTotalViewsSinceCreationTest() {
        when(familyTreeRepository.findByUser(user)).thenReturn(Optional.of(familyTree));
        when(viewRepository.countByTree(familyTree)).thenReturn(10L);

        Long views = viewService.getTotalViewsSinceCreation(user);

        verify(familyTreeRepository).findByUser(user);
        verify(viewRepository).countByTree(familyTree);
        assertEquals(10L, views);
    }

    @Test
    void getViewsForLast7DaysTest() {
        when(familyTreeRepository.findByUser(user)).thenReturn(Optional.of(familyTree));
        when(viewRepository.countByTreeAndCreatedAtAfter(eq(familyTree), any())).thenReturn(5L);

        Long views = viewService.getViewsForLast7Days(user);

        verify(familyTreeRepository).findByUser(user);
        verify(viewRepository).countByTreeAndCreatedAtAfter(eq(familyTree), any());
        assertEquals(5L, views);
    }

    @Test
    void getViewsForLast30DaysTest() {
        when(familyTreeRepository.findByUser(user)).thenReturn(Optional.of(familyTree));
        when(viewRepository.countByTreeAndCreatedAtAfter(eq(familyTree), any())).thenReturn(15L);

        Long views = viewService.getViewsForLast30Days(user);

        verify(familyTreeRepository).findByUser(user);
        verify(viewRepository).countByTreeAndCreatedAtAfter(eq(familyTree), any());
        assertEquals(15L, views);
    }

    @Test
    void getViewCountsPerDaySinceCreationTest() {
        when(familyTreeRepository.findByUser(user)).thenReturn(Optional.of(familyTree));
        // Suppose the repository returns a list of Object arrays representing the date and count
        when(viewRepository.countViewsPerDayByTree(familyTree)).thenReturn(new ArrayList<>());

        List<Map<String, Long>> viewCounts = viewService.getViewCountsPerDaySinceCreation(user);

        verify(familyTreeRepository).findByUser(user);
        verify(viewRepository).countViewsPerDayByTree(familyTree);
        assertNotNull(viewCounts);
    }

    @Test
    void recordViewTest() {
        String privateCode = "privateCode";
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(user);
        when(familyTreeRepository.findById(1L)).thenReturn(Optional.of(familyTree));
        when(viewRepository.existsByUserAndTree(user, familyTree)).thenReturn(false);

        viewService.recordView(privateCode, 1L);

        verify(userRepository).findByPrivateCode(privateCode);
        verify(familyTreeRepository).findById(1L);
        verify(viewRepository).existsByUserAndTree(user, familyTree);
        verify(viewRepository).save(any());
    }


}
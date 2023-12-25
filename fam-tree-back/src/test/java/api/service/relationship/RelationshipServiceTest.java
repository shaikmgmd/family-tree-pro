package api.service.relationship;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.RelationshipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RelationshipServiceTest {

    @Mock
    private RelationshipRepository relationshipRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @InjectMocks
    private RelationshipService relationshipService;

    private FamilyMember sibling1;
    private FamilyMember sibling2;

    @BeforeEach
    void setUp() {
        sibling1 = new FamilyMember();
        sibling1.setBirthDate(LocalDate.of(1980, 1, 1));
        sibling2 = new FamilyMember();
        sibling2.setBirthDate(LocalDate.of(1990, 1, 1));
    }

    @Test
    void addRelationshipTest() {
        Long sourceMemberId = 1L;
        Long targetMemberId = 2L;
        RelationshipType type = RelationshipType.PARENT;

        FamilyMember sourceMember = new FamilyMember();
        sourceMember.setBirthDate(LocalDate.of(1950, 1, 1));
        FamilyMember targetMember = new FamilyMember();
        targetMember.setBirthDate(LocalDate.of(1970, 1, 1));

        when(familyMemberRepository.findById(sourceMemberId)).thenReturn(Optional.of(sourceMember));
        when(familyMemberRepository.findById(targetMemberId)).thenReturn(Optional.of(targetMember));

        relationshipService.addRelationship(sourceMemberId, targetMemberId, type);

        verify(relationshipRepository).save(any(Relationship.class));
    }

    @Test
    void addRelationshipThrowsExceptionWhenSourceMemberNotFoundTest() {
        Long invalidMemberId = 3L;
        Long targetMemberId = 2L;
        RelationshipType type = RelationshipType.PARENT;

        when(familyMemberRepository.findById(invalidMemberId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            relationshipService.addRelationship(invalidMemberId, targetMemberId, type);
        });
    }

    @Test
    void addRelationshipThrowsExceptionWhenRelationshipInvalidTest() {
        Long sourceMemberId = 1L;
        Long targetMemberId = 2L;
        RelationshipType type = RelationshipType.PARENT;

        FamilyMember sourceMember = mock(FamilyMember.class);
        FamilyMember targetMember = mock(FamilyMember.class);

        when(familyMemberRepository.findById(sourceMemberId)).thenReturn(Optional.of(sourceMember));
        when(familyMemberRepository.findById(targetMemberId)).thenReturn(Optional.of(targetMember));
        when(sourceMember.getBirthDate()).thenReturn(LocalDate.now());
        when(targetMember.getBirthDate()).thenReturn(LocalDate.now().minusYears(1));

        assertThrows(IllegalArgumentException.class, () -> {
            relationshipService.addRelationship(sourceMemberId, targetMemberId, type);
        });
    }

    @Test
    void isValidSiblingRelationshipTrueTest() {
        when(relationshipRepository.findCommonParents(sibling1.getId(), sibling2.getId())).thenReturn(List.of(new FamilyMember()));

        boolean result = relationshipService.isValidSiblingRelationship(sibling1, sibling2);

        assertTrue(result, "La méthode doit retourner true si les membres ont un parent commun.");
    }

    @Test
    void isValidSiblingRelationshipFalseTest() {
        when(relationshipRepository.findCommonParents(sibling1.getId(), sibling2.getId())).thenReturn(List.of());

        boolean result = relationshipService.isValidSiblingRelationship(sibling1, sibling2);

        assertFalse(result, "La méthode doit retourner false si les membres n'ont pas de parent commun.");
    }

}


/*
package api.service.tree;

import api.model.tree.*;
import api.model.tree.relationship.AddMemberRequest;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.RelationshipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FamilyTreeServiceTest {

    @Mock
    private FamilyTreeRepository familyTreeRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private RelationshipRepository relationshipRepository;

    @Mock
    private PersonneService personneService;

    @InjectMocks
    private FamilyTreeService familyTreeService;

    private FamilyTree familyTree;
    private FamilyMember familyMember;
    private AddMemberRequest addMemberRequest;

    @BeforeEach
    void setUp() {
        familyTree = new FamilyTree();
        familyTree.setId(1L);

        familyMember = new FamilyMember();
        familyMember.setId(1L);
        familyMember.setTree(familyTree);

        addMemberRequest = new AddMemberRequest();
        addMemberRequest.setName("New Member");
        addMemberRequest.setBirthDate(LocalDate.now());
        addMemberRequest.setType(RelationshipType.CHILD);
    }

    @Test
    void getFamilyTreeByUserId_Success() {
        when(familyTreeRepository.findByUserId(1L)).thenReturn(Optional.of(familyTree));
        when(personneService.findByTreeId(familyTree.getId())).thenReturn(new ArrayList<>());

        List<Map<String, Object>> result = familyTreeService.getFamilyTreeByUserId(1L);

        assertNotNull(result);
        verify(familyTreeRepository).findByUserId(1L);
        verify(personneService).findByTreeId(familyTree.getId());
    }

    @Test
    void getFamilyTreeByUserId_NotFound() {
        when(familyTreeRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            familyTreeService.getFamilyTreeByUserId(1L);
        });
    }

    @Test
    void addMemberToTree_Success() {
        when(familyMemberRepository.findById(1L)).thenReturn(Optional.of(familyMember));

        familyTreeService.addMemberToTree(1L, 1L, addMemberRequest);

        verify(familyMemberRepository).save(any(FamilyMember.class));
        verify(relationshipRepository).save(any(Relationship.class));
    }

    @Test
    void addMemberToTree_SourceMemberNotFound() {
        when(familyMemberRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            familyTreeService.addMemberToTree(1L, 1L, addMemberRequest);
        });
    }

    @Test
    void updateMemberToTree_Success() {
        when(familyMemberRepository.findById(1L)).thenReturn(Optional.of(familyMember));
        when(familyMemberRepository.save(any(FamilyMember.class))).thenReturn(familyMember);

        FamilyMember result = familyTreeService.updateMemberToTree(1L, addMemberRequest);

        assertNotNull(result);
        verify(familyMemberRepository).findById(1L);
        verify(familyMemberRepository).save(any(FamilyMember.class));
    }

    @Test
    void updateMemberToTree_MemberNotFound() {
        when(familyMemberRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            familyTreeService.updateMemberToTree(1L, addMemberRequest);
        });
    }

    @Test
    void deleteMemberToTree_Success() {
        when(familyMemberRepository.existsById(1L)).thenReturn(true);

        familyTreeService.deleteMemberToTree(1L);

        verify(familyMemberRepository).deleteById(1L);
        verify(relationshipRepository).deleteBySourceMemberId(1L);
        verify(relationshipRepository).deleteByTargetMemberId(1L);
    }

    @Test
    void deleteMemberToTree_MemberNotFound() {
        when(familyMemberRepository.existsById(1L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> {
            familyTreeService.deleteMemberToTree(1L);
        });
    }

    @Test
    void deleteRelatedRelations_Success() {
        List<Relationship> mockRelations = Collections.emptyList();
        when(relationshipRepository.findByPerson_Id(1L)).thenReturn(mockRelations);
        when(relationshipRepository.findByMother_Id(1L)).thenReturn(mockRelations);
        when(relationshipRepository.findByPartner_Id(1L)).thenReturn(mockRelations);

        familyTreeService.deleteRelatedRelations(1L);

        verify(relationshipRepository).findByPerson_Id(1L);
        verify(relationshipRepository).findByMother_Id(1L);
        verify(relationshipRepository).findByPartner_Id(1L);
        verify(relationshipRepository, times(3)).deleteAll(mockRelations);
    }

}
*/

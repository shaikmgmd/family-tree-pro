/*
package api.service.tree;

import api.model.tree.*;
import api.model.tree.relationship.AddMemberRequest;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import api.model.user.User;
import api.repository.tree.*;
import api.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PersonneServiceTest {

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private RelationRepository relationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FamilyTreeRepository familyTreeRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private RelationshipRepository relationshipRepository;

    @InjectMocks
    private PersonneService personneService;

    @InjectMocks
    private FamilyTreeService familyTreeService;

    @Test
    void findByTreeId_WithValidTreeId_ShouldReturnPersonneList() {
        Long treeId = 1L;
        List<Personne> mockPersonnes = Arrays.asList(new Personne(), new Personne());
        Mockito.when(personneRepository.findByTreeId(treeId)).thenReturn(mockPersonnes);

        List<Map<String, Object>> result = personneService.findByTreeId(treeId);

        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals(mockPersonnes.size(), result.size());
    }

    @Test
    void findByTreeId_WithInvalidTreeId_ShouldReturnEmptyList() {
        Long treeId = 2L;
        Mockito.when(personneRepository.findByTreeId(treeId)).thenReturn(Collections.emptyList());

        List<Map<String, Object>> result = personneService.findByTreeId(treeId);

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    void createAndSaveNewPerson_WithValidData_ShouldCreatePerson() {
        // Simuler un utilisateur existant
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setPrivateCode("somePrivateCode");
        Mockito.when(userRepository.findByPrivateCode("somePrivateCode")).thenReturn(mockUser);

        // Simuler l'authentification
        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        Mockito.when(authentication.getPrincipal()).thenReturn("somePrivateCode");
        SecurityContextHolder.setContext(securityContext);

        // Simuler un arbre généalogique existant
        FamilyTree mockFamilyTree = new FamilyTree();
        mockFamilyTree.setId(1L);
        Mockito.when(familyTreeRepository.findByUserId(mockUser.getId())).thenReturn(Optional.of(mockFamilyTree));

        // Simuler personneRepository pour renvoyer un objet Personne après l'appel à save
        Personne savedPersonne = new Personne();
        savedPersonne.setId(1L);
        Mockito.when(personneRepository.save(Mockito.any(Personne.class))).thenReturn(savedPersonne);

        // Arrange
        Map<String, Object> validPersonData = new HashMap<>();
        validPersonData.put("name", "John Doe");
        validPersonData.put("gender", "Male");
        // Ajoutez d'autres champs requis ici
        Map<String, Long> idMapping = new HashMap<>();

        // Act
        Long savedPersonId = personneService.createAndSaveNewPerson(validPersonData, idMapping);

        // Assert
        assertNotNull(savedPersonId);
        assertEquals(1L, savedPersonId); // Vérifiez que l'ID renvoyé est correct

        // Vérifier si la méthode save de personneRepository a été appelée avec les bons attributs
        ArgumentCaptor<Personne> personneCaptor = ArgumentCaptor.forClass(Personne.class);
        Mockito.verify(personneRepository).save(personneCaptor.capture());
        Personne savedPerson = personneCaptor.getValue();

        // Vérifiez que les attributs de l'objet Personne sont correctement définis
        assertEquals("John Doe", savedPerson.getName());
        assertEquals("Male", savedPerson.getGender());
    }

    @Test
    void createAndSaveNewPerson_WithInvalidData_ShouldThrowException() {
        // Arrange
        Map<String, Object> invalidPersonData = new HashMap<>();
        // Laissez certains champs obligatoires vides ou mettez des valeurs invalides
        Map<String, Long> idMapping = new HashMap<>();

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            personneService.createAndSaveNewPerson(invalidPersonData, idMapping);
        });
    }

    @Test
    void testAddMemberToTreeWithValidData() {
        // Simuler un utilisateur existant
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setPrivateCode("somePrivateCode");
        Mockito.lenient().when(userRepository.findByPrivateCode("somePrivateCode")).thenReturn(mockUser);

        // Simuler un arbre généalogique existant
        FamilyTree mockFamilyTree = new FamilyTree();
        mockFamilyTree.setId(1L);
        Mockito.lenient().when(familyTreeRepository.findByUserId(mockUser.getId())).thenReturn(Optional.of(mockFamilyTree));

        // Simuler un membre source existant
        FamilyMember sourceMember = new FamilyMember();
        sourceMember.setId(1L);  // ID du membre source
        Mockito.when(familyMemberRepository.findById(1L)).thenReturn(Optional.of(sourceMember));

        // Arrange
        AddMemberRequest addMemberRequest = new AddMemberRequest();
        addMemberRequest.setName("Alice");
        addMemberRequest.setBirthDate(LocalDate.now());
        addMemberRequest.setType(RelationshipType.CHILD);  // Assurez-vous que ce type est correct

        FamilyMember newMember = new FamilyMember();
        newMember.setName("Alice");
        newMember.setBirthDate(LocalDate.now());
        when(familyMemberRepository.save(any(FamilyMember.class))).thenReturn(newMember);

        // Act
        familyTreeService.addMemberToTree(mockUser.getId(), sourceMember.getId(), addMemberRequest);

        // Assert
        verify(familyMemberRepository).save(any(FamilyMember.class));

    }


    @Test
    void testUpdateTreeNodeWithValidData() {
        // Simuler un utilisateur existant
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setPrivateCode("somePrivateCode");
        Mockito.lenient().when(userRepository.findByPrivateCode("somePrivateCode")).thenReturn(mockUser);

        // Simuler un arbre généalogique existant
        FamilyTree mockFamilyTree = new FamilyTree();
        mockFamilyTree.setId(1L);
        Mockito.lenient().when(familyTreeRepository.findByUserId(mockUser.getId())).thenReturn(Optional.of(mockFamilyTree));

        // Arrange
        Long memberId = 1L;
        FamilyMember existingMember = new FamilyMember();
        existingMember.setId(memberId);
        existingMember.setName("Alice");
        existingMember.setBirthDate(LocalDate.now());
        existingMember.setTree(mockFamilyTree);

        // Arrange
        AddMemberRequest addMemberRequest = new AddMemberRequest();
        addMemberRequest.setName("Updated Alice");
        addMemberRequest.setBirthDate(LocalDate.now());
        addMemberRequest.setType(RelationshipType.CHILD);  // Assurez-vous que ce type est correct

        when(familyMemberRepository.findById(memberId)).thenReturn(Optional.of(existingMember));
        when(familyMemberRepository.save(any(FamilyMember.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        existingMember.setName("Updated Alice");
        FamilyMember updatedMember = familyTreeService.updateMemberToTree(memberId, addMemberRequest);

        // Assert
        assertNotNull(updatedMember);
        assertEquals("Updated Alice", updatedMember.getName());
        verify(familyMemberRepository).save(any(FamilyMember.class));
    }

    @Test
    void testDeleteTreeNodeWithValidData() {
        // Arrange
        Long memberId = 1L;
        when(familyMemberRepository.existsById(memberId)).thenReturn(true);

        // Act
        familyTreeService.deleteMemberToTree(memberId);

        // Assert
        verify(familyMemberRepository).deleteById(memberId);
    }

    @Test
    void testTreeNodeManagingWithInvalidData() {
        // Arrange
        Long invalidMemberId = 999L;
        when(familyMemberRepository.findById(invalidMemberId)).thenReturn(Optional.empty());

        AddMemberRequest updateRequest = new AddMemberRequest();
        // Configurer updateRequest avec des données de test si nécessaire

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> {
            familyTreeService.updateMemberToTree(invalidMemberId, updateRequest);
        });
    }


    @Test
    void testDeleteRelatedRelationsForSpecificPerson() {
        // Arrange
        Long personId = 1L;
        List<Relationship> mockRelations = new ArrayList<>();

        Mockito.when(relationshipRepository.findByPerson_Id(personId)).thenReturn(mockRelations);
        Mockito.when(relationshipRepository.findByMother_Id(personId)).thenReturn(mockRelations);
        Mockito.when(relationshipRepository.findByPartner_Id(personId)).thenReturn(mockRelations);

        // Act
        familyTreeService.deleteRelatedRelations(personId);

        // Assert
        verify(relationshipRepository).findByPerson_Id(personId);
        verify(relationshipRepository).findByMother_Id(personId);
        verify(relationshipRepository).findByPartner_Id(personId);
        verify(relationshipRepository, times(3)).deleteAll(mockRelations);
    }

}

*/

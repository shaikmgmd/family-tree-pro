package api.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class BaseEntityTest {
    private BaseEntity baseEntity;

    @BeforeEach
    void setUp() {
        baseEntity = new BaseEntity() {};
    }

    @Test
    void testId() {
        Long id = 1L;
        baseEntity.setId(id);
        assertEquals(id, baseEntity.getId());
    }

    @Test
    void testVersion() {
        Integer version = 1;
        baseEntity.setVersion(version);
        assertEquals(version, baseEntity.getVersion());
    }
}

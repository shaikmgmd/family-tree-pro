package api.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class BaseEntityWithAuditTest {
    private BaseEntityWithAudit baseEntityWithAudit;

    @BeforeEach
    void setUp() {
        baseEntityWithAudit = new BaseEntityWithAudit();
    }

    @Test
    void testCreatedAt() {
        LocalDateTime now = LocalDateTime.now();
        baseEntityWithAudit.setCreatedAt(now);
        assertEquals(now, baseEntityWithAudit.getCreatedAt());
    }

    @Test
    void testUpdatedAt() {
        LocalDateTime now = LocalDateTime.now();
        baseEntityWithAudit.setUpdatedAt(now);
        assertEquals(now, baseEntityWithAudit.getUpdatedAt());
    }
}

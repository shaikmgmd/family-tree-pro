package api.repository.view;

import api.model.tree.FamilyTree;
import api.model.user.User;
import api.model.view.View;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface ViewRepository extends JpaRepository<View, Long> {
    Long countByTree(FamilyTree tree);

    @Query("SELECT FUNCTION('date', v.createdAt) as date, COUNT(v) as count " +
            "FROM View v WHERE v.tree = :tree " +
            "GROUP BY FUNCTION('date', v.createdAt) ORDER BY FUNCTION('date', v.createdAt)")
    List<Object[]> countViewsPerDayByTree(@Param("tree") FamilyTree tree);
    View findByUserAndTree(User user, FamilyTree tree);
    Long countByUserAndCreatedAtAfter(User user, LocalDateTime date);

    Long countByTreeAndCreatedAtAfter(FamilyTree tree, LocalDateTime date);


    /*List<Object[]> countViewsPerDayByUserAndCreatedAtAfter(User user, LocalDateTime date);*/
    @Query("SELECT FUNCTION('date', v.createdAt) as date, COUNT(v) as count " +
            "FROM View v WHERE v.user = :user AND v.createdAt >= :startDate " +
            "GROUP BY FUNCTION('date', v.createdAt) ORDER BY FUNCTION('date', v.createdAt)")
    List<Object[]> countViewsPerDayByUserAndCreatedAtAfter(@Param("user") User user, @Param("startDate") LocalDateTime startDate);

    boolean existsByUserAndTree(User user, FamilyTree tree);

}


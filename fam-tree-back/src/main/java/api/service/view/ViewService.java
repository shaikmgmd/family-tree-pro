package api.service.view;

import api.model.tree.FamilyTree;
import api.model.user.User;
import api.model.view.View;
import api.repository.tree.FamilyTreeRepository;
import api.repository.user.UserRepository;
import api.repository.view.ViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ViewService {
    private final ViewRepository viewRepository;
    private final FamilyTreeRepository familyTreeRepository;
    private final UserRepository userRepository;

    public Long getTotalViewsSinceCreation(User user) {
        Optional<FamilyTree> treeOpt = familyTreeRepository.findByUser(user);
        FamilyTree userTree = treeOpt.get();
        return viewRepository.countByTree(userTree);
    }

    public Long getViewsForLast7Days(User user) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        Optional<FamilyTree> treeOpt = familyTreeRepository.findByUser(user);
        if (!treeOpt.isPresent()) {
            return 0L;
        }
        FamilyTree userTree = treeOpt.get();
        return viewRepository.countByTreeAndCreatedAtAfter(userTree, sevenDaysAgo);
    }

    public Long getViewsForLast30Days(User user) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Optional<FamilyTree> treeOpt = familyTreeRepository.findByUser(user);
        if (!treeOpt.isPresent()) {
            return 0L;
        }
        FamilyTree userTree = treeOpt.get();
        return viewRepository.countByTreeAndCreatedAtAfter(userTree, thirtyDaysAgo);
    }


    public List<Map<String, Long>> getViewCountsPerDaySinceCreation(User user) {
        Optional<FamilyTree> treeOpt = familyTreeRepository.findByUser(user);
        FamilyTree userTree = treeOpt.get();
        return getViewCountsPerDay(userTree);
    }

    private List<Map<String, Long>> getViewCountsPerDay(FamilyTree tree) {
        List<Object[]> counts = viewRepository.countViewsPerDayByTree(tree);
        List<Map<String, Long>> dailyCounts = new ArrayList<>();
        for (Object[] count : counts) {
            Map<String, Long> dailyCount = new LinkedHashMap<>();

            // Convert java.sql.Date to java.time.LocalDate
            LocalDate date = ((java.sql.Date) count[0]).toLocalDate();

            Long viewCount = (Long) count[1];
            dailyCount.put(date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), viewCount);
            dailyCounts.add(dailyCount);
        }
        return dailyCounts;
    }


    @Transactional
    public void recordView(String privateCode, Long treeId) {
        User user = userRepository.findByPrivateCode(privateCode);
        FamilyTree tree = familyTreeRepository.findById(treeId).orElse(null);
        if (user == null || tree == null) {
            return;
        }
        boolean viewExists = viewRepository.existsByUserAndTree(user, tree);
        if (!viewExists) {
            View newView = new View();
            newView.setUser(user);
            newView.setTree(tree);
            viewRepository.save(newView);
        }
        // If the view already exists, do nothing to avoid counting repeat views.
    }
}

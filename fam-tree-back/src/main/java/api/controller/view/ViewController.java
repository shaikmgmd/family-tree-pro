package api.controller.view;

import api.common.ApiResponse;
import api.model.user.User;
import api.repository.user.UserRepository;
import api.service.view.ViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("${api.base.url}/view")
@RequiredArgsConstructor
public class ViewController {
    private final ViewService viewService;
    private final UserRepository userRepository;

    @GetMapping("/total-since-creation")
    public ResponseEntity<ApiResponse<Long>> getTotalViewsSinceCreation() {
        User currUser = getCurrentUser();
        ApiResponse<Long> response = new ApiResponse<>(viewService.getTotalViewsSinceCreation(currUser));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/last-7-days")
    public ResponseEntity<ApiResponse<Long>> getViewsForLast7Days() {
        User currUser = getCurrentUser();
        ApiResponse<Long> response = new ApiResponse<>(viewService.getViewsForLast7Days(currUser));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/last-30-days")
    public ResponseEntity<ApiResponse<Long>> getViewsForLast30Days() {
        User currUser = getCurrentUser();
        ApiResponse<Long> response = new ApiResponse<>(viewService.getViewsForLast30Days(currUser));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/record")
    public ResponseEntity<ApiResponse<String>> recordView(@RequestParam Long treeId) {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        viewService.recordView(currentPrivateCode, treeId);
        ApiResponse<String> response = new ApiResponse<>("Vue enrigistré");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/views-per-day-since-creation")
    public ResponseEntity<ApiResponse<List<Map<String, Long>>>> getViewsPerDaySinceCreation() {
        User currUser = getCurrentUser();
        List<Map<String, Long>> viewsPerDay = viewService.getViewCountsPerDaySinceCreation(currUser);
        ApiResponse<List<Map<String, Long>>> response = new ApiResponse<>(viewsPerDay);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private User getCurrentUser() {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByPrivateCode(currentPrivateCode);
    }
}


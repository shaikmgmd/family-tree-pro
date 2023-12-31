package api.controller.user;

import api.common.ApiResponse;
import api.model.user.User;
import api.model.user.UserUpdate;
import api.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("${api.base.url}/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<User>> findConnectedUser() {
        ApiResponse<User> response = new ApiResponse<>(userService.getCurrentConnectedUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<ApiResponse<User>> updateConnectedUser(@RequestBody UserUpdate userUpdate) {
        ApiResponse<User> response = new ApiResponse<>(userService.updateUser(userUpdate));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all-except-current/{page}/{size}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllUsersExceptCurrent(
            @PathVariable int page,
            @PathVariable int size) {
        Map<String, Object> response = new HashMap<>();
        List<User> users = userService.getAllUsersExceptCurrent(page, size);
        boolean hasMore = userService.hasMore(page, size); // Méthode pour déterminer s'il y a plus d'utilisateurs
        response.put("users", users);
        response.put("hasMore", hasMore);

        ApiResponse<Map<String, Object>> apiResponse = new ApiResponse<>(response);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/all-except-current-no-pagination")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsersExceptCurrentWoutPagination() {
        ApiResponse<List<User>> users = new ApiResponse<>(userService.findAllUsersExceptCurrentWoutPagination());
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long userId) {
        ApiResponse<User> user = new ApiResponse<>(userService.findUserById(userId));
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        ApiResponse<List<User>> users = new ApiResponse<>(userService.getAllUsers());
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}

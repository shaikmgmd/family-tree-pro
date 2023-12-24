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

import java.util.List;

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

    // Endpoint pour récupérer tous les utilisateurs sauf l'utilisateur actuel
    @GetMapping("/all-except-current")
    public ResponseEntity<List<User>> getAllUsersExceptCurrent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size) {
        System.out.println("----------------page---------------------\n");
        System.out.println(page);
        System.out.println("----------------size---------------------\n");
        System.out.println(size);
        List<User> users = userService.getAllUsersExceptCurrent(page, size);
        System.out.println("users : " + users);
        return ResponseEntity.ok(users);
    }

    // Endpoint pour récupérer un utilisateur spécifique par son ID
    @GetMapping("/all-except-current/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user); // avec le statut HTTP 200 (OK)
    }
}

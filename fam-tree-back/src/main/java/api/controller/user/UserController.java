package api.controller.user;

import api.common.ApiResponse;
import api.model.user.User;
import api.model.user.UserUpdate;
import api.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

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

}

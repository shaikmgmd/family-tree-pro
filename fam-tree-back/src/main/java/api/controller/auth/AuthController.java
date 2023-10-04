package api.controller.auth;

import api.common.ApiResponse;
import api.model.auth.request.LoginReq;
import api.model.auth.request.SignUpReq;
import api.model.auth.response.LoginRes;
import api.model.user.PasswordUpdateRequest;
import api.model.user.User;
import api.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base.url}/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/sign-in")
    public ResponseEntity<ApiResponse<LoginRes>> signIn(@RequestBody LoginReq loginReq) {
        ApiResponse<LoginRes> response = new ApiResponse<>(authService.login(loginReq));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/update-first-password")
    public ResponseEntity<ApiResponse<User>> updateFirstPassword(@RequestBody PasswordUpdateRequest request) {
        ApiResponse<User> response = new ApiResponse<>(authService
                .handleFirstLoginPasswordUpdate(request.getPrivateCode(), request.getNewPassword()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

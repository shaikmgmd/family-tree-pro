package api.controller.role;

import api.common.ApiResponse;
import api.model.auth.response.LoginRes;
import api.service.role.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base.url}/role")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/add-admin/{userId}")
    public ResponseEntity<ApiResponse<String>> addAdminRole(@PathVariable Long userId) {
        ApiResponse<String> response = new ApiResponse<>(roleService.addAdminRoleToUser(userId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/remove-admin/{userId}")
    public ResponseEntity<ApiResponse<String>> removeAdminRole(@PathVariable Long userId) {
        ApiResponse<String> response = new ApiResponse<>(roleService.removeAdminRoleFromUser(userId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}


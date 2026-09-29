package com.library.library_management.controller;

import com.library.library_management.model.User;
import com.library.library_management.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ==========================================
    // GET ALL USERS
    // ==========================================

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ==========================================
    // GET USER
    // ==========================================

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public User register(
            @RequestBody User user
    ) {
        return userService.register(user);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public User login(
            @RequestBody LoginRequest request
    ) {

        return userService.login(
                request.getEmail(),
                request.getPassword()
        );
    }

    // ==========================================
    // UPDATE
    // ==========================================

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ) {

        return userService.updateUser(id, user);
    }

    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "success", true,
                        "message", "User deleted successfully"
                )
        );
    }

    // ==========================================
    // PROMOTE USER TO ADMIN
    // ==========================================

    @PutMapping("/{id}/promote")
    public User promoteToAdmin(
            @PathVariable Long id
    ) {

        return userService.promoteToAdmin(id);
    }

    // ==========================================
    // LOGIN REQUEST
    // ==========================================

    public static class LoginRequest {

        private String email;
        private String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
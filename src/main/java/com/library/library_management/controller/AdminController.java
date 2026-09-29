package com.library.library_management.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private static final String ADMIN_EMAIL =
            "admin@gmail.com";

    private static final String ADMIN_PASSCODE =
            "1234";

    @PostMapping("/login")
    public AdminLoginResponse login(
            @RequestBody AdminLoginRequest request
    ) {

        if (ADMIN_EMAIL.equals(request.getEmail())
                && ADMIN_PASSCODE.equals(request.getPasscode())) {

            return new AdminLoginResponse(
                    true,
                    "Admin login successful"
            );
        }

        return new AdminLoginResponse(
                false,
                "Invalid admin email or passcode"
        );
    }

    // ==========================================
    // LOGIN REQUEST
    // ==========================================

    public static class AdminLoginRequest {

        private String email;
        private String passcode;

        public AdminLoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPasscode() {
            return passcode;
        }

        public void setPasscode(String passcode) {
            this.passcode = passcode;
        }
    }

    // ==========================================
    // LOGIN RESPONSE
    // ==========================================

    public static class AdminLoginResponse {

        private boolean success;
        private String message;

        public AdminLoginResponse(
                boolean success,
                String message
        ) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}
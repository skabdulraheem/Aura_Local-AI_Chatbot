// AuthController.java
package com.ai.chatbot_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Simple validation - you can enhance this later
        if (email != null && password != null) {
            Map<String, Object> response = new HashMap<>();
            Map<String, String> user = new HashMap<>();
            user.put("name", email.split("@")[0]);
            user.put("email", email);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> userData) {
        String name = userData.get("name");
        String email = userData.get("email");
        String password = userData.get("password");

        if (name != null && email != null && password != null) {
            Map<String, Object> response = new HashMap<>();
            Map<String, String> user = new HashMap<>();
            user.put("name", name);
            user.put("email", email);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Invalid user data");
    }
}
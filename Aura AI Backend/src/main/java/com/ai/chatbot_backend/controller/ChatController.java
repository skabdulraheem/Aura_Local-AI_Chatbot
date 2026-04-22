package com.ai.chatbot_backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import com.ai.chatbot_backend.service.OllamaService;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private OllamaService ollamaService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> request) {
        try {
            String message = (String) request.get("message");
            List<Map<String, String>> history = (List<Map<String, String>>) request.get("history");

            System.out.println("Received message: " + message);
            System.out.println("History size: " + (history != null ? history.size() : 0));

            // Get response from Ollama
            String response = ollamaService.generateResponse(message, history);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("response", response);

            return ResponseEntity.ok(responseBody);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorBody = new HashMap<>();

            if (e.getMessage().contains("Connection refused")) {
                errorBody.put("error", "Cannot connect to Ollama. Make sure Ollama is running (it is running based on your curl test)");
            } else if (e.getMessage().contains("Ollama")) {
                errorBody.put("error", "Ollama error: " + e.getMessage());
            } else {
                errorBody.put("error", "Server error: " + e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBody);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "connected");
        status.put("timestamp", System.currentTimeMillis());
        status.put("message", "Backend is running");

        // Check if Ollama is available
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject("http://localhost:11434/api/tags", String.class);
            status.put("ollama", "connected");
            status.put("ollama_models", response);
        } catch (Exception e) {
            status.put("ollama", "disconnected");
            status.put("ollama_error", e.getMessage());
        }

        return ResponseEntity.ok(status);
    }

    @GetMapping("/test-ollama")
    public ResponseEntity<?> testOllama() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject("http://localhost:11434/api/tags", String.class);
            return ResponseEntity.ok(Map.of(
                    "status", "Ollama is running",
                    "models", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "Ollama connection failed",
                    "error", e.getMessage()
            ));
        }
    }
}
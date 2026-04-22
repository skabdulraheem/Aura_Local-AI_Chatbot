package com.ai.chatbot_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class OllamaService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String OLLAMA_URL = "http://localhost:11434/api/chat";
    private final String MODEL = "phi3";

    public OllamaService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateResponse(String message, List<Map<String, String>> history) {
        try {
            // Prepare the messages list
            List<Map<String, String>> messages = new ArrayList<>();

            // Add history messages
            if (history != null && !history.isEmpty()) {
                messages.addAll(history);
            }

            // Add the current user message
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", message);
            messages.add(userMessage);

            // Prepare the request body for Ollama
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", MODEL);
            requestBody.put("messages", messages);
            requestBody.put("stream", false);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make the request to Ollama
            ResponseEntity<String> response = restTemplate.postForEntity(
                    OLLAMA_URL,
                    entity,
                    String.class
            );

            // Parse the response
            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.has("message") && root.get("message").has("content")) {
                return root.get("message").get("content").asText();
            }

            return "Sorry, I couldn't generate a response.";

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to communicate with Ollama: " + e.getMessage());
        }
    }
}
package com.ai.chatbot_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OllamaRequest {

    private String model;
    private String prompt;
    private boolean stream;

    @JsonProperty("model")
    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    @JsonProperty("prompt")
    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    @JsonProperty("stream")
    public boolean isStream() {
        return stream;
    }

    public void setStream(boolean stream) {
        this.stream = stream;
    }
}
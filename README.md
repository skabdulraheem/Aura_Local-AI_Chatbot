# 🤖 Aura AI Chatbot

An AI-powered chatbot application built using **Java Spring Boot** and integrated with **Ollama AI** for natural language processing. This project demonstrates backend development, REST API design, and AI integration to deliver intelligent and scalable conversational responses.

---

## 🚀 Features

- 💬 AI-based conversational chatbot  
- 🔗 Integration with Ollama AI for smart responses  
- ⚡ RESTful APIs for seamless communication  
- 🔒 Scalable backend using Spring Boot  
- 🧠 Intelligent request and response handling  
- 🗄️ MySQL database integration  

---

## 🛠️ Tech Stack

- **Backend:** Java, Spring Boot  
- **AI:** Ollama AI  
- **Database:** MySQL  
- **Tools:** Git, GitHub, Postman  

---

## 🔄 Workflow

The Aura AI Chatbot follows a structured backend flow to process user queries and generate intelligent responses.

### 1. User Request
- User sends a message to the API endpoint (`/api/chat`) in JSON format.

### 2. Controller Layer
- Receives the HTTP request  
- Validates input data  
- Forwards the request to the service layer  

### 3. Service Layer
- Handles core business logic  
- Processes user input  
- Sends request to AI layer  

### 4. AI Processing (Ollama AI)
- Message is sent to Ollama AI  
- AI performs NLP processing  
- Generates a response  

### 5. Response Handling
- Receives AI output  
- Applies formatting if needed   

### 6. Final Response
- Response returned as JSON to user  

---

## 📡 API Endpoints

### 🔹 Chat API

**POST** `/api/chat`

## 📸 Screenshots

![Chat Response](https://github.com/user-attachments/assets/0a8c758d-5fb8-4e8e-8ae1-807da0bc36a4)

## 🌐 Deployment Status

> ⚠️ This application is currently configured to run in a **local development environment only**.

- The chatbot integrates with **Ollama AI**, which runs locally on the machine.
- Due to this dependency, the application is not deployed to a public server.
- All APIs can be tested using `localhost` (e.g., `http://localhost:8080/api/chat`).

---

## ⚠️ Limitations

- Requires **local Ollama setup** to function  
- Not accessible over the internet  
- No cloud deployment yet  

---

## 🚀 Future Enhancements

- ☁️ Deploy backend to cloud (AWS / Render / Railway)  
- 🌍 Make chatbot publicly accessible  
- 🔗 Replace local Ollama with hosted AI APIs (if needed)  

---
## 👨‍💻 Author **Raheem** 
📌 Open to opportunities in **Java Full Stack Development** --- 
## ⭐ Support If you like this project, give it a ⭐ on GitHub!

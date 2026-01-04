# JarvisOS 🤖⚡

JarvisOS is a **futuristic hybrid AI operating system (demo project)** built to explore how a next-generation AI assistant can think, adapt, and interact across different modes and environments.

This project is **not just a chatbot** — it is a modular AI core designed with clear separation of intelligence layers, offline-first operation, and optional online augmentation.

> JarvisOS is currently text-based.  
> **In the near future, Jarvis will listen, understand, and speak.**

---

## ✨ Key Features

### 🧠 Hybrid Intelligence
- **Offline Mode** – Local LLM via Ollama (private, fast, zero cost)
- **Online Mode** – Optional cloud LLM integration (enhanced reasoning & fresher knowledge)
- Seamless switching between offline and online modes

### 🎭 Personality System
- 5 distinct personality modes:
  - `neutral`
  - `assistant`
  - `technical`
  - `minimal`
  - `creative`
- Personality controls **tone and style**, not system logic
- Can be stacked with verbosity control and real-time awareness

### 📏 Verbosity Control
- Dynamic response length control
- Short, concise answers by default
- Detailed explanations when explicitly requested

### 🌐 Real-Time Awareness
- Detects when questions may require live or current information
- Responds transparently instead of hallucinating outdated facts
- Encourages ethical and honest AI behavior

### 🧠 Session Memory
- Maintains conversational context per session
- Lightweight in-memory implementation for demo purposes

### 🔐 Permission & Safety Layer
- Tool execution protected by project-level permissions
- Prevents unsafe or unauthorized actions

### 🌌 Futuristic UI
- Sci‑fi inspired interface
- Glassmorphism with neon accents
- HUD-style controls for mode and personality selection

---

## 🏗️ Architecture Overview

```
Frontend (React UI)
        ↓
Backend API (Node + Express)
        ↓
JarvisOS Core
 ├─ Intent Engine
 ├─ Personality Layer
 ├─ Verbosity Control
 ├─ Real-Time Awareness
 ├─ Permission System
 ├─ Session Memory
 └─ LLM Adapter
       ├─ Offline LLM (Ollama)
       └─ Online LLM (Cloud API)
```

JarvisOS is designed to be **offline-first**, with online intelligence enabled only when explicitly requested.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### AI / LLM
- Ollama (local LLM)
- Optional cloud LLM (online mode)

---

## ⚠️ Demo Limitations

This repository represents a **demo / prototype** version of JarvisOS.

Current limitations:
- No persistent database (memory resets on restart)
- Online mode depends on free-tier APIs
- No voice input or output yet
- No authentication or user profiles

These limitations are intentional to keep the system lightweight and focused on architecture and design.

---

## 🔮 Future Roadmap

JarvisOS is designed to evolve into a **full AI assistant platform**.

Planned enhancements include:
- 🎙️ Voice input (Jarvis will listen)
- 🗣️ Voice output (Jarvis will speak)
- 🔄 Persistent long-term memory
- 🧩 Plugin and skill system
- 🌍 Smarter real-time data tools
- 🖥️ Desktop and mobile integration

> JarvisOS will communicate with us more naturally in the near future — listening, understanding, and speaking like a true assistant.

---

## 🎯 Purpose of This Project

This project was built to:
- Explore AI system design beyond simple chatbots
- Demonstrate clean, modular architecture
- Practice ethical and transparent AI behavior
- Serve as a strong **portfolio and internship project**

---

## 📌 Disclaimer

JarvisOS is **not affiliated** with Marvel or Iron Man.  
The name is used purely as inspiration for a futuristic AI assistant concept.

---

## 🙌 Author

Built with passion by **Kalana**  
Focused on futuristic interfaces, intelligent systems, and next-generation AI experiences.

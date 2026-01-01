# Universal Jarvis – Engineering Workflow Log

## Project Overview
The goal of this project is to build a zero-cost, modular AI assistant system ("Universal Jarvis") that can be reused across multiple applications (web, desktop, mobile) with project-specific limitations and permissions.

The system is designed to run entirely on local infrastructure for learning and internship preparation purposes.

---

## Day 1 – Jarvis Core Setup & Local AI Integration

### Date
2026-01-01

### Objective
- Initialize the backend server using Node.js and Express
- Design the base architecture for Jarvis Core
- Implement a simple Chat API
- Connect the Chat API to a locally running Ollama LLM

---

### Tasks Completed
- Set up Node.js project structure
- Installed and configured Express.js
- Created a basic `/chat` API endpoint
- Verified local Ollama model availability
- Planned separation between API layer and AI logic layer

---

### Architecture Decisions

#### Why Local AI (Ollama)?
- Zero operating cost
- No dependency on external APIs
- Enables offline usage
- Suitable for learning AI system integration

#### Why Separate Jarvis Core from API?
- Allows reuse of Jarvis logic across platforms
- Keeps AI logic independent from HTTP transport
- Makes future expansion (desktop/mobile) easier

---

### Technical Implementation Notes

- Ollama runs locally as a background service
- Communication with the model is done via HTTP requests to Ollama's local API
- The backend server acts as a middle layer between frontend clients and the AI model

---

### Challenges Faced
- Understanding how to communicate with a locally installed Ollama model
- Designing a clean API that does not tightly couple AI logic with routes

---

### What I Learned
- Local LLMs can be integrated via simple HTTP calls
- Proper folder structure early prevents major refactoring later
- AI systems should be designed as modular services, not hardcoded logic

---

## Day 1 – Jarvis Decision Layer

### Objective
Introduce a basic Jarvis decision-making layer between the API and the AI model.

### Implementation
- Created a `jarvisEngine` to handle decision logic
- Implemented rule-based intent detection
- Routed repair-related messages to a specialized prompt

### Key Insight
Separating decision logic from AI generation allows future expansion such as tool usage, permissions, and project-specific behavior.

## Architecture Correction
Initially considered routing logic tied to a specific application. 
Corrected approach to ensure JarvisOS remains a universal, project-agnostic core.
Domain-specific behavior will be implemented later via configuration-based modules.

---

## Day 1 – Permissions & Project Configuration

### Objective
Implement a robust permission system and project-based configuration to control tool access and define project-specific behaviors.

### Implementation
- **Project Configuration**: Created `projects/` directory with JSON configs (`default.config.json`, `web.config.json`) defining allowed tools and personality traits.
- **Permission Manager**: Implemented `permissionManager.js` to dynamically load configs and validate tool usage requests.
- **Tool Registry**: Established `toolRegistry.js` containing system tools (`getTime`, `getDate`, `systemInfo`).
- **Core Integration**: Updated `jarvisEngine.js` to detect tool intents and `server.js` to enforce permissions based on the client's project context.

### Key Insight
Configuration-driven architecture allows the same Jarvis core to serve different frontends (Web, Desktop) with strict security boundaries without code changes.

### Verification
- **Allowed Action**: Web client successfully requested time (`getTime`).
- **Blocked Action**: Web client was correctly denied access to system information (`systemInfo`), proving the permission system works.

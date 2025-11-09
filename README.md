# Chat Application

This is a full-stack chat application built with a Spring Boot backend and a React frontend.

## Project Structure

The repository is divided into two main components:

1.  **`chat-app-backend/`**: The backend service, implemented using Spring Boot, handling WebSocket connections, room management, and message persistence.
2.  **`front-chat/`**: The frontend client, implemented using React and Vite, providing the user interface for joining rooms and sending/receiving messages.

## Prerequisites

Before running the application, ensure you have the following installed:

*   **Java Development Kit (JDK)**: Version 17 or higher (required for Spring Boot).
*   **Maven**: Build tool for the Spring Boot project.
*   **Node.js and npm**: (or yarn/pnpm) Required for the React frontend.

## Setup and Installation

### 1. Backend Setup (`chat-app-backend/`)

Navigate to the backend directory and build the project:

```bash
cd chat-app-backend
./mvnw clean install
```

### 2. Frontend Setup (`front-chat/`)

Navigate to the frontend directory and install dependencies:

```bash
cd front-chat
npm install
```

## Running the Application

### 1. Start the Backend

From the `chat-app-backend/` directory:

```bash
./mvnw spring-boot:run
```
The backend typically runs on `http://localhost:8080`.

### 2. Start the Frontend

From the `front-chat/` directory:

```bash
npm run dev
```
The frontend will start on a port (e.g., `http://localhost:5173`). Check the terminal output for the exact URL.

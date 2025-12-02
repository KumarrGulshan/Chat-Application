# Chat Application

This is a full-stack chat application built with a Spring Boot backend and a React frontend. It features user authentication, chat room creation/joining, and real-time messaging using WebSockets.

## Project Structure

The repository is divided into two main components:

1.  **`chat-app-backend/`**: The backend service, implemented using Spring Boot, handling user authentication, WebSocket connections for real-time chat, room management, and message persistence.
2.  **`front-chat/`**: The frontend client, implemented using React and Vite, providing the user interface for registration, login, joining/creating rooms, and sending/receiving messages.

## Features

### Backend
*   **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) with BCrypt password hashing.
*   **Room Management:** API endpoints to create and join chat rooms.
*   **Real-time Messaging:** WebSocket-based communication for instant message delivery within rooms.
*   **Message Persistence:** Messages are stored within rooms.
*   **Secure API Endpoints:** Role-based access control for room-related operations.
*   **CORS Configuration:** Properly configured to allow frontend access.

### Frontend
*   **User Authentication:** Registration and login forms with token management (localStorage and React Context).
*   **Intuitive UI:** React components for joining/creating chats and a dedicated chat page.
*   **Real-time Updates:** Integrates with WebSocket for live message display.
*   **Route Protection:** Navigation handled by React Router, redirecting unauthorized users.
*   **Toast Notifications:** User feedback for actions like login, registration, and errors.
*   **Modern Tooling:** Built with Vite for a fast development experience.

## Technologies Used

### Backend (`chat-app-backend/`)
*   **Spring Boot**: Framework for building the backend application.
*   **Spring Security**: For authentication (JWT) and authorization.
*   **Spring WebSocket**: For real-time, two-way communication.
*   **Maven**: Build automation tool.
*   **Java Development Kit (JDK) 17+**: Programming language.
*   **(Likely) H2 Database**: For in-memory data storage during development (can be configured for other databases).

### Frontend (`front-chat/`)
*   **React**: JavaScript library for building user interfaces.
*   **Vite**: Fast frontend build tool.
*   **React Router Dom**: For declarative routing.
*   **Axios**: Promise-based HTTP client for the browser and Node.js.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **react-hot-toast**: For elegant notifications.
*   **StompJS & SockJS**: For WebSocket communication.

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

## API Endpoints (Backend)

*   **`POST /api/v1/auth/register`**: Register a new user.
*   **`POST /api/v1/auth/login`**: Authenticate a user and receive a JWT token.
*   **`POST /api/v1/rooms`**: Create a new chat room (requires authentication).
*   **`GET /api/v1/rooms/{roomId}`**: Join an existing chat room and retrieve room details (requires authentication).
*   **`GET /api/v1/rooms/{roomId}/messages`**: Retrieve paginated messages for a specific room (requires authentication).

## WebSocket Communication (Backend & Frontend)

*   **WebSocket Endpoint:** `/ws`
*   **Send Messages:** Clients send messages to `/app/sendMessage/{roomId}`.
*   **Receive Messages:** Clients subscribe to `/topic/room/{roomId}` to receive real-time messages for a specific room.

## Frontend Routes

*   **`/login`**: User login page.
*   **`/register`**: User registration page.
*   **`/room`**: Page to join or create chat rooms (accessible after login).
*   **`/chat`**: Main chat interface where users can send and receive messages within a room (accessible after joining a room).
*   **`/` (Default)**: Redirects to `/login`.
*   **`*` (Fallback)**: Redirects to `/login`.

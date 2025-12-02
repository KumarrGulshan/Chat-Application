# Chat Application - Developer Documentation

This document provides a comprehensive overview of the Chat Application, detailing its architecture, key components, setup procedures, and extensible aspects for future development.

## 1. Introduction

This full-stack chat application is designed for real-time communication within various chat rooms. It leverages a Spring Boot backend for robust server-side operations and a React frontend for an interactive user experience. The application supports user authentication, dynamic room creation and joining, and instant message delivery.

## 2. Architecture Overview

The application follows a client-server architecture with a clear separation of concerns:

*   **Backend (Spring Boot)**: Acts as the API server and WebSocket broker. It manages user authentication, room state, message persistence, and real-time message broadcasting.
*   **Frontend (React)**: Consumes the backend APIs for authentication and room management, and utilizes WebSockets for real-time chat interactions.

Communication between frontend and backend is primarily via RESTful HTTP for authentication and room management, and WebSockets (STOMP over SockJS) for real-time chat messages.

## 3. Backend (`chat-app-backend/`)

The backend is a Spring Boot application.

### 3.1 Key Components

*   **`ChatAppBackendApplication.java`**: The main entry point for the Spring Boot application.
*   **`config/SecurityConfig.java`**: Configures Spring Security for JWT-based authentication and authorization. Defines allowed origins for CORS and sets up request matchers for different endpoints.
    *   **Authentication Flow**: Users register/login via `/api/v1/auth` endpoints. Upon successful login, a JWT is issued. This token must be included in subsequent requests (e.g., `Authorization: Bearer <token>`).
    *   **WebSocket Security**: Integrates with Spring Security to secure WebSocket connections.
*   **`config/WebSocketConfig.java`**: Configures the WebSocket message broker, defining endpoints for STOMP (Simple Text Oriented Messaging Protocol) and enabling a simple in-memory broker.
*   **`controller/AuthController.java`**: Handles user registration and login.
    *   `POST /api/v1/auth/register`: Creates a new user with a hashed password.
    *   `POST /api/v1/auth/login`: Authenticates a user and returns a JWT.
*   **`controller/RoomController.java`**: Manages chat rooms.
    *   `POST /api/v1/rooms`: Creates a new room (authenticated).
    *   `GET /api/v1/rooms/{roomId}`: Allows a user to join a room (authenticated). If the user is not a member, they are added.
    *   `GET /api/v1/rooms/{roomId}/messages`: Retrieves paginated message history for a room (authenticated).
*   **`controller/ChatController.java`**: Handles real-time chat messages over WebSockets.
    *   `@MessageMapping("/sendMessage/{roomId}")`: Receives messages from clients. It performs validation (user authenticated, room exists, user is a member) and saves the message to the room.
    *   `@SendTo("/topic/room/{roomId}")`: Broadcasts messages to all subscribers of a specific room topic.
*   **`entities/`**: JPA entities for `User`, `Room`, and `Message` models.
    *   `User`: Stores username and hashed password.
    *   `Room`: Contains a `roomId`, a list of `members` (usernames), and a list of `messages`.
    *   `Message`: Stores `content`, `sender`, and `timestamp`.
*   **`repository/`**: Spring Data JPA repositories (`UserRepository`, `RoomRepository`) for data access.
*   **`security/`**: Contains JWT-related utilities and filters.
    *   `JwtUtil.java`: Utility for generating, validating, and extracting information from JWTs.
    *   `JwtAuthenticationFilter.java`: Intercepts HTTP requests to validate JWTs and set up Spring Security context.
    *   `AuthChannelInterceptorAdapter.java`: Intercepts WebSocket messages to authenticate users based on JWTs in the WebSocket handshake or STOMP headers.
*   **`playload/MessageRequest.java`**: DTO for incoming chat messages.
*   **`application.properties`**: Configuration file for Spring Boot, including database settings (likely H2 in-memory for development) and other application-specific properties.

### 3.2 Data Persistence

The application currently uses an in-memory database (likely H2) as configured in `application.properties`. For production deployment, this should be configured to use a persistent database like PostgreSQL, MySQL, or MongoDB. The `Room` and `User` entities are designed to be extensible for various relational or NoSQL databases.

## 4. Frontend (`front-chat/`)

The frontend is a React application built with Vite.

### 4.1 Key Components

*   **`main.jsx`**: The entry point for the React application. It sets up `BrowserRouter` for routing, `ChatProvider` for global state management, and `Toaster` for notifications.
*   **`App.jsx`**: The root component.
*   **`config/Routes.jsx`**: Defines all application routes using `react-router-dom`.
    *   `/login`: Login component.
    *   `/register`: Register component.
    *   `/room`: Join or Create Chat component (protected).
    *   `/chat`: Chat Page component (protected).
    *   `/` (default) and `*` (fallback): Redirects to `/login`.
*   **`components/Login.jsx`**: Provides a user login form. On successful login, it stores the JWT in `localStorage` and `ChatContext`, then navigates to `/room`.
*   **`components/Register.jsx`**: Provides a user registration form. On successful registration, it navigates to `/login`.
*   **`components/JoinCreateChat.jsx`**: Allows authenticated users to create a new chat room or join an existing one. Upon joining, it navigates to `/chat`.
*   **`components/ChatPage.jsx`**: The main chat interface. It connects to the WebSocket endpoint for real-time messaging, displays messages, and allows users to send new messages.
*   **`Context/ChatContext.jsx`**: A React Context for managing global state, specifically the JWT token. This ensures the token is available across different components without prop drilling.
*   **`services/AuthService.js`**: Contains functions for interacting with the backend's authentication API (`loginApi`, `registerApi`).
*   **`services/RoomServices.js`**: Contains functions for interacting with the backend's room management API.
*   **`config/AxiosHelper.js`**: Configures Axios with base URL and JWT interceptor for authenticated requests.
*   **`utils/decodeToken.js`**: Utility to decode JWTs (used for extracting username from the token).

### 4.2 State Management

The frontend uses React's `useState` for local component state and `ChatContext` for global state (e.g., JWT token). `localStorage` is used for persistent storage of the JWT token across browser sessions.

## 5. Setup and Installation

Refer to the main `README.md` for detailed instructions on setting up and running the backend and frontend components.

## 6. API Endpoints (Backend)

*   **Authentication**:
    *   `POST /api/v1/auth/register` (Request Body: `{ "username": "...", "password": "..." }`)
    *   `POST /api/v1/auth/login` (Request Body: `{ "username": "...", "password": "..." }`, Returns: `{ "token": "..." }`)
*   **Rooms**:
    *   `POST /api/v1/rooms` (Request Body: `"roomId"`, Returns: `Room` object)
    *   `GET /api/v1/rooms/{roomId}` (Returns: `Room` object)
    *   `GET /api/v1/rooms/{roomId}/messages?page=<page_num>&size=<page_size>` (Returns: `List<Message>` paginated)

## 7. WebSocket Communication

*   **WebSocket Endpoint**: `/ws` (Spring Boot's configured endpoint)
*   **STOMP Prefix**: `/app` (for sending messages)
*   **STOMP Topic Prefix**: `/topic` (for receiving messages)

### Message Flow:
1.  **Connect**: Frontend connects to `/ws` using SockJS and STOMP. JWT is sent in the handshake or a STOMP header for authentication.
2.  **Subscribe**: Frontend subscribes to `/topic/room/{roomId}` to receive real-time messages for a specific room.
3.  **Send**: Frontend sends messages to `/app/sendMessage/{roomId}` (Request Body: `{ "content": "..." }`).

## 8. Potential Improvements and Future Work

*   **Error Handling**: Enhance error handling on both frontend and backend for more graceful user feedback and robust system behavior.
*   **Scalability**:
    *   Replace in-memory H2 database with a production-ready database (e.g., PostgreSQL, MongoDB).
    *   Implement horizontal scaling for Spring Boot instances and WebSocket servers. Consider using a dedicated message broker like RabbitMQ or Kafka for inter-service communication if scaling out WebSocket servers.
*   **User Management**:
    *   Add profile management, display names, and avatars.
    *   Implement user roles and permissions beyond simple authentication.
    *   "Forget Password" functionality.
*   **Chat Features**:
    *   Typing indicators.
    *   Read receipts.
    *   Direct messaging between users.
    *   Emoji support.
    *   File attachments.
    *   Search functionality for messages within a room.
*   **Frontend Enhancements**:
    *   Improved UI/UX with better design patterns and animations.
    *   Infinite scrolling for message history.
    *   Client-side message caching.
    *   Progressive Web App (PWA) features.
*   **Testing**: Implement comprehensive unit, integration, and end-to-end tests for both backend and frontend.
*   **Deployment**: Provide containerization (Docker) and deployment scripts for platforms like Kubernetes, AWS, Azure, or Google Cloud.
*   **Monitoring & Logging**: Integrate with monitoring tools and implement structured logging.
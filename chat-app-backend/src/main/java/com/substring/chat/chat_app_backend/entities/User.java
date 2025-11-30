package com.substring.chat.chat_app_backend.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;      // unique
    private String email;
    private String passwordHash;  // store bcrypt hash here
    // optionally roles, metadata
}

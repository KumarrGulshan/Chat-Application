package com.substring.chat.chat_app_backend.repository;

import com.substring.chat.chat_app_backend.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}

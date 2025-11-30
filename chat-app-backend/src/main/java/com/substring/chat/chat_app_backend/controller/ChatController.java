package com.substring.chat.chat_app_backend.controller;

import com.substring.chat.chat_app_backend.entities.Message;
import com.substring.chat.chat_app_backend.entities.Room;
import com.substring.chat.chat_app_backend.playload.MessageRequest;
import com.substring.chat.chat_app_backend.repository.RoomRepository;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            MessageRequest request,
            Principal principal
    ) {
        // 1️⃣ Ensure the user is authenticated
        if (principal == null || principal.getName() == null) {
            throw new RuntimeException("Unauthorized user!");
        }
        String currentUser = principal.getName();

        // 2️⃣ Check if room exists
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new RuntimeException("Room not found!");
        }

        // 3️⃣ Check if user is a member of the room
        if (!room.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are not a member of this room!");
        }

        // 4️⃣ Create the new message
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(currentUser);  // Do NOT trust client-side sender
        message.setTimestamp(LocalDateTime.now());

        // 5️⃣ Save the message in the room
        room.getMessages().add(message);
        roomRepository.save(room);

        // 6️⃣ Return message to broadcast to subscribers
        return message;
    }
}

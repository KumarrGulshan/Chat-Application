package com.substring.chat.chat_app_backend.controller;

import com.substring.chat.chat_app_backend.entities.Message;
import com.substring.chat.chat_app_backend.entities.Room;
import com.substring.chat.chat_app_backend.playload.MessageRequest;
import com.substring.chat.chat_app_backend.repository.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(RoomRepository roomRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendMessage/{roomId}")
    public void sendMessage(
            @DestinationVariable String roomId,
            MessageRequest request,
            Principal principal
    ) {

        System.out.println("============ Incoming Message ============");
        System.out.println("Principal        : " + principal);
        System.out.println("Username         : " + (principal != null ? principal.getName() : "NULL"));
        System.out.println("RoomId Received  : " + roomId);
        System.out.println("Request Content  : " + request.getContent());
        System.out.println("==========================================");

        // 1️⃣ Authentication check
        if (principal == null) {
            throw new RuntimeException("Unauthorized user!");
        }

        String currentUser = principal.getName();

        // 2️⃣ Validate room
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            throw new RuntimeException("Room not found!");
        }

        // 3️⃣ Check membership
        if (!room.getMembers().contains(currentUser)) {
            throw new RuntimeException("You are not a member of this room!");
        }

        // 4️⃣ Create message
        Message message = new Message();
        message.setSender(currentUser);
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());

        // 5️⃣ Save to DB
        room.getMessages().add(message);
        roomRepository.save(room);

        // 6️⃣ Broadcast message to subscribers
        messagingTemplate.convertAndSend("/topic/room/" + roomId, message);
    }
}

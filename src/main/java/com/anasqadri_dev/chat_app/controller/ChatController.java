package com.anasqadri_dev.chat_app.controller;

import com.anasqadri_dev.chat_app.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// this controller is going to handle all the incoming messages that is being sent from the frontend, and it is going to add/broadcast it to all the clients
@Controller
public class ChatController {

    // (the end point below is /app/send-message bcz /app is already configured in WebSocketConfigure)
    @MessageMapping("/send-message") // maps websocket messages to the destination
    @SendTo("/topic/messages") // the return of the method below will be sent/broadcast to the specific chat room
    public ChatMessage sendMessage(ChatMessage message){
        return message;
    }

    @GetMapping("/chat")
    public String chat(){
        return "chat";
    }
}

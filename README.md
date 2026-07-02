# Chat App

> A real-time chat application built with Spring Boot WebSocket, STOMP protocol, SockJS, and Thymeleaf — messages broadcast instantly to all connected clients with zero page refresh.

## Demo

[▶ Watch Demo on LinkedIn](https://www.linkedin.com/posts/anasqadri-dev_java-springboot-websocket-ugcPost-7478430515314941953-cNWf/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8RRcQBtsTyiGac-frD3FMvzvM_sHqzdk8)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Spring Boot |
| Real-time Protocol | Spring WebSocket + STOMP |
| WebSocket Fallback | SockJS |
| View | Thymeleaf |
| Code Generation | Lombok |
| Build Tool | Maven |
| Frontend | Custom CSS + Vanilla JavaScript |

---

## Features

- Real-time messaging — messages appear instantly on all open browser tabs
- Messages broadcast to all connected clients simultaneously
- Own messages aligned right, others aligned left (per sender name)
- Welcome screen clears on first message
- Send on button click or Enter key
- Name field required — validated before sending
- Auto-scroll to latest message
- Animated message entrance (slide-in)
- Pulsing green connection indicator
- SockJS fallback for browsers without native WebSocket support
- Auto-reconnect on connection loss (5-second retry)

---

## Architecture

```
Browser A                     Spring Boot Server                Browser B
   │                               │                               │
   │──── SockJS WebSocket ────────▶│                               │
   │                               │                               │
   │  POST /app/send-message       │  @MessageMapping              │
   │  { sender, content } ────────▶│  /send-message                │
   │                               │                               │
   │                    @SendTo("/topic/messages")                  │
   │                               │                               │
   │◀──── broadcast ───────────────│──── broadcast ───────────────▶│
   │                               │                               │
```

---

## How It Works

**Connection**
- Browser connects to `/chat` via SockJS
- SockJS provides fallback transport (long-polling) for browsers without native WebSocket
- STOMP runs on top of the WebSocket connection to handle routing

**Sending a Message**
- Frontend calls `stompClient.send("/app/send-message", {}, JSON.stringify(message))`
- Spring routes this to `@MessageMapping("/send-message")` in `ChatController`
- Controller returns the message to `@SendTo("/topic/messages")`
- The simple broker broadcasts it to every client subscribed to `/topic/messages`

**Receiving Messages**
- Every client subscribes to `/topic/messages` on connect
- Each incoming message triggers `showMessage()` which builds a DOM bubble and appends it

---

## Project Structure

```
chat-app/
├── src/main/
│   ├── java/com/anasqadri_dev/chat_app/
│   │   ├── ChatAppApplication.java          # Entry point
│   │   ├── config/
│   │   │   └── WebSocketConfig.java         # STOMP endpoint and broker setup
│   │   ├── controller/
│   │   │   └── ChatController.java          # Message mapping and page route
│   │   └── model/
│   │       └── ChatMessage.java             # sender + content (Lombok)
│   └── resources/
│       ├── static/
│       │   ├── script.js                    # SockJS/STOMP client logic
│       │   └── style.css                    # Chat UI design
│       ├── templates/
│       │   └── chat.html                    # Chat page (Thymeleaf)
│       └── application.properties
└── pom.xml
```

---

## Prerequisites

- JDK 17 or higher
- Maven 3.6+

No database needed — messages are in-memory only.

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/anasqadri-dev/chat-app.git
cd chat-app
```

### 2. Run

```bash
./mvnw spring-boot:run
```

Open two or more browser tabs at:

```
http://localhost:8080/chat
```

Type different names in each tab and send messages — they appear in real time across all tabs.

---

## Routes

| Type | Destination | Description |
|---|---|---|
| HTTP GET | `/chat` | Serves the chat page |
| WebSocket | `/chat` | SockJS handshake endpoint |
| STOMP send | `/app/send-message` | Client sends a message |
| STOMP subscribe | `/topic/messages` | Client receives broadcasts |

---

## Key Annotations

| Annotation | What it does |
|---|---|
| `@EnableWebSocketMessageBroker` | Activates STOMP-based WebSocket support |
| `@MessageMapping("/send-message")` | Maps incoming STOMP messages (like `@PostMapping` but for WebSocket) |
| `@SendTo("/topic/messages")` | Broadcasts the return value to all subscribers |

---

## Limitations

- Messages are not persisted — server restart clears all history
- No authentication — anyone can set any sender name
- Single chat room — no private or multi-room support
- `setAllowedOrigins` should use `*` or the correct URL in production

---

## What I Learned

- HTTP is request-response — the client always initiates. WebSocket is a persistent two-way channel — either side can send at any time
- STOMP is a messaging protocol that runs on top of WebSocket — it adds destinations, subscriptions, and acknowledgements so you can build pub/sub patterns without managing raw bytes
- SockJS is a graceful fallback — if the browser or network does not support WebSocket, it falls back to long-polling transparently without changing application code
- `@MessageMapping` is to WebSocket what `@PostMapping` is to HTTP — it maps an incoming message to a handler method
- `@SendTo` turns a method's return value into a broadcast — the message broker delivers it to every subscribed client simultaneously

---

## License

MIT
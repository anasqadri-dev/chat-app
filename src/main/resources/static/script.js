let stompClient = null;
let username = '';

function setConnected(connected) {
    const sendBtn = document.getElementById('send-message');
    if (sendBtn) {
        sendBtn.disabled = !connected;
        if (connected) {
            sendBtn.textContent = 'Send';
        }
    }
}

function connect() {
    try {
        const socket = new SockJS('/chat');
        stompClient = Stomp.over(socket);
        
        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);
            setConnected(true);
            
            stompClient.subscribe('/topic/messages', function(message) {
                const msg = JSON.parse(message.body);
                showMessage(msg);
            });
        }, function(error) {
            console.error('Connection error:', error);
            setTimeout(connect, 5000);
        });
    } catch (error) {
        console.error('WebSocket connection failed:', error);
        setTimeout(connect, 5000);
    }
}

function showMessage(msg) {
    const chat = document.getElementById('chat-box');
    
    // Remove welcome message if it exists
    const welcome = chat.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    // Determine if the message is from the current user
    const currentUser = document.getElementById('sender-input').value.trim() || 'You';
    const isOwnMessage = msg.sender === currentUser;
    
    if (isOwnMessage) {
        messageWrapper.classList.add('own');
    } else {
        messageWrapper.classList.add('other');
    }
    
    // Add sender name
    const sender = document.createElement('div');
    sender.className = 'message-sender';
    sender.textContent = msg.sender || 'Unknown';
    messageWrapper.appendChild(sender);
    
    // Add message bubble
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = msg.content || '';
    messageWrapper.appendChild(bubble);
    
    chat.appendChild(messageWrapper);
    chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
    const senderInput = document.getElementById('sender-input');
    const messageInput = document.getElementById('message-input');
    
    const sender = senderInput.value.trim();
    const content = messageInput.value.trim();
    
    if (!sender) {
        senderInput.style.borderColor = '#ff6b6b';
        senderInput.focus();
        setTimeout(() => {
            senderInput.style.borderColor = '';
        }, 2000);
        return;
    }
    
    if (!content) {
        messageInput.style.borderColor = '#ff6b6b';
        messageInput.focus();
        setTimeout(() => {
            messageInput.style.borderColor = '';
        }, 2000);
        return;
    }
    
    if (stompClient && stompClient.connected) {
        const chatMessage = {
            sender: sender,
            content: content
        };
        
        stompClient.send("/app/send-message", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    } else {
        alert('Connection lost. Please refresh the page.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set up send button
    const sendBtn = document.getElementById('send-message');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Enter key for message input
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Enter key for sender input (focus on message)
    const senderInput = document.getElementById('sender-input');
    if (senderInput) {
        senderInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const messageInput = document.getElementById('message-input');
                if (messageInput) {
                    messageInput.focus();
                }
            }
        });
    }
    
    // Connect to WebSocket
    connect();
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect();
    }
});
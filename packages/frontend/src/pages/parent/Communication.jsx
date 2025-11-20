import React, { useState, useRef, useEffect } from 'react';
import '../../styles/parent-communication.css';

const Communication = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'support',
            text: 'Hello! How can we help you today?',
            timestamp: '10:30 AM',
            avatar: 'S'
        },
        {
            id: 2,
            sender: 'user',
            text: 'Hi, I need to report an issue with pickup time',
            timestamp: '10:32 AM',
            avatar: 'Y'
        },
        {
            id: 3,
            sender: 'support',
            text: 'Sure, please describe the issue in detail and I will help you resolve it as soon as possible.',
            timestamp: '10:33 AM',
            avatar: 'S'
        },
        {
            id: 4,
            sender: 'user',
            text: 'The bus was 15 minutes late yesterday. This is affecting my child\'s schedule.',
            timestamp: '10:35 AM',
            avatar: 'Y'
        },
        {
            id: 5,
            sender: 'support',
            text: 'I understand your concern. Let me check the trip records for yesterday.',
            timestamp: '10:36 AM',
            avatar: 'S'
        }
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'user',
                text: newMessage,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                avatar: 'Y'
            };

            setMessages([...messages, newMsg]);
            setNewMessage('');

            // Simulate support typing
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    sender: 'support',
                    text: 'Thank you for your message. Our team will respond shortly.',
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    avatar: 'S'
                }]);
            }, 2000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickReplies = [
        'Check trip status',
        'Report an issue',
        'Contact driver',
        'View schedule'
    ];

    return (
        <div className="communication-container">
            <div className="communication-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="support-avatar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="header-info">
                            <h1>Support Team</h1>
                            <p className="status-online">
                                <span className="status-dot"></span>
                                Online - We're here to help
                            </p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn" title="Call support">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </button>
                        <button className="action-btn" title="More options">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="chat-wrapper">
                <div className="quick-replies">
                    {quickReplies.map((reply, index) => (
                        <button
                            key={index}
                            className="quick-reply-btn"
                            onClick={() => setNewMessage(reply)}
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                <div className="messages-container">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            {msg.sender === 'support' && (
                                <div className="message-avatar">
                                    {msg.avatar}
                                </div>
                            )}
                            <div className="message-content">
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                                <div className="message-time">{msg.timestamp}</div>
                            </div>
                            {msg.sender === 'user' && (
                                <div className="message-avatar user">
                                    {msg.avatar}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message support">
                            <div className="message-avatar">S</div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <button className="attachment-btn" title="Attach file">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                    </button>

                    <textarea
                        ref={inputRef}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="message-input"
                        rows="1"
                    />

                    <button
                        onClick={handleSendMessage}
                        className={`send-btn ${newMessage.trim() ? 'active' : ''}`}
                        disabled={!newMessage.trim()}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Communication;
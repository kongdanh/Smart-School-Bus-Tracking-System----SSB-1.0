import React from 'react';
import '../../pages/parent/styles/MessageBubble.css';

const MessageBubble = ({ message }) => {
    return (
        <div className={`message-bubble ${message.sender}`}>
            <div className="message-content">{message.text}</div>
            <div className="message-time">{message.timestamp}</div>
        </div>
    );
};

export default MessageBubble;

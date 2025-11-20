import React from 'react';
import '../../pages/parent/styles/ContactCard.css';

const ContactCard = ({ icon, title, subtitle, content, color }) => {
    const getIconEmoji = (icon) => {
        switch (icon) {
            case 'message': return '💬';
            case 'phone': return '☎️';
            case 'email': return '✉️';
            case 'clock': return '🕐';
            default: return '•';
        }
    };

    return (
        <div className={`contact-card contact-card-${color}`}>
            <div className="contact-icon">{getIconEmoji(icon)}</div>
            <h3 className="contact-title">{title}</h3>
            {subtitle && <p className="contact-subtitle">{subtitle}</p>}
            {content && <p className="contact-content">{content}</p>}
        </div>
    );
};

export default ContactCard;

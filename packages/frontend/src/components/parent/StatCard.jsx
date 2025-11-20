import React from "react";
import "../../styles/StatCard.css";

const StatCard = ({ value, label, color }) => {
    return (
        <div className={`stat-card stat-${color}`}>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

export default StatCard;

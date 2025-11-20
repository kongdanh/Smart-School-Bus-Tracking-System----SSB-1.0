import React from "react";
import "../../styles/SettingsTab.css";

const SettingsTab = ({ title, children }) => {
    return (
        <div className="settings-tab">
            <h3>{title}</h3>
            {children}
        </div>
    );
};

export default SettingsTab;

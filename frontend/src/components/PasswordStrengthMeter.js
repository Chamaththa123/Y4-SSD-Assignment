import React from "react";

const PasswordStrengthMeter = ({ passwordStrength }) => {
    return (
        <div className="password-strength">
            Password Strength:
            {[...Array(passwordStrength)].map((_, i) => (
                <span
                key={i}
                className={`strength-dot ${i < passwordStrength ? 'filled' : ''}`}
                ></span>
            ))}
        </div>
    );
};

export default PasswordStrengthMeter;
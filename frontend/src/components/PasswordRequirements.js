import React from "react";

const PasswordRequirements = ({ passwordRequirements }) => {
    return (
        <div className="password-requirements">
            <ul>
                <li>
                <span className={`requirement ${passwordRequirements.lowercase ? 'correct' : ''}`}>
                    A lowercase letter
                    {passwordRequirements.lowercase && <span className="check-mark">&#10004;</span>}
                </span>
                </li>
                <li>
                <span className={`requirement ${passwordRequirements.uppercase ? 'correct' : ''}`}>
                    A capital (uppercase) letter
                    {passwordRequirements.uppercase && <span className="check-mark">&#10004;</span>}
                </span>
                </li>
                <li>
                <span className={`requirement ${passwordRequirements.number ? 'correct' : ''}`}>
                    A number
                    {passwordRequirements.number && <span className="check-mark">&#10004;</span>}
                </span>
                </li>
                <li>
                <span className={`requirement ${passwordRequirements.specialCharacter ? 'correct' : ''}`}>
                    A special character
                    {passwordRequirements.specialCharacter && <span className="check-mark">&#10004;</span>}
                </span>
                </li>
                <li>
                <span className={`requirement ${passwordRequirements.minLength ? 'correct' : ''}`}>
                    Minimum 8 characters
                    {passwordRequirements.minLength && <span className="check-mark">&#10004;</span>}
                </span>
                </li>
            </ul>
        </div>
    );
};

export default PasswordRequirements;
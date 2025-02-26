import { useState } from "react";
import "../styles/Account.css";

const Account = ({ isOpen, onClose }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value && !validateEmail(value)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError(null); // Clear error if input is valid or empty
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (isRegister) {
            if (value === "") {
                setPasswordError(null);
                setConfirmPasswordError(null);
            } else {
                setPasswordError(value.length >= 8 ? null : "Password must be at least 8 characters long!");
            }
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value === "") {
            setConfirmPasswordError(null); // Clear error when input is empty
        } else if (value !== password) {
            setConfirmPasswordError("Passwords do not match!");
        } else {
            setConfirmPasswordError(null); // Clear error if passwords match
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
        let formattedValue = "";

        if (value.length > 0) {
            formattedValue += "(" + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formattedValue += ") " + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formattedValue += "-" + value.substring(6, 10);
        }
        setPhoneNumber(formattedValue);
        if (value === "") {
            setPhoneError(null);
        } else {
            const phoneValid = value.length === 10;
            setPhoneError(phoneValid ? null : "Please enter a valid phone number!");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        const emailValid = validateEmail(email);
        const passwordsMatch = password === confirmPassword;
        const phoneValid = phoneNumber.replace(/\D/g, "").length === 10;

        if (!emailValid) {
            setEmailError("Please enter a valid email address.");
        }
        if (isRegister && !passwordsMatch) {
            setConfirmPasswordError("Passwords do not match!");
        }
        if (isRegister && password.length < 8) {
            setPasswordError("Password must be at least 8 characters long!");
        }
        if (isRegister && !phoneValid) {
            setPhoneError("Please enter a valid phone number!");
        }

        if (emailValid && (!isRegister || (passwordsMatch && password.length >= 8 && phoneValid))) {
            console.log("Form submitted successfully.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="account-modal">
            <div className="account-box">
                <button className="close-button" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit}>
                    {isRegister ? (
                        <>
                            <h2>Sign Up</h2>
                            <input type="text" placeholder="Name" />
                            <input type="text" placeholder="Surname" />
                            <input
                                type="email"
                                placeholder="E-mail"
                                className={emailError ? "error" : ""}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {emailError && <p className="error-message">{emailError}</p>}
                            <input
                                type="tel"
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className={phoneError ? "error" : ""}
                            />
                            {phoneError && <p className="error-message">{phoneError}</p>}
                            <input
                                type="password"
                                placeholder="Password"
                                className={passwordError ? "error" : ""}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && <p className="error-message">{passwordError}</p>}
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className={confirmPasswordError ? "error" : ""}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                            <button type="submit" className="account-button">Sign Up</button>
                            <p>Already have an account?<span className="toggle-link" onClick={() => setIsRegister(false)}> Log In</span></p>
                        </>
                    ) : (
                        <>
                            <h2>Log In</h2>
                            <input
                                type="email"
                                placeholder="E-mail"
                                className={emailError ? "error" : ""}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {emailError && <p className="error-message">{emailError}</p>}
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button type="submit" className="account-button">Log In</button>
                            <p>Don't you have an account? <span className="toggle-link" onClick={() => setIsRegister(true)}>Sign Up</span></p>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Account;
<<<<<<< HEAD
=======

>>>>>>> fbe281e35d09e2583db42bab00184f61778bfd30

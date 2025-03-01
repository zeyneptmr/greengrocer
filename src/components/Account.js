import { useState, useEffect } from "react";
import Flag from "react-world-flags"; // Import the flag component

const Account = ({ isOpen, onClose }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+90"); // Default country code
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(value && !validateEmail(value) ? "Please enter a valid email address." : null);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (isRegister) {
            setPasswordError(value.length >= 8 ? null : "Password must be at least 8 characters long!");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(value !== password ? "Passwords do not match!" : null);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        let formattedValue = "";

        if (value.length > 0) formattedValue += "(" + value.substring(0, 3);
        if (value.length >= 4) formattedValue += ") " + value.substring(3, 6);
        if (value.length >= 7) formattedValue += "-" + value.substring(6, 10);

        setPhoneNumber(formattedValue);

        if (value.length === 10) {
            setPhoneError(null);
        } else {
            setPhoneError("Please enter a valid phone number!");
        }
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailValid = validateEmail(email);
        const passwordsMatch = password === confirmPassword;
        const phoneValid = phoneNumber.replace(/\D/g, "").length === 10;

        if (!emailValid) setEmailError("Please enter a valid email address.");
        if (isRegister && !passwordsMatch) setConfirmPasswordError("Passwords do not match!");
        if (isRegister && password.length < 8) setPasswordError("Password must be at least 8 characters long!");
        if (isRegister && !phoneValid) setPhoneError("Please enter a valid phone number!");

        if (emailValid && (!isRegister || (passwordsMatch && password.length >= 8 && phoneValid))) {
            console.log("Form submitted successfully.");
        }
    };

    const countries = [
        { code: "+1", flag: "US" },
        { code: "+44", flag: "GB" },
        { code: "+90", flag: "TR" },
        { code: "+33", flag: "FR" },
        { code: "+49", flag: "DE" },
        { code: "+39", flag: "IT" },
        { code: "+34", flag: "ES" },
        { code: "+1", flag: "CA" },
        { code: "+61", flag: "AU" },
        { code: "+55", flag: "BR" },
        { code: "+91", flag: "IN" },
        { code: "+81", flag: "JP" },
        { code: "+52", flag: "MX" },
        { code: "+7", flag: "RU" },
        { code: "+82", flag: "KR" },
        { code: "+46", flag: "SE" },
        { code: "+45", flag: "DK" },
        { code: "+27", flag: "ZA" },
        { code: "+64", flag: "NZ" }
    ];

    if (!isOpen) return null;


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg text-center relative w-[460px] border-2 border-orange-500">
                <button className="absolute top-2 right-2 border-none bg-transparent cursor-pointer text-2xl" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit}>
                    {isRegister ? (
                        <>
                            <h2 className="text-xl font-bold text-green-600">Sign Up</h2>
                            <input type="text" placeholder="Name" className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600" />
                            <input type="text" placeholder="Surname" className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600" />
                            <input
                                type="email"
                                placeholder="E-mail"
                                className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${emailError ? "border-red-500" : "border-gray-300"}`}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center border border-gray-300 rounded-md w-[150px] h-[60px] p-2">
                                    <Flag
                                        code={countries.find(country => country.code === countryCode)?.flag || "US"}
                                        style={{ width: "20px", height: "30px" }}
                                    />
                                    <select
                                        value={countryCode}
                                        onChange={handleCountryCodeChange}
                                        className="ml-2 border-none text-lg focus:ring-0 focus:outline-none w-full"
                                    >
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${phoneError ? "border-red-500" : "border-gray-300"}`}
                                />
                            </div>
                            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                            <input
                                type="password"
                                placeholder="Password"
                                className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${passwordError ? "border-red-500" : "border-gray-300"}`}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className={`block w-full p-4 my-2 border rounded-md text-lg focus:border-orange-600 ${confirmPasswordError ? "border-red-500" : "border-gray-300"}`}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                            <button type="submit" className="w-full p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg">Sign Up</button>
                            <p className="mt-2">Already have an account? <span className="text-green-600 underline cursor-pointer" onClick={() => setIsRegister(false)}>Log In</span></p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-green-600">Log In</h2>
                            <input
                                type="email"
                                placeholder="E-mail"
                                className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="block w-full p-4 my-2 border border-gray-300 rounded-md text-lg focus:border-orange-600"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button type="submit" className="w-full p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg">Log In</button>
                            <p className="mt-2">Don't have an account? <span className="text-green-600 underline cursor-pointer" onClick={() => setIsRegister(true)}>Sign Up</span></p>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Account;

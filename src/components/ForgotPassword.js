import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword'; // Update the path according to your project structure

import axios from 'axios';

const ForgotPassword = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [emailError, setEmailError] = useState('');  // Error message for email
    const [codeError, setCodeError] = useState('');
    const [serverCode, setServerCode] = useState('');
    const navigate = useNavigate();
    const [codeVerified, setCodeVerified] = useState(false); // Başarı mesajı durumu
    const [isResetPassword, setIsResetPassword] = useState(false);

    useEffect(() => {
        // Modal açıldığında scroll'u kapat
        document.body.style.overflow = 'hidden';

        return () => {
            // Modal kapanırken scroll'u geri aç
            document.body.style.overflow = 'auto';
        };
    }, []);
    // Email input change handler
    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        // Validate email format as user types
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(inputEmail)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');  // Clear error if email is valid
        }
    };

    // Send verification code
    const handleSendCode = async () => {
        if (!email) {
            setEmailError('Please provide a valid email address.');
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:8080/api/mail/sendVerificationCode?email=${email}`,  // Email'i URL'de query parametre olarak gönder
                {},  // Body boş
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log(response);  // Yanıtı logla
            if (response.status === 200) {
                setServerCode(response.data.code);
                setIsCodeSent(true);
                setCountdown(300);
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setEmailError(response.data.message || 'Email not found.');
            }
        } catch (error) {
            console.error(error);
            setEmailError(error.response?.data?.message || 'Server error. Please try again later.');
        }
    };

    // Resend verification code and reset countdown
    const handleResendCode = async () => {
        setCountdown(60);  // Reset countdown to 60 seconds
        setVerificationCode(''); // Clear the previous verification code
        handleSendCode();  // Resend the verification code
    };

    // Verify code input handler
    const handleVerifyCode = async () => {
        if (!verificationCode) {
            setCodeError('Please enter the verification code.');
            return;
        }

        // Backend'e email ve doğrulama kodunu gönder
        try {
            const response = await axios.post(
                `http://localhost:8080/api/mail/verifyCode?email=${email}&code=${verificationCode}`,
                {},  // Boş body, query parametreleri URL üzerinden gönderiyoruz
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log(response);  // Yanıtı logla

            if (response.data.error) {
                setCodeError(response.data.error);  // Backend'ten gelen hata mesajını kullanın
                setCodeVerified(false);  // Hata olduğunda, başarı mesajını gizle
            } else {
                setCodeVerified(true);  // Başarı mesajını göster
                setTimeout(() => {
                    setIsResetPassword(true);
                }, 2000);  // 2 saniye sonra yönlendir
            }
        } catch (error) {
            console.error(error);
            setCodeError('An error occurred while verifying the code.');
            setCodeVerified(false);  // Hata durumunda başarı mesajını gizle
        }
    };


    // Handle input for verification code
    const handleVerificationCodeChange = (e, index) => {
        const newCode = verificationCode.split('');
        newCode[index] = e.target.value;
        setVerificationCode(newCode.join(''));

        // Move focus to the next input if the code is valid
        if (e.target.value && index < 5) {
            document.getElementById(`input-${index + 1}`).focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.key === 'Enter') {
            if (!isCodeSent) {
                // Trigger the send code if email is entered and valid
                handleSendCode();
            } else {
                // Move to the next input for verification code if not the last input
                if (index < 5) {
                    document.getElementById(`input-${index + 1}`).focus();
                } else {
                    // Verify the code when "Enter" is pressed on the last input
                    handleVerifyCode();
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
            <div className="bg-gradient-to-br from-green-50 via-white to-orange-50 p-8 rounded-2xl shadow-xl w-[460px] relative border-2 border-orange-400">
                <h2 className="text-3xl font-extrabold text-green-700 mb-6"> 🔐Reset Password</h2>

                <div className="flex flex-col items-center space-y-4">
                    <p className="text-md text-[#006400] font-semibold text-center">
                        Please enter your email to receive a verification code </p>
                    {/* Email input or verification code input based on state */}
                    {!isCodeSent ? (
                        <>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyDown={(e) => handleKeyPress(e)}
                                placeholder="you@example.com"
                                required
                                onInvalid={(e) => e.preventDefault()} // Tarayıcı mesajını engelliyoruz
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-lg"
                            />
                            {/* Error message */}
                            {emailError && (
                                <div className="text-red-500 text-sm text-center">
                                    {emailError}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-green-800 font-medium">Enter the 6-digit code sent to your email</p>
                            <div className="flex justify-center space-x-2 mt-2">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        id={`input-${index}`}
                                        type="text"
                                        value={verificationCode[index] || ''}
                                        onChange={(e) => handleVerificationCodeChange(e, index)}
                                        onKeyDown={(e) => handleKeyPress(e, index)} // Handle "Enter" in code inputs
                                        maxLength={1}
                                        className="w-12 h-12 text-center text-xl border-b-4 border-green-400 rounded focus:outline-none focus:border-orange-500 transition"
                                        placeholder="—"
                                    />
                                ))}
                            </div>
                            {codeError && <div className="text-red-500 text-sm mt-2">{codeError}</div>}
                            <p className="text-sm text-orange-600 mt-3">⏱️ Time left: {countdown}s</p>
                        </>
                    )}
                </div>

                <div className="mt-6">
                    {!isCodeSent ? (
                        <button
                            onClick={handleSendCode}
                            disabled={!!emailError} // Disable the button if there is an email error
                            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-transform duration-300 ${
                                emailError
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                            }`}
                        >
                            Send Verification Code
                        </button>
                    ) : (
                        <button
                            onClick={handleVerifyCode}
                            className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 hover:scale-105 transition-transform duration-300"
                        >
                            Verify Code
                        </button>
                    )}
                    {/* Send Code Again Link */}
                    <div className="text-center mt-3">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="text-sm text-green-800 underline hover:text-orange-600"
                        >
                            Resend Code
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
                >
                    &times;
                </button>
            </div>

            {/* Conditionally render the ResetPassword modal */}
            {isResetPassword && (
                <ResetPassword onClose={() => setIsResetPassword(false)} />
            )}

        </div>
    );
};

export default ForgotPassword;

import React, { useState } from 'react';
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg text-center relative w-[460px] h-[380px] border-2 border-orange-500">
                <h2 className="text-3xl font-bold text-green-600 mt-2 ">Reset Password</h2>
                <div className="flex flex-col items-center  mt-10 space-y-4">
                    <p className="text-lg text-[#006400] font-roboto whitespace-nowrap">Enter your email address
                        to reset password</p>

                    {/* Email input or verification code input based on state */}
                    {!isCodeSent ? (
                        <>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyDown={(e) => handleKeyPress(e)}
                                className="w-full p-5 border border-gray-300 rounded-md text-lg mb-4"
                                placeholder="Enter your email"
                            />
                            {/* Error message */}
                            {emailError && (
                                <div className="text-red-500 text-sm text-center mb-4">
                                    {emailError}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Enter the verification code sent to your email:</p>
                            <div className="flex justify-center space-x-2">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        id={`input-${index}`}
                                        type="text"
                                        value={verificationCode[index] || ''}
                                        onChange={(e) => handleVerificationCodeChange(e, index)}
                                        onKeyDown={(e) => handleKeyPress(e, index)} // Handle "Enter" in code inputs
                                        maxLength={1}
                                        className="w-12 p-2 border-b-2 border-gray-300 text-center text-lg focus:outline-none"
                                        placeholder="—"
                                    />
                                ))}
                                {codeError && <div className="text-red-500 text-sm">{codeError}</div>}
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-sm">Time left: {countdown}s</p>
                            </div>

                        </>
                    )}
                </div>

                <div className="flex flex-col items-center mt-auto mb-10">
                    {!isCodeSent ? (
                        <button
                            type="submit"
                            onClick={handleSendCode}
                            disabled={!!emailError} // Disable the button if there is an email error
                            className="w-full p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg mt-4"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleVerifyCode}
                            className="w-4/5 p-4 bg-green-600 text-white rounded-md"
                        >
                            Verify Code
                        </button>
                    )}
                    {/* Send Code Again Link */}
                    <div className="mt-2">
                        <button
                            onClick={handleResendCode}
                            className="text-green-800 underline cursor-pointer">
                            Send Code Again
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-xl text-gray-500"
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

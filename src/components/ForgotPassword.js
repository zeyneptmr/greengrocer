import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword';

import axios from 'axios';

const ForgotPassword = ({ onClose, closeParentModal }) => {
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
        return () => {
            clearInterval(window.countdownTimer);
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
            `http://localhost:8080/api/mail/sendVerificationCode?email=${email}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );

        console.log(response);
        if (response.status === 200) {
            setServerCode(response.data.code);
            setIsCodeSent(true);
            setCountdown(300);
            
   
            clearInterval(window.countdownTimer);
            
 
            window.countdownTimer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(window.countdownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setEmailError(response.data.message || 'Email not found.');
        }
    } catch (error) {
        if (error.response) {
            const data = error.response.data;
            if (data && typeof data.error === 'string') {
                setEmailError(data.error); 
            } else {
                setEmailError('Something went wrong. Please try again.');
            }
        } else {
            setEmailError('Cannot connect to the server.');
        }
    }
};

  
const handleResendCode = async () => {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/mail/sendVerificationCode?email=${email}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );

        if (response.status === 200) {
            setServerCode(response.data.code);
            setCountdown(300);  
            setVerificationCode(''); 
            

            clearInterval(window.countdownTimer);
            
          
            window.countdownTimer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(window.countdownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    } catch (error) {
        if (error.response) {
            const data = error.response.data;
            if (data && typeof data.error === 'string') {
                setEmailError(data.error); 
            } else {
                setEmailError('Something went wrong. Please try again.');
            }
        } else {
            setEmailError('Cannot connect to the server.');
        }
    }
};

    // Verify code input handler
    const handleVerifyCode = async () => {
        if (!verificationCode) {
            setCodeError('Please enter the verification code.');
            return;
        }

        
        try {
            const response = await axios.post(
                `http://localhost:8080/api/mail/verifyCode?email=${email}&code=${verificationCode}`,
                {},  
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            console.log(response);  

            if (response.data.error) {
                setCodeError(response.data.error);  
                setCodeVerified(false);  
            } else {
                setCodeVerified(true);  
                setTimeout(() => {
                    setIsResetPassword(true);
                }, 2000);  
            }
        } catch (error) {
            console.error(error);
            setCodeError('An error occurred while verifying the code.');
            setCodeVerified(false);  
        }
    };

    // Handle input for verification code
    const handleVerificationCodeChange = (e, index) => {
        const newCode = verificationCode.split('');
        newCode[index] = e.target.value;
        setVerificationCode(newCode.join(''));

        if (e.target.value && index < 5) {
            document.getElementById(`input-${index + 1}`).focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.key === 'Enter') {
            if (!isCodeSent) {
                handleSendCode();
            } else {
                
                if (index < 5) {
                    document.getElementById(`input-${index + 1}`).focus();
                } else {
                    handleVerifyCode();
                }
            }
        }
    };

    const handleClose = () => {
        onClose(); 
    };


    const handleCloseAll = () => {
        onClose(); 
        if (closeParentModal) closeParentModal();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-lg text-center relative w-[460px] h-[380px] border-2 border-orange-500">
                <h2 className="text-3xl font-bold text-green-600 mt-2 ">Reset Password</h2>
                
                {!isCodeSent ? (
                    <div className="flex flex-col items-center mt-10 space-y-4">
                        <p className="text-lg text-[#006400] font-roboto whitespace-nowrap">
                            Enter your email address to reset password
                        </p>
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
                        
                        {/* Continue Button */}
                        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
                            <button
                                type="submit"
                                onClick={handleSendCode}
                                disabled={!!emailError} // Disable the button if there is an email error
                                className="w-4/5 p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mt-6 space-y-3">
                        <p className="text-lg text-[#006400] font-roboto whitespace-nowrap">
                            Enter the verification code sent to your email:
                        </p>
                        
                        {/* Verification Code Inputs */}
                        <div className="flex justify-center space-x-2 mt-2">
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    id={`input-${index}`}
                                    type="text"
                                    value={verificationCode[index] || ''}
                                    onChange={(e) => handleVerificationCodeChange(e, index)}
                                    onKeyDown={(e) => handleKeyPress(e, index)}
                                    maxLength={1}
                                    className="w-12 p-2 border-b-2 border-gray-300 text-center text-lg focus:outline-none"
                                    placeholder="—"
                                />
                            ))}
                        </div>
                        
                        {/* Error message */}
                        {codeError && <div className="text-red-500 text-sm mt-1">{codeError}</div>}
                        
                        {/* Countdown Timer */}
                        <div className="text-center my-2">
                            <p className="text-sm">Time left: {countdown}s</p>
                        </div>
                        
                        {/* Buttons Container */}
                        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
                            <button
                                onClick={handleVerifyCode}
                                className="w-4/5 p-4 bg-green-600 text-white rounded-md mb-2"
                            >
                                Verify Code
                            </button>
                            <button
                                onClick={handleResendCode}
                                className="text-green-800 underline cursor-pointer mt-2"
                            >
                                Send Code Again
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleCloseAll}
                    className="absolute top-2 right-2 text-xl text-gray-500"
                >
                    &times;
                </button>
            </div>

            {/* Conditionally render the ResetPassword modal */}
            {isResetPassword && (
                <ResetPassword 
                    onClose={() => {
                        setIsResetPassword(false);
                    }}
                    closeParentModal={handleCloseAll}
                />
            )}
        </div>
    );
};

export default ForgotPassword;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { FaClock, FaKey } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";


import axios from 'axios';

const ForgotPassword = ({ onClose, closeParentModal }) => {
    const [email, setEmail] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [emailError, setEmailError] = useState('');  
    const [codeError, setCodeError] = useState('');
    const [serverCode, setServerCode] = useState('');
    const [loading, setLoading] = useState(false); 
    const [codeVerified, setCodeVerified] = useState(false); 
    const [isResetPassword, setIsResetPassword] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation("forgotpassword");
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        return () => {
            clearInterval(window.countdownTimer);
        };
    }, []);


    const handleBackToLogin = () => {
        onClose(); 
        navigate('/login'); 
    };

    
    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
    
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(inputEmail)) {
            setEmailError(t("emailError"));
        } else {
            setEmailError('');  
        }
    };

   
const handleSendCode = async () => {
    if (!email) {
        setEmailError(t("emailError"));
        return;
    }
    try {
        setLoading(true);
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
            setEmailError(response.data.message || t("emailNotFound"));
        }
    } catch (error) {
        if (error.response) {
            const data = error.response.data;
            if (data && typeof data.error === 'string') {
                setEmailError(data.error); 
            } else {
                setEmailError(t("serverError"));
            }
        } else {
            setEmailError(t("connectionError"));
        }
    } finally {
        setLoading(false);
    }
};

  
const handleResendCode = async () => {
    try {
        setLoading(true);
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
                setEmailError(t("serverError"));
            }
        } else {
            setEmailError(t("connectionError"));
        }
    } finally {
        setLoading(false);
    }
};


    const handleVerifyCode = async () => {
        if (!verificationCode) {
            setCodeError(t("codeError"));
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `http://localhost:8080/api/mail/verifyCode?email=${email}&code=${verificationCode}`,
                {},  
                {
                    headers: { 'Content-Type': 'application/json', },
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
            setCodeError(t("serverError"));
            setCodeVerified(false);
        } finally {
            setLoading(false);
        }
    };


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
        <>
            {!isResetPassword ? (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[460px] relative border-2 border-orange-400">
                        {/* Close button */}
                        <button
                            onClick={handleCloseAll}
                            className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
                        >
                            &times;
                        </button>
                        
                        {/* Back button */}
                        <button
                            onClick={handleBackToLogin}
                            className="absolute top-4 left-4 text-lg text-gray-500 hover:text-green-600 font-semibold transition"
                        >
                            ⬅️ {t('backToLogin')}
                        </button>
    
                        {/* Title */}
                        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-6 mt-10">
                            🔐 {t('title')}
                        </h2>
    
                        <div className="mb-4"></div>
                        <div className="flex flex-col items-center space-y-4">
                            {!isCodeSent ? (
                                <>
                                    <p className="text-md text-green-800 font-semibold text-center">
                                        {t('enterEmail')}
                                    </p>
                                    <div className="mb-6"></div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        onKeyDown={(e) => handleKeyPress(e)}
                                        className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-md transition-all duration-200"
                                        placeholder={t('emailPlaceholder')}
                                    />
                                    {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
    
                                    <button
                                        onClick={handleSendCode}
                                        disabled={!!emailError}
                                        className={`w-full py-3 mt-4 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
                                            emailError
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                                        }`}
                                    >
                                        📩 {t('sendCode')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-green-800 font-medium text-center">
                                    {t('enterCode')}
                                    </p>
    
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
                                                className="w-12 h-12 text-center text-xl border-2 border-orange-400 rounded-lg text-green-700 font-bold focus:outline-none focus:border-green-600 transition"
                                                placeholder="-"
                                            />
                                        ))}
                                    </div>
    
                                    {codeError && (
                                        <div className="text-red-500 text-sm mt-2">{codeError}</div>
                                    )}
    
                                    <p className="text-sm text-orange-600 mt-3">⏱️ {t('timeLeft', {countdown: countdown })}</p>
    
                                    <button
                                        onClick={handleVerifyCode}
                                        className="w-full py-3 mt-4 bg-orange-500 text-white rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-300"
                                    >
                                        ✅ {t('verifyCode')}
                                    </button>
    
                                    <button
                                        onClick={handleResendCode}
                                        className="text-sm text-green-700 underline mt-2 hover:text-orange-600 transition"
                                    >
                                        🔁 {t('resendCode')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <ResetPassword
                    onClose={() => setIsResetPassword(false)}
                    closeParentModal={handleCloseAll}
                />
            )}
        </>
    );
};
export default ForgotPassword;
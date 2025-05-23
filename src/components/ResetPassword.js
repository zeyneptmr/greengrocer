import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";

const ResetPassword = ({ onClose, closeParentModal }) => {
    const [newPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 
    const [isSuccess, setIsSuccess] = useState(false);
    const { t } = useTranslation("resetpassword");
    const { language } = useContext(LanguageContext);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.length < 8) {
            setError(t('passwordLengthError'));
        } else {
            setError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleResetPassword = async () => {
        console.log("Password reset initiated");

        if (newPassword.length < 8) {
            setError(t('passwordLengthError'));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t('passwordMismatchError'));
            return;
        }

        setError('');

        try {
            const response = await axios.post(
                `http://localhost:8080/api/mail/resetPassword?newPassword=${newPassword}`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            
            console.log("Response:", response);
            if (response.status === 200) {
                console.log("it is ok:");
                setSuccessMessage(response.data.message || t('successMessage'));
                setIsSuccess(true);
                setTimeout(() => {
                    handleCloseAll(); 
                }, 2000);
            } else {
                console.error('Error occurred:', error);
                setError(response.data.error || t('requestError'));
                setIsSuccess(false);
            }
        } catch (error) {
            console.log("Request failed:", error);
            setError(t('requestError'));
            setIsSuccess(false);
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-[460px] relative border-2 border-orange-400">
                {/* Close button inside the modal */}
                <button
                    onClick={handleCloseAll}
                    className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
                >
                    &times;
                </button>
    
                <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">🔐 {t('title')}</h2>
    
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-md font-medium text-[#006400] text-center">
                        {t('subtitle')}
                    </p>
    
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-4 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500"
                        placeholder={t('newPasswordPlaceholder')}
                    />
                    {error && newPassword.length < 8 && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full p-4 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500"
                        placeholder={t('confirmPasswordPlaceholder')}
                    />
                    {error && newPassword.length >= 8 && confirmPassword && newPassword !== confirmPassword && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleResetPassword}
                        className="w-full p-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-transform transform hover:scale-105 hover:shadow-md"
                    >
                        {t('resetButton')}
                    </button>
                </div>
    
                {/* Success Message */}
                {isSuccess && (
                    <div
                        className="mt-6 p-3 bg-green-100 text-green-800 border border-green-500 rounded-md flex items-center justify-center space-x-2">
                        <span className="text-xl">✅</span>
                        <span className="text-sm font-medium">{t('successMessage')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
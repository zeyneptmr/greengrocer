import React, { useState, useEffect } from 'react';
import UserSidebar from "../components/UserSidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axios from 'axios';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation("changepassword");

    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    const handleChangePassword = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        try {

            if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
                setErrorMessage(t("errorFillAllFields"));
                return;
            }

            if (newPassword.length < 8) {
                setErrorMessage(t("errorPasswordLength"));
                return;
            }

            if (newPassword !== confirmPassword) {
                setErrorMessage(t("errorPasswordLength"));
                return;
            }

    
            const response = await axios.put(
                'http://localhost:8080/api/users/change-password',
                {
                    currentPassword,
                    newPassword,
                    confirmPassword
                },
                { withCredentials: true }  
            );

            setSuccessMessage(t("successPasswordChanged"));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {

            if (error.response) {
                const backendMessage = error.response.data;

                if (typeof backendMessage === "string" && backendMessage.toLowerCase().includes("current password is incorrect")) {
                    setErrorMessage(t("errorCurrentPasswordIncorrect"));
                } else {
                    setErrorMessage(backendMessage || t("errorFailedChange"));
                }

            } else {
                setErrorMessage(t("errorNetwork"));
            }

        } finally {
            setIsLoading(false);
        }
    };

    const isFormIncomplete = !currentPassword || !newPassword || !confirmPassword;

    return (
        <div className="flex bg-green-50 min-h-screen">
            <UserSidebar/>
            <div className="p-8 max-w-2xl mx-auto w-full bg-white shadow-lg rounded-xl mt-12 mb-12 min-h-[600px]">
                {successMessage && (
                    <div className="bg-green-100 text-green-700 border border-green-500 p-4 rounded-lg mb-6 text-center font-semibold">
                        {successMessage}
                    </div>
                )}
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">{t("changePasswordTitle")}</h2>
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border-t-4 border-orange-500">
                    <div className="relative mb-4">
                        <label className="block text-green-700 font-medium mb-1">{t("currentPassword")}</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-green-500 hover:text-green-700 transition"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-green-700 font-medium mb-1">{t("newPassword")}</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-green-500 hover:text-green-700 transition"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-green-700 font-medium mb-1">{t("newPasswordAgain")}</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-green-500 hover:text-green-700 transition"                                
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {isFormIncomplete && (
                        <p className="text-red-500 text-center font-medium mb-3">{t("fillAllFields")}</p>
                    )}
                    <button
                        className={`px-6 py-3 w-full rounded-lg text-lg font-semibold transition ${
                            isFormIncomplete || isLoading
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-orange-600 text-white hover:bg-orange-700"
                        }`}
                        onClick={handleChangePassword}
                        disabled={isFormIncomplete || isLoading}
                    >
                        {isLoading ? t("processing") : t("update")}
                    </button>
                    {errorMessage && <p className="mt-3 text-red-500 text-center font-medium">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
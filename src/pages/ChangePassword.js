import React, { useState, useEffect } from 'react';
import UserSidebar from "../components/UserSidebar";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    const handleChangePassword = () => {
        setErrorMessage('');
        setSuccessMessage('');

        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!storedUser) {
            setErrorMessage("User not found!");
            return;
        }

        const storedPassword = storedUser.password;

        if (currentPassword !== storedPassword) {
            setErrorMessage("Current password is incorrect!");
            return;
        }

        if (newPassword === storedPassword) {
            setErrorMessage("It cannot be the same as your current password!");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("New passwords do not match!");
            return;
        }

        if (!newPassword.trim()) {
            setErrorMessage("Password cannot be empty!");
            return;
        }

        storedUser.password = newPassword;
        localStorage.setItem("loggedInUser", JSON.stringify(storedUser));

        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.map(user => user.email === storedUser.email ? { ...user, password: newPassword } : user);
        localStorage.setItem("users", JSON.stringify(users));

        setSuccessMessage("Password changed successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Change Password</h2>
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border-t-4 border-orange-500">
                    <div className="relative mb-4">
                        <label className="block text-green-700 font-medium mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-3 top-3 text-gray-600 hover:text-green-500"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-green-700 font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-3 top-3 text-gray-600 hover:text-green-500"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-4">
                        <label className="block text-green-700 font-medium mb-1">New Password (Again)</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-3 top-3 text-gray-600 hover:text-green-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                            </button>
                        </div>
                    </div>

                    {isFormIncomplete && (
                        <p className="text-red-500 text-center font-medium mb-3">Please fill in all fields!</p>
                    )}
                    <button
                        className={`px-6 py-3 w-full rounded-lg text-lg font-semibold transition ${
                            isFormIncomplete
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-orange-600 text-white hover:bg-orange-700"
                        }`}
                        onClick={handleChangePassword}
                        disabled={isFormIncomplete}
                    >
                        Update
                    </button>
                    {errorMessage && <p className="mt-3 text-red-500 text-center font-medium">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
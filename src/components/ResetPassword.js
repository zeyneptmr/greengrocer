import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal durumunu kontrol etmek için state
    const [successMessage, setSuccessMessage] = useState(''); // Başarı mesajı
    const [isSuccess, setIsSuccess] = useState(false); // Success durumunu kontrol etmek için state

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (e.target.value.length < 8) {
            setError('Password must be at least 8 characters long.');
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
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');

        // Backend'e reset password isteği gönderme
        try {
            const response = await axios.post(`http://localhost:8080/api/mail/resetPassword?newPassword=${newPassword}`);
            console.log("Response:", response);
            if (response.status === 200) {
                console.log("it is ok:");
                setSuccessMessage(response.data.message || 'Password reset successfully.');
                setIsSuccess(true);
                setTimeout(() => {
                    closeModal(); // Modalı otomatik olarak kapat
                }, 2000);
            } else {
                console.error('Error occurred:', error);
                setError(response.data.error || 'An error occurred.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.log("Request failed:", error);
            setError('An error occurred while processing your request.');
            setIsSuccess(false);
        }
    };

    // Modalı kapatacak fonksiyon
    const closeModal = () => {
        setIsModalOpen(false); // Modal'ı kapatmak için state'i false yapıyoruz
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg text-center relative w-[460px] h-[380px] border-2 border-orange-500 z-60">
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold text-green-600 mt-2">Reset Password</h2>
                <div className="flex flex-col items-center mt-10 space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-4 border border-gray-300 rounded-md text-lg"
                        placeholder="Enter new password"
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
                        className="w-full p-4 border border-gray-300 rounded-md text-lg"
                        placeholder="Confirm new password"
                    />
                    {error && newPassword.length >= 8 && confirmPassword && newPassword !== confirmPassword && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleResetPassword}
                        className="w-full p-4 bg-green-600 text-white rounded-md cursor-pointer transition-transform hover:scale-105 hover:shadow-lg mt-4"
                    >
                        Reset Password
                    </button>
                </div>

                {/* Success Message */}
                {isSuccess && (
                    <div className="mt-4 p-2 bg-green-200 text-green-700 border-2 border-green-500 rounded-md flex items-center justify-center">
                        <span className="mr-2">✔️</span>
                        <span>{successMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserSidebar from "../components/UserSidebar.js";

const DeleteAccount = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const navigate = useNavigate();

    const handleDelete = () => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!storedUser) {
            setErrorMessage("User not found!");
            return;
        }

        if (password !== storedUser.password) {
            setErrorMessage("Incorrect password. Please try again.");
            return;
        }

        setConfirmDelete(true);
    };

    const confirmAccountDeletion = () => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!storedUser) return;

        // Kullanıcı listesinde bu kullanıcıyı kaldır
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.filter(user => user.email !== storedUser.email);
        localStorage.setItem("users", JSON.stringify(users));

        // Kullanıcıya ait tüm verileri temizle
        localStorage.removeItem("loggedInUser"); // Oturumu kapat
        localStorage.removeItem("cart"); // Sepeti temizle
        localStorage.removeItem("favorites"); // Favorileri temizle
        localStorage.removeItem("savedCards"); // Kayıtlı kartları temizle
        localStorage.removeItem("defaultCardIndex"); // Varsayılan kart seçimini kaldır

        navigate("/");
    };

    return (
        <div className="flex bg-green-50 min-h-screen">
            <UserSidebar />

            <div className="p-10 max-w-3xl mx-auto w-full bg-white shadow-xl rounded-2xl mt-12 mb-12 min-h-[600px] flex flex-col items-center border-t-8 border-orange-500">
                <h2 className="text-3xl font-bold text-green-700 mb-6">Delete Account</h2>

                <div className="bg-white shadow-md rounded-2xl p-8 w-full border border-gray-200">
                    {!confirmDelete ? (
                        <>
                            <p className="text-lg text-gray-700">Enter your password to delete your account:</p>
                            <div className="relative w-full mt-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-2 border-gray-300 focus:border-orange-500 focus:ring-green-500 p-3 w-full rounded-lg outline-none pr-12"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-green-500 hover:text-green-700 transition"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                            <button
                                onClick={handleDelete}
                                className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
                            >
                                Continue
                            </button>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-xl font-semibold text-orange-600">
                                Are you absolutely sure? This action cannot be undone.
                            </p>
                            <p className="text-gray-600 mt-2">Your account and all associated data will be permanently deleted.</p>
                            <div className="flex gap-6 mt-6 justify-center">
                                <button
                                    onClick={confirmAccountDeletion}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserSidebar from "../components/UserSidebar.js";
import axios from "axios";
import { useCart } from "../helpers/CartContext";
import { useTranslation } from "react-i18next";

const DeleteAccount = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn } = useCart();
    const { t } = useTranslation("deleteaccount");  

    const handleDelete = async () => {
        setErrorMessage("");

        if (!password.trim()) {
            setErrorMessage(t("errorPasswordRequired"));
            return;
        }

        setConfirmDelete(true);
    };

    const confirmAccountDeletion = async () => {
        try {
            setIsLoading(true);

            await axios.post(
                'http://localhost:8080/api/users/delete-account',
                { password },
                { withCredentials: true }
            );


            localStorage.removeItem("loggedInUser");
            setIsLoggedIn(false);

            navigate("/");

        } catch (error) {
            setConfirmDelete(false);

            if (error.response) {
                const backendMessage = error.response.data;

                if (typeof backendMessage === "string" && backendMessage.toLowerCase().includes("incorrect password")) {
                    setErrorMessage(t("errorIncorrectPassword"));
                } else {
                    setErrorMessage(backendMessage || t("errorFailedDelete"));
                }
            } else {
                setErrorMessage(t("errorNetwork"));
            }



        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex bg-green-50 min-h-screen">
            <UserSidebar />

            <div className="p-10 max-w-3xl mx-auto w-full bg-white shadow-xl rounded-2xl mt-12 mb-12 min-h-[600px] flex flex-col items-center border-t-8 border-orange-500">
                <h2 className="text-3xl font-bold text-green-700 mb-6">{t("title")}</h2>

                <div className="bg-white shadow-md rounded-2xl p-8 w-full border border-gray-200">
                    {!confirmDelete ? (
                        <>
                            <p className="text-lg text-gray-700">{t("enterPasswordPrompt")}</p>
                            <div className="relative w-full mt-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-2 border-gray-300 focus:border-orange-500 focus:ring-green-500 p-3 w-full rounded-lg outline-none pr-12"
                                    placeholder={t("passwordPlaceholder")}
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
                                disabled={!password.trim()}
                                className={`mt-5 w-full ${password.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 rounded-lg transition`}
                            >
                                {t("continueButton")}
                            </button>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-xl font-semibold text-orange-600">
                                {t("confirmationTitle")}
                            </p>
                            <p className="text-gray-600 mt-2">{t("confirmationDetail")}</p>
                            <div className="flex gap-6 mt-6 justify-center">
                                <button
                                    onClick={confirmAccountDeletion}
                                    disabled={isLoading}
                                    className={`${isLoading ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white px-6 py-3 rounded-lg transition`}
                                >
                                    {isLoading ? t("deleting") : t("confirmDeleteButton")}
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    disabled={isLoading}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition"
                                >
                                    {t("cancelButton")}
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
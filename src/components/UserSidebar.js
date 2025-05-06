import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCreditCard, FaLock, FaTrash, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import { useCart } from "../helpers/CartContext";
import { useFavorites } from "../helpers/FavoritesContext";
import { useTranslation } from "react-i18next";

import axios from "axios";

const Sidebar = () => {

    const { setIsLoggedIn } = useCart();
    const [role, setRole] = useState("");
    //const [token, setToken] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    const { refreshAuth } = useFavorites();
    const [Cart, setCart] = useState(null);
    const { t } = useTranslation("usersidebar");  // sidebar.json dosyasını kullanacak

    const handleLogout = () => {
        axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true })
            .then(response => {
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("role");
                localStorage.removeItem("cart");
                // Rol bilgisini sıfırla
                setCart([]);
                setRole(null);
                setLoggedInUser(null);
                setIsLoggedIn(false);
                refreshAuth();

                navigate("/");

            })
            .catch((error) => {
                console.error("Logout error:", error);
                // Hata durumunda da login sayfasına yönlendirebilirsiniz
                navigate("/");
            });
    };

    return (
        <div className="w-80 bg-gradient-to-b from-green-700 to-green-600 p-6 text-white flex flex-col mt-10 mb-10 shadow-lg rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">{t("userPanel")}</h2>
            <ul className="space-y-6">
            <li>
                    <Link to="/customer-info"
                          className="flex items-center space-x-4 hover:bg-green-500 p-4 rounded-lg transition duration-300">
                        <FaUser className="w-6 h-6"/>
                        <span className="text-lg">{t("myProfile")}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/credit-card"
                          className="flex items-center space-x-4 hover:bg-green-500 p-4 rounded-lg transition duration-300">
                    <FaCreditCard className="w-6 h-6"/>
                        <span className="text-lg">{t("savedCards")}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/change-password"
                          className="flex items-center space-x-4 hover:bg-green-500 p-4 rounded-lg transition duration-300">
                        <FaLock className="w-6 h-6"/>
                        <span className="text-lg">{t("changePassword")}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/delete-account"
                          className="flex items-center space-x-4 hover:bg-red-600 p-4 rounded-lg transition duration-300">
                        <FaTrash className="w-6 h-6"/>
                        <span className="text-lg">{t("deleteAccount")}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contact"
                          className="flex items-center space-x-4 hover:bg-blue-500 p-4 rounded-lg transition duration-300">
                        <FaQuestionCircle className="w-6 h-6"/>
                        <span className="text-lg">{t("help")}</span>
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogout}
                            className="flex items-center space-x-4 w-full text-left hover:bg-gray-600 p-4 rounded-lg transition duration-300">
                        <FaSignOutAlt className="w-6 h-6"/>
                        <span className="text-lg">{t("logout")}</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

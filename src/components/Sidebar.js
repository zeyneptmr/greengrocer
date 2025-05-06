import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Package, Box, Home, Users, LogOut, MessageCircle } from "lucide-react";
import { Plus, Pen, NotebookText, Truck, ClipboardList } from 'lucide-react';
import { MdPercent } from 'react-icons/md';
import axios from "axios";
import { useCart } from "../helpers/CartContext";
import { useFavorites } from "../helpers/FavoritesContext";
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const Sidebar = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const {setIsLoggedIn} = useCart();
    const {refreshAuth} = useFavorites();
    const { language, setLanguage } = useContext(LanguageContext);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const { t } = useTranslation('sidebar');


    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
        setIsLanguageMenuOpen(false);
    };

    const toggleLanguageMenu = () => {
        setIsLanguageMenuOpen(!isLanguageMenuOpen);
    };


    useEffect(() => {
        axios.get("http://localhost:8080/api/users/me", {withCredentials: true})
            .then(response => {
                if (response.data && response.data.role) {
                    setRole(response.data.role);
                } else {
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error("Error during authentication check:", error);
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        axios.post("http://localhost:8080/api/users/logout", {}, {withCredentials: true})
            .then(() => {
                localStorage.clear();
                setRole(null);
                setLoggedInUser(null);
                setIsLoggedIn(false);
                refreshAuth();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout error:", error);
                navigate("/login");
            });
    };

    const sidebarTitle = role === "MANAGER" ? t("manager_panel") : role === "ADMIN" ? t("admin_panel") : t("user_home");
    const dashboardLink = role === "MANAGER" ? "/manager" : role === "ADMIN" ? "/admin" : "/user/home";


    return (
        <>
            <aside className="gap-4 w-64 bg-green-600 text-white flex flex-col p-4 h-screen">
                <h2 className="text-2xl font-bold mb-6 text-center">{sidebarTitle}</h2>
                <nav className="flex-1">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to={dashboardLink}
                                className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                            >
                                <Home size={25}/>
                                <span>{t("dashboard")}</span>
                            </Link>
                        </li>

                        {role === "MANAGER" ? (
                            <li>
                                <Link
                                    to="/manager/inventory"
                                    className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                >
                                    <Package size={25}/>
                                    <span>{t("inventory")}</span>
                                </Link>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    to="/admin/displayproducts"
                                    className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                >
                                    <NotebookText size={25}/>
                                    <span>{t("display_products")}</span>
                                </Link>
                            </li>
                        )}

                        {role === "MANAGER" ? (
                            <>
                                <li>
                                    <Link
                                        to="/manager/discounts"
                                        className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                    >
                                        <MdPercent size={25}/>
                                        <span>{t("discounts")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/manager/customer-order"
                                        className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                    >
                                        <ClipboardList size={25}/>
                                        <span>{t("customer_orders")}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/manager/customer-feedback"
                                        className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                    >
                                        <MessageCircle size={25}/>
                                        <span>{t("customer_forms")}</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            role === "ADMIN" && (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/addproducts"
                                            className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                        >
                                            <Plus size={20}/>
                                            <span>{t("add_products")}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/updateproducts"
                                            className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg"
                                        >
                                            <Pen size={20}/>
                                            <span>{t("update_products")}</span>
                                        </Link>
                                    </li>
                                </>
                            )
                        )}
                    </ul>
                </nav>

                {/* Dil seçme butonu */ }
                <div className="relative flex justify-center mb-4">
                    <button
                        onClick={toggleLanguageMenu}
                        className="flex flex-col items-center gap-1 px-2 py-1 rounded transition-transform hover:scale-110 relative"
                    >
                        <span className="text-3xl">🌍</span>
                        <span className="text-sm">{language.toUpperCase()}</span>
                    </button>
                    {isLanguageMenuOpen && (
                        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-md w-32 z-50 text-black">
                            <ul>
                                <li onClick={() => handleLanguageChange('en')}
                                    className="p-2 cursor-pointer hover:bg-gray-200 text-lg">🇬🇧 English
                                </li>
                                <li onClick={() => handleLanguageChange('tr')}
                                    className="p-2 cursor-pointer hover:bg-gray-200 text-lg">🇹🇷 Türkçe
                                </li>
                            </ul>
                        </div>
                    )}
                </div>









                <div className="mt-auto mb-20 flex justify-center">
                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-transform duration-200 hover:scale-125"
                    >
                        <LogOut size={24} className="text-white"/>
                    </button>
                </div>
            </aside>
        </>
    );
};
export default Sidebar;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Package, Box, Home, Users, LogOut, MessageCircle } from "lucide-react";
import { Plus, Pen, NotebookText, Truck, ClipboardList } from 'lucide-react';
import { MdPercent } from 'react-icons/md';
import axios from "axios";
import { useCart } from "../helpers/CartContext";
import { useFavorites } from "../helpers/FavoritesContext";

const Sidebar = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const { setIsLoggedIn } = useCart();
    const { refreshAuth } = useFavorites();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/api/users/me", { withCredentials: true })
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
        axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true })
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

    const sidebarTitle = role === "MANAGER" ? "Manager Panel" : role === "ADMIN" ? "Admin Panel" : "User Home";
    const dashboardLink = role === "MANAGER" ? "/manager" : role === "ADMIN" ? "/admin" : "/user/home";

    // Burada ana içeriği kenara itiyoruz
    useEffect(() => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
            mainContent.style.transition = "margin-left 0.3s ease";
            mainContent.style.marginLeft = isSidebarOpen ? "256px" : "0"; // 256px = w-64
        }
    }, [isSidebarOpen]);

    return (
        <>
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-orange-500 hover:text-orange-700 focus:outline-none"
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

            <aside
                className={`bg-green-600 text-white flex flex-col p-4 h-screen fixed top-0 left-0 z-40 transition-transform duration-300 ${
                    isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
                }`}>
                <h2 className="text-2xl font-bold mb-6 mt-12 text-center">{sidebarTitle}</h2>

                <nav className="flex-1">
                    <ul className="space-y-4">
                        <li>
                            <Link to={dashboardLink}
                                  className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                <Home size={25}/>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        {role === "MANAGER" ? (
                            <>
                                <li>
                                    <Link to="/manager/inventory"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <Package size={25}/>
                                        <span>Inventory</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/discounts"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <MdPercent size={25}/>
                                        <span>Discounts</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/customer-order"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <ClipboardList size={25}/>
                                        <span>Customer Orders</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manager/customer-feedback"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <MessageCircle size={25}/>
                                        <span>Customer Feedback</span>
                                    </Link>
                                </li>
                            </>
                        ) : role === "ADMIN" && (
                            <>
                                <li>
                                    <Link to="/admin/displayproducts"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <NotebookText size={25}/>
                                        <span>Display Products</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/addproducts"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <Plus size={20}/>
                                        <span>Add Products</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/updateproducts"
                                          className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <Pen size={20}/>
                                        <span>Update Products</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="mt-auto mb-20 flex justify-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300"
                    >
                        <LogOut size={20}/>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

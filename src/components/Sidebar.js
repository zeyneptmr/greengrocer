import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart } from "lucide-react";
import { Plus, NotebookText, Pen } from 'lucide-react';
import adminIcon from '../assets/admin.svg'; // Admin ikonu
import Clock from "../components/Clock"; // Saat bileşeni


const Sidebar = () => {
    const location = useLocation(); // Yönlendirme yolunu almak için kullanılır
    const [role, setRole] = useState("");

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            setRole(loggedInUser.role); // Giriş yapan kullanıcı rolünü al
        }
    }, []);

    // Yönetici veya Manager rolünde olup olmadığını kontrol et
    const isManager = location.pathname.includes("manager");
    const isAdmin = location.pathname.includes("admin");

    // Sidebar başlığını dinamik olarak değiştirebiliriz
    const sidebarTitle = isManager ? "Manager Panel" : "Admin Panel";

    return (
        <aside className="w-64 bg-green-600 text-white flex flex-col p-4 h-screen">
            <h2 className="text-2xl font-bold mb-6 text-center">{sidebarTitle}</h2>
            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <Link to="/admin" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Home size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* Eğer Manager sayfasına yönlendirildiyse, "Products" yerine "Stocks" göster */}
                    {isManager ? (
                        <li>
                            <Link to="/admin/stocks" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <Users size={20} />
                                <span>Stocks</span>
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/admin/displayproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <NotebookText size={20} />
                                <span>Display Products</span>
                            </Link>
                        </li>
                    )}

                    {/* Eğer Admin sayfasına yönlendirildiyse, "Edit Products" menüsü olsun */}
                    {isAdmin && (
                        <li>
                            <Link to="/admin/addproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <Plus size={20} />
                                <span>Add Products</span>
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link to="/admin/updateproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Pen size={20} />
                            <span>Update Products</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="mt-auto mb-20 flex justify-center">
                <Link to="/">
                    <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-transform duration-200 hover:scale-125">
                        <LogOut size={24} className="text-white" />
                    </button>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;

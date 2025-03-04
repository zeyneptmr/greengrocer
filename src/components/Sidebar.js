import React from 'react';
import { Link } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart } from "lucide-react";

const SideBar = ({ role }) => {
    const isAdmin = role === "admin";

    return (
        <aside className="w-64 bg-green-600 text-white flex flex-col p-4 h-screen">
            <h2 className="text-2xl font-bold mb-6 text-center">{isAdmin ? "Admin Panel" : "Manager Panel"}</h2>
            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <Link to={isAdmin ? "/admin" : "/manager"} className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Home size={20} />
                            <span>{isAdmin ? "Admin Dashboard" : "Manager Dashboard"}</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={isAdmin ? "/admin/displayproducts" : "/manager/displayproducts"} className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Users size={20} />
                            <span>{isAdmin ? "Display Products" : "View Products"}</span>
                        </Link>
                    </li>
                    {isAdmin && (
                        <li>
                            <Link to="/admin/editproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                                <BarChart size={20} />
                                <span>Edit Products</span>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link to={isAdmin ? "/admin/settings" : "/manager/settings"} className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Settings size={20} />
                            <span>{isAdmin ? "Admin Settings" : "Manager Settings"}</span>
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

export default SideBar;

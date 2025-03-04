// Example UserPage.js
import React from 'react';
import { Link } from "react-router-dom";
import { Home, Users, Settings, LogOut, BarChart } from "lucide-react";
import adminIcon from '../assets/admin.svg';
import Clock from "../components/Clock";

const AdminPage = () => {
    return (
    <div className="flex h-screen bg-gray-100">

        <aside className="w-64 bg-green-600 text-white flex flex-col p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <Link to="/admin" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Home size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/displayproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Users size={20} />
                            <span>Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/editproducts" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <BarChart size={20} />
                            <span>Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/settings" className="flex items-center space-x-2 hover:bg-green-700 p-3 rounded-lg">
                            <Settings size={20} />
                            <span>Products</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="mt-auto mb-20 flex justify-center">
                <Link to= "/">
                <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-transform duration-200 hover:scale-125">
                    <LogOut size={24} className="text-white" />
                </button>
                
                </Link>
            </div>

        </aside>

        <main className="flex-1 flex flex-col">
           
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-700">Welcome, Admin</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-500">Admin Panel</span>
                    <img src={adminIcon} alt="Admin" className="rounded-full w-20 h-20" />
                </div>
            </header>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-green-700">Today</h3>
                        <p className="text-2xl text-gray-500 font-medium"> <Clock /></p>
                    </div>
                    
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-green-700">Total Sales</h3>
                        <p className="text-2xl text-gray-500 font-medium"> $45,300</p>
                    </div>
                    

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-2xl font-bold text-green-700">New Orders</h3>
                        <p className="text-2xl text-gray-500 font-medium">120</p>
                    </div>
                    
                </div>
            </div>
        </main>
    </div>
    );
};

export default AdminPage;
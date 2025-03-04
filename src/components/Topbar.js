import React from "react";
import adminIcon from '../assets/admin.svg';
//import managerIcon from '../assets/manager.svg';
import logo from "../assets/logoyazısız.jpeg";

const TopBar = ({ role }) => {
    const isAdmin = role === "admin";

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center relative">
            <h1 className="text-2xl font-semibold text-gray-700">Welcome, {isAdmin ? "Admin" : "Manager"}</h1>
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <img src={logo} alt="Logo" className="w-20 h-20" />
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-500">{isAdmin ? "Admin Panel" : "Manager Panel"}</span>
                <img src={isAdmin ? adminIcon : logo} alt={isAdmin ? "Admin" : "Manager"} className="rounded-full w-20 h-20" />
            </div>
        </header>
    );
};

export default TopBar;

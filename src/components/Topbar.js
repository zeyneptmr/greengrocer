import React from "react";
import adminIcon from '../assets/admin.svg';
import managerIcon from '../assets/manager.svg';  // Manager ikonu
import { useLocation } from 'react-router-dom';

const Topbar = () => {
    const location = useLocation();

    // Adjust icon and title dynamically according to page
    const isManagerPage = location.pathname.includes("manager");
    const pageTitle = isManagerPage ? "Manager Panel" : "Admin Panel";
    const icon = isManagerPage ? managerIcon : adminIcon;
    const userName = isManagerPage ? "Manager" : "Admin";

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-700">{`Welcome, ${userName}`}</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-500">{pageTitle}</span>
                <img src={icon} alt="User Icon" className="rounded-full w-32 h-28" />
            </div>
        </header>
    );
};

export default Topbar;

import React from "react";
import adminIcon from '../assets/admin.svg';
import managerIcon from '../assets/manager.svg';  
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Topbar = () => {
    const location = useLocation();
    const { t } = useTranslation("topbar");

    
    const isManagerPage = location.pathname.includes("manager");
    const pageTitle = isManagerPage ? t("managerPanel") : t("adminPanel");
    const icon = isManagerPage ? managerIcon : adminIcon;
    const userName = isManagerPage ? t("manager") : t("admin");

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-700">{t("welcome", { name: userName })}</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-500">{pageTitle}</span>
                <img src={icon} alt="User Icon" className="rounded-full w-32 h-28" />
            </div>
        </header>
    );
};

export default Topbar;

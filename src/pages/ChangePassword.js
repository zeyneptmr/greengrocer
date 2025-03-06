import React from 'react';
import UserSidebar from "../components/UserSidebar";

const ChangePassword = () => {
    return (
        <div className="flex">

            <UserSidebar/>

            <div className="ml-64 p-6 w-full">
                <h1 className="text-2xl font-bold">Şifre değişikliği</h1>

            </div>
        </div>
    );
};

export default ChangePassword;

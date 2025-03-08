import React, { useEffect, useState } from "react";
import { FaUserCircle, FaCog, FaArrowRight, FaLock } from "react-icons/fa";
import UserSidebar from "../components/UserSidebar.js";

const UserAccount = () => {

    return (
        <div className="flex bg-green-50 min-h-screen">
            <UserSidebar/>
            <div className="p-10 max-w-3xl mx-auto w-full bg-white shadow-xl rounded-2xl mt-12 mb-12 min-h-[600px] flex flex-col items-center border-t-8 border-orange-500">
                <div className="bg-white shadow-md rounded-2xl p-8 w-full border border-gray-200">
                    <div className="bg-white shadow-md rounded-lg p-6 text-center">
                        <FaUserCircle className="text-green-600 text-6xl mx-auto mb-3" />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome!
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                        Use the <strong>User Panel</strong> to manage your account settings.
                        </p>
                    </div>

                    {/* Information Cards */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-green-100 border-l-4 border-green-500 rounded-lg">
                            <FaCog className="text-green-700 text-4xl mb-3" />
                            <h3 className="text-xl font-semibold text-green-700">
                                Update Your Profile
                            </h3>
                            <p className="text-gray-700">
                                Go to <strong>"My Profile"</strong> to update your personal details.
                            </p>
                        </div>

                        <div className="p-6 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
                            <FaArrowRight className="text-blue-700 text-4xl mb-3" />
                            <h3 className="text-xl font-semibold text-blue-700">
                                Manage Your Saved Cards
                            </h3>
                            <p className="text-gray-700">
                                View and edit your payment details in the <strong>"Saved Cards"</strong> section.
                            </p>
                        </div>

                        <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg">
                            <FaLock className="text-yellow-700 text-4xl mb-3" />
                            <h3 className="text-xl font-semibold text-yellow-700">
                                Change Your Password
                            </h3>
                            <p className="text-gray-700">
                                Secure your account by updating your password in the <strong>"Change Password"</strong> section.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAccount;

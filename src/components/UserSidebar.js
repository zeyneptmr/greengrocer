import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCreditCard, FaLock, FaTrash, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
    return (
        <div className="w-64 md:w-72 lg:w-80 bg-gradient-to-b from-green-700 to-green-600 p-6 text-white flex flex-col mt-10 mb-10 shadow-lg rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">User Panel</h2>
            <ul className="space-y-4">
                <li>
                    <Link to="/customer-info" className="flex items-center space-x-3 hover:bg-green-500 p-3 rounded-lg transition duration-300">
                        <FaUser className="w-6 h-6" />
                        <span className="text-lg">My Profile</span>
                    </Link>
                </li>
                <li>
                    <Link to="/credit-card" className="flex items-center space-x-3 hover:bg-green-500 p-3 rounded-lg transition duration-300">
                        <FaCreditCard className="w-6 h-6" />
                        <span className="text-lg">Saved Cards</span>
                    </Link>
                </li>
                <li>
                    <Link to="/change-password" className="flex items-center space-x-3 hover:bg-green-500 p-3 rounded-lg transition duration-300">
                        <FaLock className="w-6 h-6" />
                        <span className="text-lg">Change Password</span>
                    </Link>
                </li>
                <li>
                    <Link to="/delete-account" className="flex items-center space-x-3 hover:bg-red-600 p-3 rounded-lg transition duration-300">
                        <FaTrash className="w-6 h-6" />
                        <span className="text-lg">Delete Account</span>
                    </Link>
                </li>
                <li>
                    <Link to="/help" className="flex items-center space-x-3 hover:bg-blue-500 p-3 rounded-lg transition duration-300">
                        <FaQuestionCircle className="w-6 h-6" />
                        <span className="text-lg">Help</span>
                    </Link>
                </li>
                <li>
                    <Link to="/logout" className="flex items-center space-x-3 hover:bg-gray-600 p-3 rounded-lg transition duration-300">
                        <FaSignOutAlt className="w-6 h-6" />
                        <span className="text-lg">Logout</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

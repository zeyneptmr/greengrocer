import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 bg-green-600 text-white rounded-lg shadow-lg p-4 mt-20"> {/* mt-16 ile menüyü daha aşağıya kaydırdık */}
            <ul>
                <li className="mb-12">
                    <Link
                        to="/customer-info"
                        className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12h3m-3 4h2m-6-8H9m3 4h3m0 4H9m4 0h3m0 4H9m4 0h3m-5-6H5m5 0h3M5 4h14M5 4v10h14V4z"
                            />
                        </svg>
                        <span className="text-xl">Kullanıcı Bilgilerim</span>
                    </Link>
                </li>
                <li className="mb-12">
                    <Link
                        to="/credit-card"
                        className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 9l-7 7-7-7"
                            />
                        </svg>
                        <span className="text-xl">Kayıtlı Kartlarım</span>
                    </Link>
                </li>
                <li className="mb-12">
                    <Link
                        to="/change-password"
                        className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 3h8a2 2 0 012 2v14a2 2 0 01-2 2h-8"
                            />
                        </svg>
                        <span className="text-xl">Şifre Değişikliği</span>
                    </Link>
                </li>
                <li>
                    <Link
                        to="/delete-account"
                        className="flex items-center space-x-3 hover:bg-green-700 p-2 rounded"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span className="text-xl">Hesabımı Sil</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

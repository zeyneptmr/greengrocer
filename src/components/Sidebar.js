
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, LogOut, MessageCircle } from "lucide-react";
import { Plus,  Pen, NotebookText, Truck, ClipboardList } from 'lucide-react';
import axios from "axios";

const Sidebar = () => {
    //const location = useLocation();
    //const [token, setToken] = useState(null);
    //const [loggedInUser, setLoggedInUser] = useState(null); // Giriş yapan kullanıcı bilgisi

    const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        // Kullanıcı bilgilerini doğrulamak için /me endpoint'ini çağır
        axios.get("http://localhost:8080/api/users/me", { withCredentials: true })
            .then(response => {
                if (response.data && response.data.role) {
                    setRole(response.data.role);
                } else {
                    navigate('/login'); // Eğer doğrulama başarısızsa login sayfasına yönlendir
                }
            })
            .catch(error => {
                console.error("Error during authentication check:", error);
                navigate('/login'); // Hata durumunda login sayfasına yönlendir
            });
    }, [navigate]);


    const handleLogout = () => {
        //setToken(null);  // State'teki token'i sıfırlıyoruz
        setRole(null);

        // Navigate to login page
        navigate("/login");
    };

    // Dinamik sidebar başlığını ve yönlendirme linkini ayarlıyoruz
    const sidebarTitle = role === "MANAGER" ? "Manager Panel" : role === "ADMIN" ? "Admin Panel" : "User Home";

    const dashboardLink = role === "MANAGER" ? "/manager" : role === "ADMIN" ? "/admin" : "/user/home";

    return (
        <aside className="gap-4 w-64 bg-green-600 text-white flex flex-col p-4 h-screen">
            <h2 className="text-2xl font-bold mb-6 text-center">{sidebarTitle}</h2>
            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <Link to={dashboardLink} className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                            <Home size={25} />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {role === "MANAGER" ?  (
                        <li>
                            <Link to="/manager/inventory" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                <Users size={25} />
                                <span>Inventory</span>
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/admin/displayproducts" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                <NotebookText size={25} />
                                <span>Display Products</span>
                            </Link>
                        </li>
                    )}

                    {role === "MANAGER" ?  (
                        <>
                            <li>
                                <Link to="/manager/customer-order" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                    <ClipboardList size={25} />
                                    <span>Customer Orders</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/manager/customer-feedback" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                    <MessageCircle size={25} />
                                    <span>Customer Feedback</span>
                                </Link>
                            </li>
                        </>
                    ) : (
                        role === "ADMIN" && (
                            <>
                                <li>
                                    <Link to="/admin/addproducts" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <Plus size={20} />
                                        <span>Add Products</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/updateproducts" className="flex items-center space-x-3 hover:bg-green-700 p-3 rounded-lg">
                                        <Pen size={20} />
                                        <span>Update Products</span>
                                    </Link>
                                </li>
                            </>
                        )
                    )}
                </ul>
            </nav>
            <div className="mt-auto mb-20 flex justify-center">
                <button
                    onClick={handleLogout}
                    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-transform duration-200 hover:scale-125">
                    <LogOut size={24} className="text-white" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

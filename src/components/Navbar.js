import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Heart, User, Home, ChevronDown, Bell } from "lucide-react"; // Import Bell icon
import { Link, useNavigate, useLocation } from "react-router-dom";
import Account from "./Account";
import logo from "../assets/logoyazısız.jpeg";
//import { useCart } from "../helpers/CartContext";
//import products from "../data/products";
import { useFavorites } from "../helpers/FavoritesContext";
import SearchBar from "./SearchBar";
import axios from "axios";
import { useContext } from "react";
//import { CartContext } from "/Users/zeynep/greengrocer/src/helpers/CartContext.js";
import { useCart } from "../helpers/CartContext";

const menuItems = [
    { name: "Fruits" },
    { name: "Vegetables" },
    { name: "Baked Goods" },
    { name: "Olives & Oils" },
    { name: "Sauces" },
    { name: "Dairy" },
];

const Navbar = () => {
    const { setIsLoggedIn } = useCart();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isCartAccessRestricted, setIsCartAccessRestricted] = useState(false);
    const { getTotalProductTypes } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [loggedInUser, setLoggedInUser] = useState(null); // Giriş yapan kullanıcı bilgisi
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Profil menüsünün açık olup olmadığı
    const profileMenuRef = useRef();
    const { favorites } = useFavorites();
    const { refreshAuth } = useFavorites();

    const [Cart, setCart] = useState(null);

    const [role, setRole] = useState("");
    //const [hoveredMenu, setHoveredMenu] = useState(null);

    // Giriş yapan kullanıcıyı kontrol et
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        setLoggedInUser(storedUser);

        const isEmployeeRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/manager');
        if (isEmployeeRoute && !storedUser) {
            navigate("/");
        }

    }, [navigate, location]); // navigate değiştiğinde kullanıcı bilgisini tekrar kontrol et

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMenuClick = (menuName) => {
        switch (menuName) {
            case "Fruits":
                navigate("/fruits");
                break;
            case "Vegetables":
                navigate("/vegetables");
                break;
            case "Baked Goods":
                navigate("/bakedgoods");
                break;
            case "Olives & Oils":
                navigate("/olives");
                break;
            case "Sauces":
                navigate("/sauces");
                break;
            case "Dairy":
                navigate("/dairy");
                break;
            default:
                break;
        }
    };

    const handleCartClick = () => {
        console.log("loggedInUser:", loggedInUser); // Kullanıcı bilgisi konsolda görünüyor mu?

        if (!loggedInUser) {
            setIsCartAccessRestricted(true);
        } else {
            console.log("Navigating to /cart"); // Bu çalışıyor mu kontrol et
            navigate("/cart");
        }
    };

    const handleProfileMenuToggle = (e) => {
        e.preventDefault(); // Varsayılan davranışı (yeni sayfaya yönlendirme) engelle
        setIsProfileMenuOpen((prev) => !prev);
    };

    const handleClickOutside = (e) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
            setIsProfileMenuOpen(false);
        }
    };

    const handleLogout = () => {
        axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true })
            .then(response => {
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("role");
                localStorage.removeItem("cart");
                // Rol bilgisini sıfırla
                setCart([]);
                setRole(null);
                setLoggedInUser(null);
                setIsLoggedIn(false);
                refreshAuth();

                navigate("/");

                console.log("logout succesfull");
                console.log("")
                console.log("Logout Response:", response.data);
                console.log("role:", response.data.role);
                console.log("cart_item:", response.data.cart);
            })
            .catch((error) => {
                console.error("Logout error:", error);
                // Hata durumunda da login sayfasına yönlendirebilirsiniz
                navigate("/login");
            });
    };

    return (
        <>
            <nav className="w-full bg-white text-green-600 px-4 relative flex flex-col md:flex-row items-center justify-between h-auto md:h-24 space-y-2 md:space-y-0">
                <div className="flex items-center w-full md:w-auto justify-between">
                    <div className="flex items-center">
                        <img src={logo} alt="Tap-Taze Logo" className="h-16 md:h-20 w-auto" />
                        <Link to="">
                            <h1 className="text-3xl md:text-6xl font-bold text-green-600 ml-2">TapTaze</h1>
                        </Link>
                    </div>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/3 mt-2 md:mt-0">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-4 md:gap-10 w-full md:w-auto justify-center md:justify-end">
                    {loggedInUser ? (
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={handleProfileMenuToggle}
                                className="flex flex-col items-center p-1 rounded transition-transform hover:scale-110"
                            >
                                <User size={32} />
                                <span className="text-xs">Profile</span>
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-md w-48 z-50">
                                    <ul>
                                        <li onClick={() => { navigate("/account"); setIsProfileMenuOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200">Account settings</li>
                                        <li onClick={() => { navigate("/address"); setIsProfileMenuOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200">Addresses</li>
                                        <li onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }} className="p-2 cursor-pointer hover:bg-gray-200">Log Out</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setIsAccountOpen(true)} className="flex flex-col items-center p-1 rounded transition-transform hover:scale-110">
                            <User size={32} />
                            <span className="text-xs">Log In</span>
                        </button>
                    )}

                    <Link to="/favorites">
                        <button className="flex flex-col items-center p-1 rounded transition-transform hover:scale-110 relative">
                            <Heart size={32} />
                            <span className="text-xs">Favorites</span>
                            {favorites.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
                            )}
                        </button>
                    </Link>

                    <button onClick={handleCartClick} className="flex flex-col items-center p-1 rounded transition-transform hover:scale-110 relative">
                        <ShoppingCart size={32} />
                        <span className="text-xs">{loggedInUser ? "My Cart" : "Cart"}</span>
                        {getTotalProductTypes() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalProductTypes()}
              </span>
                        )}
                    </button>
                </div>
            </nav>

            {isCartAccessRestricted && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg text-center">
                        <button onClick={() => setIsCartAccessRestricted(false)} className="absolute -top-4 left-0 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-800">
                            ✖
                        </button>
                        <p className="text-lg font-semibold mb-4">Please log in to continue!</p>
                        <button onClick={() => { setIsAccountOpen(true); setIsCartAccessRestricted(false); }} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            Log In
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-green-500 text-white p-3">
                <div className="flex justify-center overflow-x-auto">
                    <ul className="flex space-x-4 sm:space-x-6">
                        <li className="cursor-pointer hover:scale-125 hover:text-orange-500">
                            <Link to="">
                                <Home size={25} />
                            </Link>
                        </li>
                        {menuItems.map((menu, index) => (
                            <li key={index} onClick={() => handleMenuClick(menu.name)} className="cursor-pointer hover:scale-110 hover:text-orange-500">
                                <span className="text-sm sm:text-lg">{menu.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Account isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        </>
    );
};

export default Navbar;

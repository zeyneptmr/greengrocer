import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, User, Home, ChevronDown, Bell } from "lucide-react"; // Import Bell icon
import { Link, useNavigate } from "react-router-dom";
import Account from "./Account";
import logo from "../assets/logoyazısız.jpeg";
import { useCart } from "../helpers/CartContext";
import products from "../data/products";
import { useFavorites } from "../helpers/FavoritesContext";
import SearchBar from "./SearchBar";

const menuItems = [
    { name: "Fruits", subItems: ["Dried Fruit", "Fresh Fruit"] },
    { name: "Vegetables", subItems: ["Dried Vegetables", "Fresh Vegetables"] },
    { name: "Baked Goods", subItems: ["Breads", "Pastries", "Cakes"] },
    { name: "Olives & Oils", subItems: ["Oils", "Butters", "Olives"] },
    { name: "Sauces", subItems: ["Tomato Paste", "Sauces", "Jam", "Vinegar"] },
    { name: "Dairy", subItems: ["Milk & Drinks", "Cheese", "Yoghurt"] },
];

const Navbar = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isCartAccessRestricted, setIsCartAccessRestricted] = useState(false);
    const { getTotalProductTypes } = useCart();
    const navigate = useNavigate();
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null); // Giriş yapan kullanıcı bilgisi
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Profil menüsünün açık olup olmadığı
    const [notifications, setNotifications] = useState(5); // Set initial notification count
    const {favorites} = useFavorites();


    // Giriş yapan kullanıcıyı kontrol et
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        setLoggedInUser(storedUser);
    }, [navigate]); // navigate değiştiğinde kullanıcı bilgisini tekrar kontrol et



    {/*const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);

        setQuery("");
        setFilteredProducts([]);
        setShowSuggestions(false);
    };*/}

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

    const handleSubMenuClick = (menuName, subItemName) => {
        const formattedSubItem = subItemName.toLowerCase().replace(/ /g, "-");
        navigate(`/${menuName.toLowerCase()}/${formattedSubItem}`);
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
        setIsProfileMenuOpen(!isProfileMenuOpen); // Profil menüsünün açılmasını veya kapanmasını sağla
    };

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        navigate("/login"); // Login sayfasına yönlendir
    };

    return (
        <>
            <nav className="h-24 w-full bg-white text-green-600 flex items-center px-4 relative">
                <div className="h-full flex items-center">
                    <img src={logo} alt="Tap-Taze Logo" className="h-full w-auto"/>
                    <Link to ="">
                    <h1 className="text-6xl font-bold text-green-600 ml-3">TapTaze</h1>
                    </Link>
                </div>

                <SearchBar products={products} />

                <div className="flex items-center gap-10 ml-auto"> {/* Push the buttons to the right */}
                    {loggedInUser ? (
                        <div className="relative">
                            <button
                                onClick={handleProfileMenuToggle}
                                className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                                <User size={44}/>
                                <span className="text-xs">Profile</span> {/* Profile olarak değiştirildi */}
                            </button>
                            {isProfileMenuOpen && (
                                <div
                                    className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-md w-48 z-50">
                                    <ul>
                                        <li
                                            onClick={() => navigate("/account")}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                        >
                                            Hesap Ayarlarım
                                        </li>
                                        <li
                                            onClick={() => navigate("/orders")}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                        >
                                            Siparişlerim
                                        </li>
                                        <li
                                            onClick={() => navigate("/address")}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                        >
                                            Adreslerim
                                        </li>
                                        <li
                                            onClick={handleLogout}
                                            className="p-2 cursor-pointer hover:bg-gray-200"
                                        >
                                            Çıkış Yap
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => setIsAccountOpen(true)}
                                className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                            <User size={44}/>
                            <span className="text-xs">Log In</span>
                        </button>
                    )}

                    <Link to="/favorites">
                        <button
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110 relative">
                            <Heart size={44}/>
                            <span className="text-xs">Favorites</span>
                            {favorites.length > 0 && (
                                <span
                                    className="absolute top-[-5px] right-[5px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favorites.length}
                    </span>
                            )}
                        </button>
                    </Link>

                    {/* Notification button, shown when the user is logged in */}
                    {loggedInUser && notifications > 0 && (
                        <button
                            className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110 relative">
                            <Bell size={44}/>
                            <span className="text-xs">Notifications</span>
                            <span
                                className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                </span>
                        </button>
                    )}

                    <button
                        onClick={handleCartClick}
                        className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110 relative">
                        <ShoppingCart size={44}/>
                        <span
                            className="text-xs">{loggedInUser ? "My Cart" : "Cart"}</span> {/* Cart butonunun yazısı dinamik olarak değiştirildi */}
                        {getTotalProductTypes() > 0 && (
                            <span
                                className="absolute top-[-5px] right-[-5px] bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalProductTypes()}
                </span>
                        )}
                    </button>
                </div>
            </nav>


            {isCartAccessRestricted && (
                <div
                    className="absolute top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Devam etmek için lütfen üye girişi yapın.</p>
                        <button
                            onClick={() => {
                                setIsAccountOpen(true);
                                setIsCartAccessRestricted(false);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Üye Girişi Yap
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-green-500 text-white p-3 relative">
                <div className="flex justify-center">
                    <ul className="flex space-x-6 relative">
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-orange-500 flex items-center justify-center">
                            <Link to="/">
                                <Home size={25} className="inline-block mr-1"/>
                            </Link>
                        </li>
                        {menuItems.map((menu, index) => (
                            <li
                                key={index}
                                className="relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500 z-20 p-1 rounded-md"
                                onMouseEnter={() => setHoveredMenu(menu.name)}
                                onMouseEnter={() => setHoveredMenu(menu.name)}
                                onMouseLeave={() => setHoveredMenu(null)}
                                onClick={() => handleMenuClick(menu.name)}
                            >
                                <span className="flex items-center text-xl hover:text-xl">{menu.name} <ChevronDown
                                    size={16} className="ml-1"/></span>

                                {hoveredMenu === menu.name && (
                                    <ul className="absolute left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-md py-2 w-48 text-center z-9999">
                                        {menu.subItems.map((subItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => handleSubMenuClick(menu.name, subItem)}
                                            >
                                                {subItem}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Account isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)}/>
        </>
    );
};

export default Navbar;



import { useState } from "react";
import { ShoppingCart, Search, Heart, User, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Account from "./Account";
import logo from "../assets/logoyazısız.jpeg";

const Navbar = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    return (
        <>
            <nav className="h-20 w-full bg-white text-green-600 flex items-center px-4">
                <div className="h-full flex items-center">
                    <img src={logo} alt="Tap-Taze Logo" className="h-full w-auto" />
                    <h1 className="text-3xl font-bold text-green-600 ml-3">TapTaze</h1>
                </div>

                <div className="flex-grow flex justify-center">
                    <div className="flex gap-2 w-1/2">
                        <input type="text" placeholder="Search product..." className="p-2 rounded bg-[#f7f7f7] text-black w-full border border-[#B6D1A7]" />
                        <button className="bg-green-600 text-white p-2 rounded">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-1">
                    <button onClick={() => setIsAccountOpen(true)} className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                        <User size={18} />
                        <span className="text-xs">Log In</span>
                    </button>
                    <button className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                        <Heart size={18} />
                        <span className="text-xs">Favorites</span>
                    </button>
                    <button className="flex flex-col items-center bg-transparent text-green-600 p-1 rounded transition-transform hover:scale-110">
                        <ShoppingCart size={18} />
                        <span className="text-xs">Cart</span>
                    </button>
                </div>
            </nav>

            <div className="bg-green-500 text-white p-3">
                <div className="flex justify-center">
                    <ul className="flex space-x-6">
                        {/* Home Icon */}
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-orange-500">
                            <Link to="/">
                                <Home size={25} className="inline-block mr-1" />
                                {/* Home */}
                            </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/fruits"> Fruits </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/vegetables"> Vegetables </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/bakedgoods"> Baked Goods </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/olives"> Olives & Oils </Link>
                        </li>
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
                            <Link to="/sauces"> Sauces </Link>
                        </li>
<<<<<<< HEAD
                        <li className="cursor-pointer hover:underline">
=======
                        <li className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:text-orange-500">
>>>>>>> 006c78baf547507e2150851ce96cec77345f954b
                            <Link to="/dairy"> Dairy </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <Account isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        </>
    );
};

export default Navbar;

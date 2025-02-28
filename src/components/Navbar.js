import { useState } from "react";
import { ShoppingCart, Search, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import Account from "./Account";
import logo from "../assets/logoyazısız.jpeg";

const Navbar = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    //const navigate = useNavigate();

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
                        <li className="cursor-pointer hover:underline">
                            <Link to="/fruits"> Fruits </Link>
                        </li>
                        <li className="cursor-pointer hover:underline">
                            <Link to="/vegetables"> Vegetables </Link>
                        </li>
                        <li className="cursor-pointer hover:underline">
                            <Link to="/bakedgoods"> Baked Goods </Link>
                        </li>
                        <li className="cursor-pointer hover:underline">
                            <Link to="/olives"> Olives & Oils </Link>
                        </li>
                        <li className="cursor-pointer hover:underline">
                            <Link to="/sauces"> Sauces </Link>
                        </li>
                        <li className="cursor-pointer hover:underline">
                            <Link to="/Dairy"> Dairy </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <Account isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)}/>
        </>
    );
};

export default Navbar;

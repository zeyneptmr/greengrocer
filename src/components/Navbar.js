import { useState } from "react";
import { ShoppingCart, Search, Sun, Moon, Heart, User } from "lucide-react";

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <>
            <nav className={`p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-green-600 text-white"} flex justify-between items-center`}>
                {/* Logo */}
                <h1 className="text-2xl font-bold">GreenGrocer</h1>

                {/* Arama Çubuğu */}
                <div className="flex-grow flex justify-center">
                    <div className="flex gap-4 w-1/2">
                        <input
                            type="text"
                            placeholder="Ürün ara..."
                            className="p-2 rounded text-black w-full"
                            style={{ minWidth: "300px" }} // Genişlik ayarı
                        />
                        <button className="bg-white text-green-600 p-2 rounded">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Üye Girişi, Favorilerim ve Tema Değiştirici Butonları */}
                <div className="flex items-center gap-4">
                    <button className="flex flex-col items-center bg-transparent text-white p-2 rounded transition-transform transform hover:scale-110">
                        <User size={24} />
                        <span className="text-sm">Üye Girişi</span>
                    </button>
                    <button className="flex flex-col items-center bg-transparent text-white p-2 rounded transition-transform transform hover:scale-110">
                        <Heart size={24} />
                        <span className="text-sm">Favorilerim</span>
                    </button>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex flex-col items-center bg-transparent text-white p-2 rounded transition-transform transform hover:scale-110"
                    >
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                        <span className="text-sm">{darkMode ? "Aydınlık" : "Karanlık"}</span>
                    </button>
                    <button className="flex items-center bg-transparent text-white p-2 rounded transition-transform transform hover:scale-110">
                        <ShoppingCart size={20} className="mr-2" />
                        Sepetim
                    </button>
                </div>
            </nav>

            {/* Kategoriler Menüsü */}
            <div className="bg-green-500 text-white p-2">
                <div className="flex justify-center">
                    <ul className="flex space-x-6">
                        <li className="cursor-pointer hover:underline">Meyveler</li>
                        <li className="cursor-pointer hover:underline">Sebzeler</li>
                        <li className="cursor-pointer hover:underline">Unlu Mamüller</li>
                        <li className="cursor-pointer hover:underline">Zeytinler</li>
                        <li className="cursor-pointer hover:underline">Salçalar</li>
                        <li className="cursor-pointer hover:underline">Tasarım Kıyafetler</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
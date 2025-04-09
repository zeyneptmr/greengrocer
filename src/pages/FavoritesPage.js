import { useFavorites } from "../helpers/FavoritesContext";
import ProductCard from "../components/ProductCard";
import heartImg from "../assets/sadheart.png";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const FavoritesPage = () => {
    const { favorites } = useFavorites();

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2); 
        }
        return parseFloat(price).toFixed(2); 
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 md:px-10 py-10 bg-white">
            <div className="flex flex-col items-center justify-center text-center mb-10">
                <div className="flex items-center gap-2 sm:gap-4 text-green-800">
                    <FaHeart className="text-3xl sm:text-4xl md:text-5xl text-red-500 animate-pulse" />
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                        Your Favorites
                    </h2>
                </div>
                <p className="text-gray-600 text-base sm:text-lg mt-2 max-w-xl">
                    All your favorite natural delights in one place 🍃
                </p>
            </div>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <img src={heartImg} alt="No favorites" className="w-36 sm:w-44 mb-6" />
                    <p className="text-gray-700 text-lg sm:text-xl font-semibold mb-4 px-4">
                        You haven't added anything to your favorites yet.
                    </p>
                    <Link to="/products">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                            Discover Our Products
                        </button>
                    </Link>
                </div>
            ) : (
                <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center w-full px-4 sm:px-6 md:px-8`}>
                    {favorites.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            id: product.id,
                            name: product.name,
                            price: formatPrice(product.price),
                            image: product.image,
                            stock: product.stock,
                            category: product.category
                        }}
                        hideCartView={true}
                    />
                ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
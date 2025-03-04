import { useFavorites } from "../helpers/FavoritesContext";
import ProductCard from "../components/ProductCard";
import heartImg from "../assets/sadheart.png";



const FavoritesPage = () => {
    const { favorites } = useFavorites();

    return (
        <div className="p-6 min-h-[70vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">FAVORITES</h2>
        {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <img src={heartImg} alt="No favorites" />
                <p className="text-gray-600 mt-4 text-lg font-semibold">There are no products added to favorites yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {favorites.map((product) => (
                    <ProductCard key={product.id} product={product} hideCartView={true} />
                ))}
            </div>
        )}
    </div>
    );
};

export default FavoritesPage;
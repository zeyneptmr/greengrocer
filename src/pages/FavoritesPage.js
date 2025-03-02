import { useFavorites } from "../components/FavoritesContext";
import ProductCard from "../components/ProductCard";


const FavoritesPage = () => {
    const { favorites } = useFavorites();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Favorilerim</h2>
            {favorites.length === 0 ? (
                <p className="text-gray-600 mt-4">Henüz favorilere eklenmiş ürün yok.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                    {favorites.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
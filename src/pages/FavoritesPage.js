import { useFavorites } from "../helpers/FavoritesContext";
import ProductCard from "../components/ProductCard";
import heartImg from "../assets/sadheart.png";

const FavoritesPage = () => {
    const { favorites } = useFavorites();
    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
          images[item.replace('./', '')] = r(item);
        });
        return images;
      };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));



    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;  // Doğrudan Base64 resmini döndür
        }
        // Extract filename from the path
        const filename = path.split('/').pop(); // "dairy1.jpg"

        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Image not found: ${filename}`);
            return '/placeholder.png';  // Placeholder resim
        }

        // Find the matching image from the images object
        return images[filename] || '/placeholder.png';
    };
    
    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2); 
        }
        return parseFloat(price).toFixed(2); 
    };

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
                   
                     <ProductCard
                        key={product.id}
                        product={{
                        id: product.id,
                        name: product.productName,
                        price: formatPrice(product.price),
                        image: getImageFromPath(product.imagePath),
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
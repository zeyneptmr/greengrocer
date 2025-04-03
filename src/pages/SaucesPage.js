import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import sauces1 from '../assets/sauces1.jpg';
import sauces2 from '../assets/sauces2.jpg';

const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
};

const formatPrice = (price) => {
    if (typeof price === "number") {
        return price.toFixed(2); 
    }
    return parseFloat(price).toFixed(2); 
};

const SaucesPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [sauces, setSauces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        const fetchSauces = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/products');
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                const sauceProducts = data.filter(product => 
                    product.category.toLowerCase() === "sauces"
                );
                
                setSauces(sauceProducts);
                setError(null);
            } catch (err) {
                setError('Failed to fetch products: ' + err.message);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchSauces();
    }, []);
    
    useEffect(() => {
        if (sauces.length === 0) return;
        
        let sortedArray = [...sauces];
        
        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.productName.localeCompare(a.productName));
        }
        
        setSauces(sortedArray);
    }, [sortOption]);

    const slideItems = [
        { image: sauces1, name: "sauces1" },
        { image: sauces2, name: "sauces2" },
    ];

    return (
        <div className="p-4 sm:p-6">
            <SlideBar items={slideItems} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-orange-500 text-center mt-10 sm:mt-16 md:mt-20">Sauces</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />
            
            {loading && <p className="text-center py-8">Loading products...</p>}
            {error && <p className="text-center text-red-500 py-8">{error}</p>}
            
            {!loading && !error && (
                <div className={`grid gap-4 
                    ${columns === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}
                    justify-items-center w-full`}>
                    {sauces.length > 0 ? (
                        sauces.map((product) => (
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
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center py-8">No sauce products available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SaucesPage;

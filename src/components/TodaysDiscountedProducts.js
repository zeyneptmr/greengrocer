import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from "../components/ProductCard";

const TodaysDiscountedProducts = () => {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };

    const getImageFromPath = (path) => {
        if (!path) return null;

        if (path.startsWith("data:image")) {
            return path;  // Return Base64 image directly
        }

        const filename = path.split('/').pop(); // Example: "apple.jpg"
        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Image not found: ${filename}`);
            return '/placeholder.png';  // Placeholder image
        }

        return images[imagePath] || '/placeholder.png';
    };

    // Function to fetch discounted products
    const fetchDiscountedProducts = async () => {
        try {
            setLoading(true);
            const baseUrl = 'http://localhost:8080';
            
            const response = await axios.get(`${baseUrl}/api/discountedProducts`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                setDiscountedProducts(response.data);
            } else {
                throw new Error(`Server returned status code: ${response.status}`);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching discounted products:', err);
            setError(`Failed to fetch discounted products: ${err.message || err}`);
            setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchDiscountedProducts();
        
        // Set up polling to refresh data periodically (e.g., every 5 minutes)
        const intervalId = setInterval(() => {
            setRefreshTrigger(prev => prev + 1);
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => clearInterval(intervalId);
    }, []);

    // Refresh data when the trigger changes
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchDiscountedProducts();
        }
    }, [refreshTrigger]);

    if (loading) return <div className="text-center py-4">Loading discount offers...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
    if (discountedProducts.length === 0) return <div className="text-2xl font-bold text-green-700 mb-4 capitalize text-center py-8">No discounted products available today.</div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {discountedProducts.map((item) => (
                <ProductCard 
                    key={`${item.id}-${item.product.id}-${refreshTrigger}`}
                    product={{
                        id: item.product.id,
                        name: item.product.productName,
                        price: formatPrice(item.oldPrice),
                        discountedPrice: formatPrice(item.discountedPrice),
                        image: getImageFromPath(item.product.imagePath),
                        stock: item.product.stock,
                        category: item.product.category,
                        discountRate: item.discountRate,
                        productId: item.product.id
                    }}
                />
            ))}
        </div>
    );
};

export default TodaysDiscountedProducts;
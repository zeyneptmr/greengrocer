import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

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
        if (path.startsWith("data:image")) return path;

        const filename = path.split('/').pop();
        const imagePath = Object.keys(images).find(key => key.includes(filename.split('.')[0]));

        if (!imagePath) {
            console.error(`Image not found: ${filename}`);
            return '/placeholder.png';
        }

        return images[filename] || '/placeholder.png';
    };

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };

    // Check authentication status and get current user
    const checkAuthStatus = () => {
        axios.get(`http://localhost:8080/api/users/me`, { 
            withCredentials: true 
        })
        .then(res => {
            setCurrentUser(res.data);
        })
        .catch(err => {
            console.error("Auth check failed", err);
            setCurrentUser(null);
        });
    };

    // Fetch the latest product data by ID
    const fetchLatestProductData = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${productId}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching latest data for product ${productId}:`, error);
            return null;
        }
    };

    // Get latest data for all favorite products
    const refreshFavoritesWithLatestData = async (favoriteIds) => {
        if (!favoriteIds || favoriteIds.length === 0) return [];
        
        try {
            // Get latest data for all favorite products in parallel
            const productPromises = favoriteIds.map(id => fetchLatestProductData(id));
            const latestProducts = await Promise.all(productPromises);
            
            // Map the products that were successfully fetched
            return latestProducts
                .filter(product => product !== null)
                .map(product => ({
                    id: product.id,
                    name: product.productName || product.name,
                    price: formatPrice(product.price),
                    image: getImageFromPath(product.imagePath || product.image),
                    stock: product.stock,
                    category: product.category
                }));
        } catch (error) {
            console.error("Error refreshing favorites with latest data:", error);
            return [];
        }
    };

    const loadFavorites = async () => {
        setLoading(true);
        
        if (currentUser) {
            // Logged in users: get favorites from API
            try {
                const res = await axios.get("http://localhost:8080/api/favorites", { 
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache'  
                    }
                });
                
                console.log("Loaded favorites:", res.data);
                
                // Get latest data for these favorites
                const favoriteIds = res.data.map(product => product.id);
                const updatedFavorites = await refreshFavoritesWithLatestData(favoriteIds);
                
                setFavorites(updatedFavorites);
            } catch (err) {
                console.error("Favorites fetch error", err);
                setFavorites([]);
            }
        } else {
            // Guest users: start with empty favorites
            // This clears any leftover favorites from previous logged-in users
            setFavorites([]);
        }
        
        setLoading(false);
    };
    
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Load favorites when authentication status changes
    useEffect(() => {
        if (currentUser) {
            loadFavorites();
        } else if (favorites.length > 0) {
            // For non-logged in users with local favorites, refresh them
            loadFavorites();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const toggleFavorite = async (product) => {
        if (!currentUser) {
            // For non-logged in users - get latest product data first
            const latestProduct = await fetchLatestProductData(product.id);
            
            if (latestProduct) {
                const formattedProduct = {
                    id: latestProduct.id,
                    name: latestProduct.productName || product.name,
                    price: formatPrice(latestProduct.price),
                    image: getImageFromPath(latestProduct.imagePath || product.image),
                    stock: latestProduct.stock,
                    category: latestProduct.category
                };
                
                const isAlreadyFavorite = favorites.some(fav => fav.id === formattedProduct.id);
                if (isAlreadyFavorite) {
                    setFavorites(prev => prev.filter(fav => fav.id !== formattedProduct.id));
                } else {
                    setFavorites(prev => [...prev, formattedProduct]);
                }
            } else {
                // Fallback to original product data if latest couldn't be fetched
                const formattedProduct = {
                    id: product.id,
                    name: product.name,
                    price: formatPrice(product.price),
                    image: product.image,
                    stock: product.stock,
                    category: product.category
                };
                
                const isAlreadyFavorite = favorites.some(fav => fav.id === formattedProduct.id);
                if (isAlreadyFavorite) {
                    setFavorites(prev => prev.filter(fav => fav.id !== formattedProduct.id));
                } else {
                    setFavorites(prev => [...prev, formattedProduct]);
                }
            }
            
            return;
        }
        
        // For logged-in users
        try {
            await axios.post(`http://localhost:8080/api/favorites/${product.id}`, {}, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            loadFavorites();
        } catch (err) {
            console.error("Favorite toggle error", err);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(product => product.id === productId);
    };

    // Refresh auth status
    const refreshAuth = () => {
        checkAuthStatus();
    };

    return (
        <FavoritesContext.Provider value={{ 
            favorites, 
            toggleFavorite, 
            isFavorite, 
            loading,
            refreshFavorites: loadFavorites,
            refreshAuth,
            currentUser
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
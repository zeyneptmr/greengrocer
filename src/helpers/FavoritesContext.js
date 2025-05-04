import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const { language } = useContext(LanguageContext);

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

        return images[imagePath] || '/placeholder.png';
    };

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };

    const checkAuthStatus = useCallback(() => {
        axios.get(`http://localhost:8080/api/users/me`, { withCredentials: true })
            .then(res => setCurrentUser(res.data))
            .catch(() => setCurrentUser(null));
    }, []);

    const fetchLatestProductData = useCallback(async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${productId}`, {
                params: { language },
                headers: { 'Cache-Control': 'no-cache' }
            });
            console.log(`Fetched product ${productId} with language: ${language}`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    }, [language]);

    const refreshFavoritesWithLatestData = useCallback(async (favoriteIds) => {
        if (!favoriteIds || favoriteIds.length === 0) return [];

        const productPromises = favoriteIds.map(id => fetchLatestProductData(id));
        const latestProducts = await Promise.all(productPromises);

        return latestProducts
            .filter(product => product !== null)
            .map(product => ({
                id: product.id,
                name: product.translatedName || product.productName || product.name,
                price: formatPrice(product.price),
                image: getImageFromPath(product.imagePath || product.image),
                stock: product.stock,
                category: product.category
            }));
    }, [fetchLatestProductData]);

    const loadFavorites = useCallback(async () => {
        console.log(`Loading favorites with language: ${language}`);
        setLoading(true);

        if (currentUser) {
            try {
                const res = await axios.get(`http://localhost:8080/api/favorites`, {
                    params: { language },
                    withCredentials: true,
                    headers: { 'Cache-Control': 'no-cache' }
                });

                const updatedFavorites = res.data.map(product => ({
                    id: product.id,
                    name: product.translatedName || product.productName || product.productKey,
                    price: formatPrice(product.price),
                    image: getImageFromPath(product.imagePath),
                    stock: product.stock,
                    category: product.category
                }));

                setFavorites(updatedFavorites);
            } catch (error) {
                console.error("Error loading favorites:", error);
                setFavorites([]);
            }
        } else {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');

            if (storedFavorites.length > 0) {
                const refreshedFavorites = await refreshFavoritesWithLatestData(
                    storedFavorites.map(fav => fav.id)
                );
                setFavorites(refreshedFavorites);
            } else {
                setFavorites([]);
            }
        }

        setLoading(false);
    }, [currentUser, language, refreshFavoritesWithLatestData]);
    
    useEffect(() => {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            localStorage.removeItem("favorites");
        }
    }, [currentUser]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    useEffect(() => {
        console.log(`Language changed to: ${language}, reloading favorites`);
        loadFavorites();
    }, [currentUser, language, loadFavorites]);

    const toggleFavorite = async (product) => {
        if (!currentUser) {
            const latestProduct = await fetchLatestProductData(product.id);

            const formattedProduct = latestProduct ? {
                id: latestProduct.id,
                name: latestProduct.translatedName || latestProduct.productName || product.name,
                price: formatPrice(latestProduct.price),
                image: getImageFromPath(latestProduct.imagePath || product.image),
                stock: latestProduct.stock,
                category: latestProduct.category
            } : {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                image: product.image,
                stock: product.stock,
                category: product.category
            };

            const isAlreadyFavorite = favorites.some(fav => fav.id === formattedProduct.id);
            const updatedFavorites = isAlreadyFavorite ?
                favorites.filter(fav => fav.id !== formattedProduct.id) :
                [...favorites, formattedProduct];

            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/favorites/${product.id}`, {}, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            loadFavorites();
        } catch (err) {
            console.error("Favorite toggle error", err);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(product => product.id === productId);
    };

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
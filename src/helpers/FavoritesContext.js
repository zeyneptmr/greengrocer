import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const { language } = useContext(LanguageContext);  // ✅ Dil desteği

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

    // ✅ Kullanıcıyı kontrol et
    const checkAuthStatus = () => {
        axios.get(`http://localhost:8080/api/users/me`, { withCredentials: true })
            .then(res => setCurrentUser(res.data))
            .catch(() => setCurrentUser(null));
    };

    // ✅ Tek ürün güncellemesi (dile göre)
    const fetchLatestProductData = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${productId}?language=${language}`, {
                headers: { 'Cache-Control': 'no-cache' }
            });
            return response.data;
        } catch {
            return null;
        }
    };

    // ✅ Tüm favorileri güncelle (dile göre)
    const refreshFavoritesWithLatestData = async (favoriteIds) => {
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
    };

    const loadFavorites = async () => {
        setLoading(true);

        if (currentUser) {
            try {
                const res = await axios.get("http://localhost:8080/api/favorites", {
                    withCredentials: true,
                    headers: { 'Cache-Control': 'no-cache' }
                });

                const favoriteIds = res.data.map(product => product.id);
                const updatedFavorites = await refreshFavoritesWithLatestData(favoriteIds);
                setFavorites(updatedFavorites);
            } catch {
                setFavorites([]);
            }
        } else {
            setFavorites([]);
        }

        setLoading(false);
    };

    // ✅ Kullanıcı giriş yaptı mı kontrol
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // ✅ Kullanıcı değişince favorileri yükle
    useEffect(() => {
        if (currentUser) {
            loadFavorites();
        } else {
            setFavorites([]);
            setLoading(false);
        }
    }, [currentUser]);

    // ✅ Dil değişince favorileri güncelle
    useEffect(() => {
        if (favorites.length > 0) {
            const refreshFavoritesLanguage = async () => {
                const favoriteIds = favorites.map(product => product.id);
                const updatedFavorites = await refreshFavoritesWithLatestData(favoriteIds);
                setFavorites(updatedFavorites);
            };
            refreshFavoritesLanguage();
        }
    }, [language]);

    // ✅ Favori ekle/çıkar
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
            setFavorites(prev => isAlreadyFavorite ?
                prev.filter(fav => fav.id !== formattedProduct.id) :
                [...prev, formattedProduct]
            );

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

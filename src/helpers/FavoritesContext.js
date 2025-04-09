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
        axios.get("http://localhost:8080/api/users/me", { 
            withCredentials: true 
        })
        .then(res => {
            //console.log("Current user loaded:", res.data);
            setCurrentUser(res.data);
        })
        .catch(err => {
            console.error("Auth check failed", err);
            setCurrentUser(null);
        });
    };

    const loadFavorites = () => {
        setLoading(true);
        axios.get("http://localhost:8080/api/favorites", { 
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache'  
            }
        })
        .then(res => {
            console.log("Loaded favorites:", res.data);
    
           
            const mappedFavorites = res.data.map(product => ({
                id: product.id,
                name: product.productName, 
                price: formatPrice(product.price),
                image: getImageFromPath(product.imagePath),
                stock: product.stock,
                category: product.category
            }));
    
            setFavorites(mappedFavorites);
            setLoading(false);
        })
        .catch(err => {
            console.error("Favorites fetch error", err);
            setFavorites([]); 
            setLoading(false);
        });
    };
    
    
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Auth durumu değiştiğinde veya kullanıcı değiştiğinde favorileri yükle
    useEffect(() => {
        if (currentUser) {
            loadFavorites();
        } else {
            setFavorites([]); // No user, empty favorites
        }
    }, [currentUser]);

    const toggleFavorite = (product) => {
        if (!currentUser) {
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
    
            return;
        }
    
        axios.post(`http://localhost:8080/api/favorites/${product.id}`, {}, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            loadFavorites();
        })
        .catch(err => console.error("Favorite toggle error", err));
    };
    

    const isFavorite = (productId) => {
        return favorites.some(product => product.id === productId);
    };

    // Login ve logout işlemleri sonrası auth durumunu güncelle
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
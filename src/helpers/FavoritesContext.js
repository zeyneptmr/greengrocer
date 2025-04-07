import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Check authentication status and get current user
    const checkAuthStatus = () => {
        axios.get("http://localhost:8080/api/users/me", { 
            withCredentials: true 
        })
        .then(res => {
            console.log("Current user loaded:", res.data);
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
            setFavorites(res.data);
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
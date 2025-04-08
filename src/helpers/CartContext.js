import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [notification, setNotification] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [addedToCart, setAddedToCart] = useState(false);

    // Görselleri assets klasöründen al

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

    const showNotification = (message, type = "info") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const isUserLoggedIn = () => {
        return localStorage.getItem("loggedInUser") !== null;
    }

    const fetchCartFromBackend = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/cart", { withCredentials: true });
            const updatedCart = response.data.map(item => ({
                ...item,
                image: getImageFromPath(item.imagePath),
            }));
            setCart(updatedCart);

        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const addToCart = async (product, quantityToAdd = 1) => {
        if (isUserLoggedIn()) {
            try {
                await axios.post("http://localhost:8080/api/cart/add", null, {
                    params: {
                        productId: product.id,
                        quantity: quantityToAdd
                    },
                    withCredentials: true,
                });
                showNotification("Success! Item added to cart.", "success");
                fetchCartFromBackend();
            } catch (error) {
                console.error("Insufficient stock available!", error);
                showNotification("Insufficient stock available!", "warning");
            }
        } else {
            const existingItem = cart.find(item => item.id === product.id);
            let updatedCart;
            if (existingItem) {
                updatedCart = cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            } else {
                updatedCart = [...cart, { ...product, quantity: quantityToAdd }];
            }
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            showNotification("Success! Item added to cart!", "success");
        }
    };

    const increaseQuantity = async (cartItemId) => {
        if (isUserLoggedIn()) {
            try {
                await axios.patch(`http://localhost:8080/api/cart/increase/${cartItemId}`, null, { withCredentials: true });
                fetchCartFromBackend();
            } catch (error) {
                showNotification("Insufficient stock available!", "warning");
            }
        } else {
            const updatedCart = cart.map(item =>
                item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    const decreaseQuantity = async (cartItemId) => {
        if (isUserLoggedIn()) {
            try {
                await axios.patch(`http://localhost:8080/api/cart/decrease/${cartItemId}`, null, { withCredentials: true });
                fetchCartFromBackend();
            } catch (error) {
                console.error("Decrease quantity error:", error);
            }
        } else {
            const updatedCart = cart.map(item =>
                item.id === cartItemId
                    ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
                    : item
            );
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            const cartItem = updatedCart.find(item => item.id === cartItemId);
            if (cartItem?.quantity <= 1) {
                setAddedToCart(false);  // Add to Cart butonunu göster
            }
        }
    };

    const removeItem = async (cartItemId) => {
        if (isUserLoggedIn()) {
            try {
                await axios.delete(`http://localhost:8080/api/cart/remove/${cartItemId}`, { withCredentials: true });
                showNotification("Product deleted from cart!", "success");
                fetchCartFromBackend();
            } catch (error) {
                console.error("Remove item error:", error);
            }
        } else {
            const updatedCart = cart.filter(item => item.id !== cartItemId);
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    const clearCart = () => {
        cart.forEach(item => removeItem(item.id));
        showNotification("All products deleted from cart!", "info");
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const getTotalProductTypes = () => cart.length;

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.removeItem("cart");
            fetchCartFromBackend();
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(localCart);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser) {
            localStorage.removeItem("cart");
            fetchCartFromBackend();
        } else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(localCart);
        }
    }, [])

    useEffect(() => {
        const handleStorageChange = () => {
            const user = localStorage.getItem("loggedInUser");
            if (user) {
                localStorage.removeItem("cart");
                fetchCartFromBackend();
            } else {
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCart(localCart);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeItem,
            clearCart,
            calculateTotalPrice,
            getTotalProductTypes,
            isLoggedIn,
            setIsLoggedIn
        }}>
            {children}
            {notification && (
                <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut text-white text-sm font-medium flex items-center gap-2
                    ${notification.type === "success" ? "bg-green-600" :
                    notification.type === "warning" ? "bg-yellow-600" :
                        notification.type === "error" ? "bg-red-600" :
                            "bg-blue-600"}`}>
                    {notification.type === "success" && <span>✅</span>}
                    {notification.type === "warning" && <span>⚠️</span>}
                    {notification.type === "error" && <span>❌</span>}
                    {notification.type === "info" && <span>ℹ️</span>}
                    <span>{notification.message}</span>
                </div>
            )}
        </CartContext.Provider>
    );
}

const useCart = () => useContext(CartContext);

export { CartProvider, useCart, CartContext };
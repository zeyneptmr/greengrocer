import { createContext, useContext, useEffect, useState } from "react";
import { ProductStorage } from "../helpers/ProductStorage";

// Context
const CartContext = createContext();

export function CartProvider({ children }) {
    // Import Cart from Local Storage
    const getInitialCart = () => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    };

    const [cart, setCart] = useState(getInitialCart);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        console.log("Cart updated:", cart);
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const addToCart = (product, quantityToAdd = 1) => {
        const products = ProductStorage.getProducts();
        const productInStock = products.find((p) => p.id === product.id);

        if (productInStock) {
            if (quantityToAdd > productInStock.stock) {
                showNotification("Insufficient Stock Available!");
                return;
            }
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            let updatedCart;

            if (existingItem) {
                if (existingItem.quantity + quantityToAdd > productInStock.stock) {
                    showNotification("Insufficient Stock Available!");
                    return prevCart;
                }

                updatedCart = prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            } else {
                updatedCart = [...prevCart, { ...product, quantity: quantityToAdd }];
            }

            console.log("Cart after adding:", updatedCart);
            return updatedCart;
        });
    };

    const increaseQuantity = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) => {
                if (item.id === id) {
                    const productInStock = ProductStorage.getProducts().find((p) => p.id === item.id);
                    if (productInStock && item.quantity + 1 > productInStock.stock) {
                        showNotification("Insufficient Stock Available!");
                        return item;
                    }
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            console.log("Cart after increasing quantity:", updatedCart);
            return updatedCart;
        });
    };

    const decreaseQuantity = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((item) => {
                    if (item.id === id && item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0);

            console.log("Cart after decreasing quantity:", updatedCart);
            return updatedCart;
        });
    };

    const removeItem = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== id);
            console.log("Cart after removing item:", updatedCart);
            return updatedCart;
        });
    };

    const clearCart = () => {
        console.log("Cart cleared!");
        setCart([]);
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            let price = item.price.toString().replace('TL', '').replace(/\s/g, '').replace(',', '.');
            price = parseFloat(price) || 0;
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    const getTotalProductTypes = () => {
        return cart.length;
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, calculateTotalPrice, getTotalProductTypes }}>
            {children}
            {notification && (
                <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-6 py-2 rounded-lg shadow-lg animate-fadeInOut">
                    {notification}
                </div>
            )}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

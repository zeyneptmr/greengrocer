import { createContext, useContext, useEffect, useState } from "react";

// Context
const CartContext = createContext();

export function CartProvider({ children }) {
    // Import Cart from Local Storage
    const getInitialCart = () => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    };

    const [cart, setCart] = useState(getInitialCart);

    // Local Storage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const increaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    // Total cost
    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('TL', '').replace(',', '').trim());
            return total + price * item.quantity;
        }, 0).toFixed(2);
    };

    // Different type of Products
    const getTotalProductTypes = () => {
        return cart.length; // Benzersiz ürün sayısı
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, calculateTotalPrice, getTotalProductTypes }}>
            {children}
        </CartContext.Provider>
    );
}

// Special Hook
export function useCart() {
    return useContext(CartContext);
}

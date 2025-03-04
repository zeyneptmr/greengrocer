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

    // Local Storage - Güncelleme her değişiklikte tetikleniyor
    useEffect(() => {
        console.log("Cart updated:", cart);  // 👉 Güncellenmiş sepeti konsola yazdır
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            let updatedCart;

            if (existingItem) {
                updatedCart = prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = [...prevCart, { ...product, quantity: 1 }];
            }

            console.log("Cart after adding:", updatedCart);  // 👉 Sepet ekleme sonrası kontrol
            return updatedCart;
        });
    };

    const increaseQuantity = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
            console.log("Cart after increasing quantity:", updatedCart);
            return updatedCart;
        });
    };

    const decreaseQuantity = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
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

    // **🚀 Güncellenmiş Fiyat Hesaplama (TL'yi düzgün işle)**
    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            let price = item.price.toString().replace('TL', '').replace(/\s/g, '').replace(',', '.');
            price = parseFloat(price) || 0; // Eğer NaN olursa, 0 olarak kabul et
            return total + (price * item.quantity);
        }, 0).toFixed(2); // Ondalıklı format
    };

    const getTotalProductTypes = () => {
        return cart.length; // Number of different products
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart, calculateTotalPrice, getTotalProductTypes }}>
            {children}
        </CartContext.Provider>
    );
}

// Special Hook
export function useCart() {
    return useContext(CartContext);
}

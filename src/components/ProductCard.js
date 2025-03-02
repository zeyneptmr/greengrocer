import { useState } from "react";
import { Heart } from "lucide-react";
import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { Button } from "./Button";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "../pages/CartContext";

export default function ProductCard({ product }) {
    const { favorites, toggleFavorite } = useFavorites();
    const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

    const isFavorite = favorites.some((fav) => fav.id === product.id);

    // Sepette bu ürün var mı?
    const cartItem = cart.find((item) => item.id === product.id);

    return (
        <Card className="relative flex flex-col items-center">
            {/* Favorilere ekleme butonu */}
            <button
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
            >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>

            {/* Ürün Resmi */}
            <CardContent>
                <div className="w-44 h-44 flex items-center justify-center overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-cover"
                    />
                </div>

                {/* Ürün Adı */}
                <h3 className="mt-3 text-lg font-semibold text-gray-800 text-center break-words">{product.name}</h3>

                {/* Ürün Fiyatı */}
                <p className="text-gray-600 text-md mt-1">{product.price} TL</p>

                {/* Sepete ekleme ve miktar değiştirme */}
                {cartItem ? (
                    <div className="flex items-center space-x-3 mt-4">
                        <button
                            onClick={() => decreaseQuantity(product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md">
                            -
                        </button>
                        <span className="text-lg font-semibold">{cartItem.quantity}</span>
                        <button
                            onClick={() => increaseQuantity(product.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md">
                            +
                        </button>
                    </div>
                ) : (
                    <Button className="mt-4" onClick={() => addToCart(product)}>
                        Sepete Ekle
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

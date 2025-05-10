import { Heart } from "lucide-react";
import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { Button } from "./Button";
import { useFavorites } from "../helpers/FavoritesContext"
import { useCart } from "../helpers/CartContext";
import { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import axios from "axios";

export default function ProductCard({ product, hideCartView=false }) {
    const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
    const { favorites, toggleFavorite } = useFavorites();
    const [currentProduct, setCurrentProduct] = useState(product);
    const [addedToCart, setAddedToCart] = useState(false);

    const isFavorite = favorites.some((fav) => fav.id === currentProduct.id);
    const discountPercentage = currentProduct.discountRate;

    const { language } = useContext(LanguageContext);



    const cartItem = cart.find((item) => {
        return item.productId === currentProduct.id ||
            item.id === currentProduct.id ||
            item.product?.id === currentProduct.id;
    });


    const quantity = cartItem?.quantity || 0;
    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleIncreaseQuantity = () => {
        if (cartItem) {
            increaseQuantity(cartItem.id);
        }
    };

    const handleDecreaseQuantity = () => {
        if (cartItem?.quantity > 1) {
            decreaseQuantity(cartItem.id);
        } else if (cartItem?.quantity === 1) {
            
            decreaseQuantity(cartItem.id);
        }
    };

    return (
        <Card className="relative flex flex-col items-center">
            {/* Favorites Button */}
            <button
                onClick={() => toggleFavorite(currentProduct)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
            >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>

            {currentProduct.discountedPrice && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {discountPercentage}% {language === "tr" ? "İndirim" : "Off"}
                </div>
            )}

            {/* Product Image */}
            <CardContent>
                <div className="w-44 h-44 flex items-center justify-center overflow-hidden">
                    <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="max-w-full max-h-full object-cover transition-all duration-300 ease-in-out"
                    />
                </div>

                {/* Product Name */}
                <h3 className="mt-3 text-lg font-semibold text-gray-800 text-center break-words">{currentProduct.name}</h3>

                {/* Product Price and Quantity */}
                <div className="flex justify-center items-center mt-1">
                    {currentProduct.discountedPrice ? (
                        <p className="text-gray-600 text-md line-through mr-2">{currentProduct.price} TL</p>
                    ) : (
                        <p className="text-gray-600 text-md">{currentProduct.price} TL</p>
                    )}
                    {currentProduct.discountedPrice && (
                        <span className="text-green-600 font-bold">{currentProduct.discountedPrice} TL</span>
                    )}

                </div>

                {/* Add Cart Button, Increase, Decrease */}
                {!hideCartView && (
                    cartItem || addedToCart ? (
                        <div className="flex items-center space-x-3 mt-4 justify-center">
                            <button
                                onClick={handleDecreaseQuantity}
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                            >
                                -
                            </button>
                            <span className="text-lg font-semibold">{cartItem?.quantity || 1}</span>
                            <button
                                onClick={handleIncreaseQuantity}
                                className="bg-green-500 text-white px-3 py-1 rounded-md"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <Button className="mt-4 w-full md:w-auto" onClick={handleAddToCart}>
                            {language === "tr" ? "Sepete Ekle" : "Add to Cart"}
                        </Button>

                    )
                )}
            </CardContent>
        </Card>
    );
}
import { Heart } from "lucide-react";
import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { Button } from "./Button";
import { useFavorites } from "../helpers/FavoritesContext"
import { useCart } from "../helpers/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductCard({ product, hideCartView=false }) {
    const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
    const { favorites, toggleFavorite } = useFavorites();
    const [currentProduct, setCurrentProduct] = useState(product);
    const [addedToCart, setAddedToCart] = useState(false);

    const isFavorite = favorites.some((fav) => fav.id === currentProduct.id);
    const discountPercentage = currentProduct.discountRate;

    // Find cart item - check multiple possible ID mappings
    const cartItem = cart.find((item) => {
        return item.productId === currentProduct.id ||
            item.id === currentProduct.id ||
            item.product?.id === currentProduct.id;
    });

    // Fetch the latest product information on mount and when product prop changes
    useEffect(() => {
        const fetchLatestProductData = async () => {
            try {
                // If we have a productId (from the original product object), use that for fetching
                const productIdToFetch = product.productId || product.id;

                if (!productIdToFetch) return;

                const baseUrl = 'http://localhost:8080';
                const response = await axios.get(`{baseUrl}/api/products/${productIdToFetch}`, {
                    withCredentials: true,
                        headers: {
                        'Accept': 'application/json',
                            'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    // Update the current product with the latest data while preserving discount info
                    setCurrentProduct(prev => ({
                        ...prev,
                        // Update price if available in response (preserve structure based on your API response)
                        price: response.data.price || prev.price,
                        // Recalculate discountedPrice based on the most recent price and discount rate
                        discountedPrice: prev.discountRate ?
                            ((response.data.price || prev.price) * (1 - prev.discountRate/100)).toFixed(2) :
                            prev.discountedPrice
                    }));
                }
            } catch (err) {
                console.error('Error fetching latest product data:', err);
            }
        };

        fetchLatestProductData();

        // Update state if product prop changes
        setCurrentProduct(product);
    }, [product]);

    // Update addedToCart state when cart changes
    useEffect(() => {
        if (cartItem) setAddedToCart(true);
    }, [cartItem]);

    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = () => {
        addToCart(currentProduct);
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
                    15% Off
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

                    {/* Sales Quantity (Piece or KG) */}
                    {product.quantity && (
                        <span className="text-gray-500 text-sm ml-2">
                           {product.unit === 'kg' ? `${product.quantity} kg` : `${product.quantity} pieces`}
                        </span>
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
                            Add to Cart
                        </Button>
                    )
                )}
            </CardContent>
        </Card>
    );
}
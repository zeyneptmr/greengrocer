import { Heart } from "lucide-react";
import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { Button } from "./Button";
import { useFavorites } from "../helpers/FavoritesContext"
import { useCart } from "../helpers/CartContext";
import { useEffect, useState } from "react";

export default function ProductCard({ product, hideCartView=false }) {
    const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
    const { favorites, toggleFavorite } = useFavorites();

    const isFavorite = favorites.some((fav) => fav.id === product.id);

    const cartItem = cart.find((item) => {
        return item.productId === product.id || item.id === product.id || item.product?.id === product.id;
    });

    // Bu state, kullanıcı "Add to Cart" butonuna bastıysa geçici olarak ürün eklendi sayacağız
    const [addedToCart, setAddedToCart] = useState(false);

    // Eğer cart güncellendiyse ve ürün cart'taysa bu state'i güncelle
    useEffect(() => {
        console.log("Cart:", cart);

        if (cartItem) setAddedToCart(true);
    }, [cartItem]);



    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true); // hemen UI'da güncelle
    };

    return (
        <Card className="relative flex flex-col items-center">
            {/* Favorites Button */}
            <button
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
            >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>

            {product.discountedPrice && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    15% Off
                </div>
            )}

            {/* Product Image */}
            <CardContent>
                <div className="w-44 h-44 flex items-center justify-center overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-cover transition-all duration-300 ease-in-out"
                    />
                </div>

                {/* Product Name */}
                <h3 className="mt-3 text-lg font-semibold text-gray-800 text-center break-words">{product.name}</h3>

                {/* Product Price and Quantity */}
                <div className="flex justify-center items-center mt-1">
                    {product.discountedPrice ? (
                        <p className="text-gray-600 text-md line-through mr-2">{product.price} TL</p>
                    ) : (
                        <p className="text-gray-600 text-md">{product.price} TL</p>
                    )}
                    {product.discountedPrice && (
                        <span className="text-green-600 font-bold">{product.discountedPrice} TL</span>
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
                                onClick={() => decreaseQuantity(cartItem?.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                            >
                                -
                            </button>
                            <span className="text-lg font-semibold">{cartItem?.quantity || 1}</span>
                            <button
                                onClick={() => increaseQuantity(cartItem?.id)}
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
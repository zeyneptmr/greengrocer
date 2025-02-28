import { useState } from "react";
import { Heart } from "lucide-react";
import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { Button } from "./Button";

export default function ProductCard({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <Card className="relative flex flex-col items-center">
            {/* Favori Butonu */}
            <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
            >
                <Heart className={`h-6 w-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>

            {/* Ürün Görseli */}
            <CardContent>
                <img  //dinamik boyutlandırma
                    src={product.image}
                    alt={product.name}
                    className="max-w-[150px] max-h-[150px] w-auto h-auto object-contain rounded-lg"
                />

                {/* Ürün Adı */}
                <h3 className="mt-3 text-lg font-semibold text-gray-800 text-center break-words">{product.name}</h3>

                {/* Ürün Fiyatı */}
                <p className="text-gray-600 text-md mt-1">{product.price} TL</p>

                {/* Sepete Ekle Butonu */}
                <Button className="mt-4">Sepete Ekle</Button>
            </CardContent>
        </Card>
    );
}

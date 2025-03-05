import React from "react";
import { useParams } from "react-router-dom";
import products from "../data/products";  // Ürün verilerini içe aktar
import ProductCard from "../components/ProductCard";  // Kart bileşenini içe aktar

const ProductPage = () => {
    const { id } = useParams();  // URL'den ID'yi al
    const product = products.find((p) => p.id === parseInt(id));  // ID'ye göre ürünü bul

    if (!product) {
        return <h2 className="text-center text-red-500">Ürün bulunamadı!</h2>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                <ProductCard product={product} />
            </div>
        </div>
    );
};

export default ProductPage;


import React, { useState, useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import noResultsImage from '../assets/noresult.png';
import { LanguageContext } from "../context/LanguageContext";
import { getImageFromPath } from "../helpers/imageHelper";

const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        images[item.replace('./', '')] = r(item);
    });
    return images;
};

const formatPrice = (price) => {
    if (typeof price === "number") {
        return price.toFixed(2);
    }
    return parseFloat(price).toFixed(2);
};

const ProductPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");

    const { language } = useContext(LanguageContext);  

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}?language=${language}`); 
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, language]); 


    const loadingText = language === "tr" ? "Ürün yükleniyor..." : "Loading product...";
    const notFoundTitle = language === "tr"
        ? (query ? `"${query}" için sonuç bulunamadı :(` : "Ürün bulunamadı")
        : (query ? `We couldn't find any results for "${query}" :(` : "Product not found");

    const notFoundText = language === "tr"
        ? <>
            Lütfen kelimeyi doğru yazdığınızdan emin olun.<br/>
            Ürün adını kontrol edin veya tekrar aramayı deneyin.
        </>
        : <>
            Please make sure the word is spelled correctly.<br/>
            Please check the product name or try searching again.
        </>;

    const detailsTitle = language === "tr" ? "Ürün Detayları" : "Product Details";

    if (loading) {
        return (
            <div className="text-center p-6">
                <h2 className="text-2xl font-bold">{loadingText}</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center p-6">
                <h2 className="text-4xl mt-4">{notFoundTitle}</h2>
                <p className="mt-4 text-lg">{notFoundText}</p>
                <img
                    src={noResultsImage}
                    alt={language === "tr" ? "Ürün bulunamadı" : "Product not found"}
                    className="w-full sm:w-1/2 mx-auto object-cover mt-6"
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{detailsTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                <ProductCard
                    key={product.id} product={{
                    id: product.id,
                    name: product.translatedName || product.productName,  
                    price: formatPrice(product.price),
                    image: getImageFromPath(product.imagePath, images),
                    stock: product.stock,
                    category: product.category
                }}
                />
            </div>
        </div>
    );
};

export default ProductPage;

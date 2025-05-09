import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from "../components/ProductCard";
import { LanguageContext } from "../context/LanguageContext";
import { getImageFromPath } from "../helpers/imageHelper";
import { useContext } from "react";

const TodaysDiscountedProducts = ({ onProductsLoaded }) => {
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { language } = useContext(LanguageContext);

    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));

    const formatPrice = (price) => {
        if (typeof price === "number") {
            return price.toFixed(2);
        }
        return parseFloat(price).toFixed(2);
    };
    
    const fetchDiscountedProducts = async () => {
        try {
            setLoading(true);
            const baseUrl = 'http://localhost:8080';
            
            const response = await axios.get(`${baseUrl}/api/discountedProducts`, {
                params: { language },
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                console.log('İndirimli ürünler yüklendi:', response.data);
                console.log('İndirimli ürün sayısı:', response.data.length);
                
                setDiscountedProducts(response.data);
            
                if (onProductsLoaded) {
                    console.log('onProductsLoaded çağrılıyor, ürün var mı:', response.data.length > 0);
                    onProductsLoaded(response.data.length > 0);
                } else {
                    console.warn('onProductsLoaded fonksiyonu tanımlı değil!');
                }
            } else {
                throw new Error(`Server returned status code: ${response.status}`);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching discounted products:', err);
            setError(`Failed to fetch discounted products: ${err.message || err}`);
            setLoading(false);
        
            onProductsLoaded && onProductsLoaded(false);
        }
    };


    useEffect(() => {
        fetchDiscountedProducts();
        
        
        const intervalId = setInterval(() => {
            setRefreshTrigger(prev => prev + 1);
        }, 5 * 60 * 1000); 
        
        return () => clearInterval(intervalId);
    }, [language]);

    
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchDiscountedProducts();
        }
    }, [refreshTrigger]);

    if (loading) return <div className="text-center py-4">Loading discount offers...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
    if (discountedProducts.length === 0) return null; 

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {discountedProducts.map((item) => (
                <ProductCard 
                    key={`${item.id}-${item.product.id}-${refreshTrigger}`}
                    product={{
                        id: item.product.id,
                        name: item.product.translatedName || item.product.productName,
                        price: formatPrice(item.oldPrice),
                        discountedPrice: formatPrice(item.discountedPrice),
                        image: getImageFromPath(item.product.imagePath, images),
                        stock: item.product.stock,
                        category: item.product.category,
                        discountRate: item.discountRate,
                        productId: item.product.id
                    }}
                />
            ))}
        </div>
    );
};

export default TodaysDiscountedProducts;
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import noResultsImage from '../assets/noresult.png';

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
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const images = importAll(require.context('../assets', false, /\.(png|jpe?g|svg|webp)$/));
    
    const getImageFromPath = (path) => {
        if (!path) return null;
        
        // Get filename from path
        const filename = path.split('/').pop();
        
        // Find matching image from images object
        return images[filename] || '/placeholder.png';
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
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
    }, [id]);

    if (loading) {
        return (
            <div className="text-center p-6">
                <h2 className="text-2xl font-bold">Loading product...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center p-6">
                <h2 className="text-4xl mt-4">
                    {query ? `We couldn't find any results for "${query}" :(` : "Product not found"}
                </h2>
                <p className="mt-4 text-lg">
                    Please make sure the word is spelled correctly.
                    <br />
                    Please check the product name or try searching again.
                </p>
                <img
                    src={noResultsImage}
                    alt="Product not found"
                    className="w-full sm:w-1/2 mx-auto object-cover mt-6"
                />
            </div>
        );
    }
    

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                <ProductCard 
                    key={product.id} product={{
                    id: product.id,
                    name: product.productName,
                    price:formatPrice(product.price),
                    image: getImageFromPath(product.imagePath),
                    stock: product.stock,
                    category: product.category
                    }}
                />
            </div>
        </div>
    );
};

export default ProductPage;
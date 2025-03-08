import React from "react";
import { useParams } from "react-router-dom";
import { ProductStorage } from "../helpers/ProductStorage";
import ProductCard from "../components/ProductCard";
import noResultsImage from '../assets/noresult.png';

const ProductPage = () => {
    const { id } = useParams();  // URL'den ID'yi al
    const products = ProductStorage.getProducts();
    console.log(products);
    const product = products.find((p) => p.id === parseInt(id));
    const query = new URLSearchParams(window.location.search).get("query");

    if (!product) {
        return (
            <div className="text-center p-6">
                <h2 className="text-4xl mt-4">We couldn't find any results for "{query}" :(</h2>
                <p className="mt-4 text-lg">
                    Please make sure the word is spelled correctly.
                    <br />
                    Please check the product name or try searching again.
                </p>
                <img
                    src={noResultsImage}
                    alt="Product not found"
                    className="w-full sm:w-1/2 mx-auto object-cover mt-6"  // Ensure image is responsive
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
                <ProductCard product={product}/>
            </div>
        </div>
    );
};

export default ProductPage;

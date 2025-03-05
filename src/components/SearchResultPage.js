import React from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import noResultsImage from '../assets/noresult.png';

const SearchResults = () => {
    const location = useLocation();
    const results = location.state?.results || [];
    const query = new URLSearchParams(window.location.search).get("query");

    if (results.length === 0) {
        return (
            <div className="text-center p-6">

                <h2 className="text-4xl mt-4">We couldn't find any results for "{query}" :(</h2>
                <p className="mt-4 text-lg">
                    Please make sure the word is spelled correctly.
                    <br/>
                    Try searching with a different keyword.
                </p>

                <img
                    src={noResultsImage}
                    alt="Product not found"
                    className="w-1/10 mx-auto object-cover"  // Resmi daha küçük yapmak için genişlik sınıfı eklendi
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Search Results </h2>
            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                    {results.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default SearchResults;


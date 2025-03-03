import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const SearchResults = () => {
    const location = useLocation();
    const results = location.state?.results || [];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Search Results </h2>
            {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                    {results.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;


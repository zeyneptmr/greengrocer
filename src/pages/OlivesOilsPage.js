import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import FilterBar from "../components/FilterBar";

const OlivesOilsPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [OlivesOils, setOlivesOils] = useState(products.filter(product => product.category === "olivesoils"));

    useEffect(() => {
        let sortedArray = [...OlivesOils];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.name.localeCompare(a.name));
        }

        setOlivesOils(sortedArray);
    }, [sortOption]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Olives & Oils</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />
            <div className={`grid gap-4 ${columns === 4 ? "grid-cols-4" : "grid-cols-3"} justify-items-center`}>
                {OlivesOils.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default OlivesOilsPage;

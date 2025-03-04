import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import FilterBar from "../components/FilterBar";

const DairyPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [DairyProducts, setDairyProducts] = useState(products.filter(product => product.category === "dairy"));

    useEffect(() => {
        let sortedArray = [...DairyProducts];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.name.localeCompare(a.name));
        }

        setDairyProducts(sortedArray);
    }, [sortOption]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dairy</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />

            <div className={`grid gap-4 ${columns === 4 ? "grid-cols-4" : "grid-cols-3"} justify-items-center`}>
                {DairyProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default DairyPage;

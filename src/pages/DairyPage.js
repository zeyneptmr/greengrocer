import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import dairy1 from '../assets/dairy1.jpg';
import dairy2 from '../assets/dairy2.jpg';
import dairy3 from '../assets/dairy3.jpg';

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

    const slideItems = [
        { image: dairy1, name: "dairy1" },
        { image: dairy2, name: "dairy2" },
        { image: dairy3, name: "dairy3" },
    ];

    return (
        <div className="p-6">
            <SlideBar items={slideItems}/>
            <h2 className="text-4xl font-bold mb-4 text-orange-500">Dairy</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />

            <div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-items-center">
                {DairyProducts.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default DairyPage;

import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import olivesoils1 from '../assets/olivesoils1.jpg';
import olivesoils2 from '../assets/olivesoils2.jpg';

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

    const slideItems = [
        { image: olivesoils1, name: "olivesoils1" },
        { image: olivesoils2, name: "olivesoils2" },
    ];

    return (
        <div className="p-6">
            <SlideBar items={slideItems}/>
            <h2 className="text-4xl font-bold mb-4 text-orange-500">Olives & Oils </h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />
            <div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-items-center">
                {OlivesOils.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default OlivesOilsPage;

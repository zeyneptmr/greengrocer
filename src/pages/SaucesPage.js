import { useState, useEffect } from "react";
import { ProductStorage } from "../helpers/ProductStorage"; // ProductStorage'ı import et
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import sauces1 from '../assets/sauces1.jpg';
import sauces2 from '../assets/sauces2.jpg';

const SaucesPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [sauces, setSauces] = useState(ProductStorage.getProducts().filter(product => product.category.toLowerCase() === "sauces"));

    useEffect(() => {
        let sortedArray = [...sauces];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.name.localeCompare(a.name));
        }

        setSauces(sortedArray);
    }, [sortOption]); // sortOption değiştiğinde sıralama yapılır

    const slideItems = [
        { image: sauces1, name: "sauces1" },
        { image: sauces2, name: "sauces2" },
    ];

    return (
        <div className="p-6">
            <SlideBar items={slideItems} />
            <h2 className="text-4xl font-bold mb-4 text-orange-500">Sauces</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />

            <div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-items-center">
                {sauces.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SaucesPage;

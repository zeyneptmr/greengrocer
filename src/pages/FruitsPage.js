import { useState, useEffect } from "react";
import { ProductStorage } from "../helpers/ProductStorage"; // ProductStorage'ı import et
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import fruits1 from '../assets/fruits1.jpg';
import fruits2 from '../assets/fruits2.jpg';
import fruits3 from '../assets/fruits3.jpg';

const FruitsPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [fruits, setFruits] = useState(ProductStorage.getProducts().filter(product => product.category.toLowerCase() === "fruits"));

    useEffect(() => {
        let sortedArray = [...fruits];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFruits(sortedArray);
    }, [sortOption]);

    const slideItems = [
        { image: fruits1, name: "fruits1" },
        { image: fruits2, name: "fruits2" },
        { image: fruits3, name: "fruits3" },
    ];

    return (
        <div className="p-4 sm:p-6">
            <SlideBar items={slideItems}/>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-orange-500 text-center mt-10 sm:mt-16 md:mt-20">Fruits</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />
            <div className={`grid gap-4 
                ${columns === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"} 
                justify-items-center w-full`}>
                {fruits.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default FruitsPage;

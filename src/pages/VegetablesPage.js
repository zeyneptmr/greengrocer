import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import vegetables1 from '../assets/vegetables1.jpg';
import vegetables2 from '../assets/vegetables2.jpg';
import vegetables3 from '../assets/vegetables3.jpg';
import vegetables4 from '../assets/vegetables4.jpg';
import vegetables5 from '../assets/vegetables5.jpg';

const VegetablesPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [Vegetables, setVegetables] = useState(products.filter(product => product.category === "vegetables"));

    useEffect(() => {
        let sortedArray = [...Vegetables];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.name.localeCompare(a.name));
        }

        setVegetables(sortedArray);
    }, [sortOption]);

    const slideItems = [
        { image: vegetables1, name: "vegetables1" },
        { image: vegetables2, name: "vegetables2" },
        { image: vegetables3, name: "vegetables3" },
        { image: vegetables4, name: "vegetables4" },
        { image: vegetables5, name: "vegetables5" },
    ];

    return (
        <div className="p-6">
            <SlideBar items={slideItems}/>
            <h2 className="text-4xl font-bold mb-4 text-orange-500">Vegetables</h2>
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}
            />
            <div className={`grid gap-4 ${columns === 4 ? "grid-cols-4" : "grid-cols-3"} justify-items-center`}>
                {Vegetables.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default VegetablesPage;
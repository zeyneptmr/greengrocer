import { useState, useEffect } from "react";
import { ProductStorage } from "../helpers/ProductStorage"; // ProductStorage'ı import et
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import SlideBar from "../components/SliderBar";
import bakedgoods1 from '../assets/bakedgoods1.jpg.avif';
import bakedgoods2 from '../assets/bakedgoods2.jpg';
import bakedgoods3 from '../assets/bakedgoods3.jpg';

const BakedGoodsPage = () => {
    const [columns, setColumns] = useState(4);
    const [sortOption, setSortOption] = useState("default");
    const [bakedGoodsProducts, setBakedGoodsProducts] = useState(ProductStorage.getProducts().filter(product => product.category.toLowerCase() === "bakedgoods"));

    useEffect(() => {
        let sortedArray = [...bakedGoodsProducts];

        if (sortOption === "price-asc") {
            sortedArray.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            sortedArray.sort((a, b) => b.price - a.price);
        } else if (sortOption === "name-asc") {
            sortedArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "name-desc") {
            sortedArray.sort((a, b) => b.name.localeCompare(a.name));
        }

        setBakedGoodsProducts(sortedArray);
    }, [sortOption]); // sortOption değiştiğinde sıralama yapılır

    const slideItems = [
        { image: bakedgoods1, name: "bakedgoods1" },
        { image: bakedgoods2, name: "bakedgoods2" },
        { image: bakedgoods3, name: "bakedgoods3" },
    ];

    return (
        <div className="p-4 sm:p-6">
            <SlideBar items={slideItems}/>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-orange-500 text-center">Baked Goods</h2>
            <FilterBar columns={columns} setColumns={setColumns} setSortOption={setSortOption}/>
            <div className={`grid gap-4 
                ${columns === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"} 
                justify-items-center w-full`}>
                {bakedGoodsProducts.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default BakedGoodsPage;

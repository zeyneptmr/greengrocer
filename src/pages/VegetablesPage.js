import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import FilterBar from "../components/FilterBar"; // FilterBar'ı dahil ettik

const VegetablesPage = () => {
    const [columns, setColumns] = useState(4); // Varsayılan olarak 4'lü görünüm
    const [sortOption, setSortOption] = useState("default"); // Sıralama seçeneği
    const [Vegetables, setVegetables] = useState(products.filter(product => product.category === "vegetables"));

    // Sıralama işlemi
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
    }, [sortOption]); // sortOption değiştiğinde sıralama yapılır

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Vegetables</h2>

            {/* FilterBar component'i burada */}
            <FilterBar
                columns={columns}
                setColumns={setColumns}
                setSortOption={setSortOption}  // setSortOption'u FilterBar'a gönderiyoruz
            />

            {/* Ürünler Grid'i */}
            <div className={`grid gap-4 ${columns === 4 ? "grid-cols-4" : "grid-cols-3"} justify-items-center`}>
                {Vegetables.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default VegetablesPage;

import ProductCard from "../components/ProductCard";
import products from "../data/products";

const VegetablesPage = () => {
    const Vegetables = products.filter(product => product.category === "vegetables");

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Vegetables</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {Vegetables.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};


export default VegetablesPage;

import ProductCard from "../components/ProductCard";
import products from "../data/products";

const FruitsPage = () => {
    const Fruits = products.filter(product => product.category === "fruits");

    return (
        <div className="flex flex-col p-6 h-auto">
            <h2 className="text-2xl font-bold mb-4">Fruits</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {Fruits.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};


export default FruitsPage;

import ProductCard from "../components/ProductCard";
import products from "../data/products";

const SaucesPage = () => {
    const Sauces = products.filter(product => product.category === "sauces");

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sauces</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {Sauces.map((product, index) => (
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default SaucesPage;
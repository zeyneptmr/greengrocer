import ProductCard from "../components/ProductCard";
import products from "../data/products";

const BakedGoodsPage = () => {
    const BakedGoodsProducts = products.filter(product => product.category === "bakedgoods");

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Baked Goods</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {BakedGoodsProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default BakedGoodsPage;

import ProductCard from "../components/ProductCard";

const products = [
    { name: "Organik Portakal", price: "49,95", image: "/images/orange.jpg" },
    { name: "Organik Muz", price: "129,95", image: "/images/banana.jpg" },
];

const Home = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sizin İçin Seçtiklerimiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Home;

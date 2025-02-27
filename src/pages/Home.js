import ProductCard from "../components/ProductCard";
import orangeImg from '../assets/orange.jpg';
import bananaImg from "../assets/banana.jpg";
import grapesImg from "../assets/grapes.jpg";
import greenappleImg from "../assets/greenapple.jpg";
import redappleImg from "../assets/redapple.jpg";
import lemonImg from "../assets/lemon.jpg";
import pearImg from "../assets/pear.jpg";
import plumImg from "../assets/plum.jpg";
import strawberryImg from "../assets/strawberry.jpg";


const products = [
    { name: "Organik Portakal", price: "49,95", image: orangeImg },
    { name: "Organik Muz", price: "129,95", image: bananaImg },
    { name: "Organik Muz", price: "129,95", image: grapesImg },
    { name: "Organik Muz", price: "129,95", image: greenappleImg },
    { name: "Organik Muz", price: "129,95", image: redappleImg },
    { name: "Organik Muz", price: "129,95", image: lemonImg },
    { name: "Organik Muz", price: "129,95", image: pearImg },
    { name: "Organik Muz", price: "129,95", image: plumImg },
    { name: "Organik Muz", price: "129,95", image: strawberryImg },
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

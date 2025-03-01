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


const sauces = [
    { name: "Orange", price: "49,95", image: orangeImg },
    { name: "Banana", price: "129,95", image: bananaImg },
    { name: "Grapes", price: "129,95", image: grapesImg },
    { name: "Green apple", price: "129,95", image: greenappleImg },
    { name: "Red apple", price: "129,95", image: redappleImg },
    { name: "Lemon", price: "129,95", image: lemonImg },
    { name: "Pear", price: "129,95", image: pearImg },
    { name: "Plum", price: "129,95", image: plumImg },
    { name: "Strawberry", price: "129,95", image: strawberryImg },

];

const SaucesPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sauces</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {sauces.map((sauce, index) => (
                    <ProductCard key={index} product={sauce}/>
                ))}
            </div>
        </div>
    );
};

export default SaucesPage;

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


const fruits = [
    { name: "Orange", price: "55.00", image: orangeImg },
    { name: "Banana", price: "60.00", image: bananaImg },
    { name: "Grapes", price: "70.00", image: grapesImg },
    { name: "Green Apple", price: "50.00", image: greenappleImg },
    { name: "Red Apple", price: "50.00", image: redappleImg },
    { name: "Lemon", price: "35.00", image: lemonImg },
    { name: "Pear", price: "55.00", image: pearImg },
    { name: "Plum", price: "50.00", image: plumImg },
    { name: "Strawberry", price: "80.00", image: strawberryImg },
];

const FruitsPage = () => {
    return (
        <div className="flex flex-col p-6 h-auto">
            <h2 className="text-2xl font-bold mb-4">Fruits</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fruits.map((fruit, index) => (
                    <ProductCard key={index} product={fruit} />
                ))}
            </div>
        </div>
    );
};


export default FruitsPage;

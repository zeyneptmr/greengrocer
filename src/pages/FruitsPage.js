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
    { id: 59, name: "Orange", price: "55.00", image: orangeImg },
    { id: 60, name: "Banana", price: "60.00", image: bananaImg },
    { id: 61, name: "Grapes", price: "70.00", image: grapesImg },
    { id: 62, name: "Green Apple", price: "50.00", image: greenappleImg },
    { id: 63, name: "Red Apple", price: "50.00", image: redappleImg },
    { id: 64, name: "Lemon", price: "35.00", image: lemonImg },
    { id: 65, name: "Pear", price: "55.00", image: pearImg },
    { id: 66, name: "Plum", price: "50.00", image: plumImg },
    { id: 67, name: "Strawberry", price: "80.00", image: strawberryImg },
];

const FruitsPage = () => {
    return (
        <div className="flex flex-col p-6 h-auto">
            <h2 className="text-2xl font-bold mb-4">Fruits</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {fruits.map((fruit, index) => (
                    <ProductCard key={index} product={fruit} />
                ))}
            </div>
        </div>
    );
};


export default FruitsPage;

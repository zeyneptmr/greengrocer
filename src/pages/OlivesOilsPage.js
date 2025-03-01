import ProductCard from "../components/ProductCard";
import oliveoilImg from '../assets/oliveoil.jpg';
import oliveoiltinImg from "../assets/oliveoilTin.png";
import butterImg from "../assets/butter.jpg";
import sunfloweroilImg from "../assets/sunfloweroil.jpg";

const olives = [
    { name: "Olive Oil 1L", price: "255,95", image: oliveoilImg },
    { name: "Olive Oil Tin 5L", price: "799,95", image: oliveoiltinImg  },
    { name: "Sunflower Oil 1L", price: "129,95", image: sunfloweroilImg },
    { name: "Butter 1Kg", price: "575,95", image: butterImg },
];

const OlivesOilsPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Olives & Oils</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {olives.map((olive, index) => (
                    <ProductCard key={index} product={olive} />
                ))}
            </div>
        </div>
    );
};

export default OlivesOilsPage;


import ProductCard from "../components/ProductCard";
import walnutgoudacheeseImg from '../assets/walnutgoudacheese.jpg';
import twistcheeseImg from "../assets/twistcheese.jpg";
import tulumcheeseImg from "../assets/tulumcheese.jpg";
import TrakyaagedcheeseImg from "../assets/Trakyaagedcheese.jpg";
import stringcheeseImg from "../assets/stringcheese.jpg";
import plaitedcheeseImg from "../assets/plaitedcheese.jpg";
import milkImg from "../assets/milk.jpg";
import mihalicheeseImg from "../assets/mihaliccheese.jpg";
import kasharcheeseImg from "../assets/kasharcheese.jpg";
import KarsGruyereCheeseImg from "../assets/KarsGruyereCheese.jpg";
import herbycheeseImg from "../assets/herbycheese.jpg";
import goudacheesewithtruffleImg from "../assets/goudacheesewithtruffle.jpg";
import goudacheesewithpestoImg from "../assets/goudacheesewithredpesto.jpg";
import goatcheeseImg from "../assets/goatcheese.jpg";
import deliciouscheeseballsImg from "../assets/deliciouscheeseballs.jpg";
import cowfetacheeseImg from "../assets/cowfetacheese.jpg";


const fruits = [
    { name: "Milk 1L", price: "149,99", image: milkImg },
    { name: "Cow Feta Cheese Kg", price: "475,65", image: cowfetacheeseImg },
    { name: "Twist Cheese Kg", price: "350,55", image: twistcheeseImg },
    { name: "Tulum Cheese Kg", price: "420,95", image: tulumcheeseImg },
    { name: "Goat Cheese", price: "590,00", image: goatcheeseImg },
    { name: "Trakya Aged Cheese", price: "480,58", image: TrakyaagedcheeseImg },
    { name: "String Cheese", price: "379,75", image: stringcheeseImg },
    { name: "Plaited Cheese", price: "420,58", image: plaitedcheeseImg },
    { name: "Mihali Cheese", price: "550,00", image: mihalicheeseImg },
    { name: "Kashar Cheese", price: "470,00", image: kasharcheeseImg },
    { name: "Kars Gruyere Cheese", price: "600,00", image: KarsGruyereCheeseImg },
    { name: "Herby Cheese", price: "520,25", image: herbycheeseImg },
    { name: "Walnut Gouda Cheese Kg", price: "3.265,95 TL", image: walnutgoudacheeseImg },
    { name: "Gouda Cheese with Truffle", price: "750,00", image: goudacheesewithtruffleImg },
    { name: "Gouda Cheese with Pesto", price: "570,00", image: goudacheesewithpestoImg },
    { name: "Delicious Cheese Balls", price: "650,00", image: deliciouscheeseballsImg },

];

const DairyPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dairy</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fruits.map((dairy, index) => (
                    <ProductCard key={index} product={dairy} />
                ))}
            </div>
        </div>
    );
};

export default DairyPage;


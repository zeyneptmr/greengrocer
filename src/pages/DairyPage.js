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
import kefirImg from "../assets/kefir.png";
import sheepyogurtImg from "../assets/sheepyogurtt.jpg";
import waterbuffaloyogurtImg from "../assets/waterbuffaloyogurt.webp";
import goatyogurtImg from "../assets/goatyogurt.jpg";
import cowyogurtImg from "../assets/cowyogurt.jpg";


const dairy = [
    { id: 37, name: "Milk 1L", price: "149,99", image: milkImg },
    { id: 38, name: "Kefir 1L", price: "189,99", image: kefirImg },
    { id: 39, name: "Cow Feta Cheese Kg", price: "475,65", image: cowfetacheeseImg },
    { id: 40, name: "Twist Cheese Kg", price: "350,55", image: twistcheeseImg },
    { id: 41, name: "Tulum Cheese Kg", price: "420,95", image: tulumcheeseImg },
    { id: 42, name: "Goat Cheese Kg", price: "590,00", image: goatcheeseImg },
    { id: 43, name: "Trakya Aged Cheese Kg", price: "580,58", image: TrakyaagedcheeseImg },
    { id: 44, name: "Walnut Gouda Cheese Kg", price: "3.265,95 TL", image: walnutgoudacheeseImg },
    { id: 45, name: "Gouda Cheese with Truffle Kg", price: "750,00", image: goudacheesewithtruffleImg },
    { id: 46, name: "Gouda Cheese with Pesto Kg", price: "570,00", image: goudacheesewithpestoImg },
    { id: 47, name: "Delicious Cheese Balls Kg", price: "650,00", image: deliciouscheeseballsImg },
    { id: 48, name: "Sheep Yogurt Kg", price: "229,75", image: sheepyogurtImg },
    { id: 49, name: "Water Buffalo Yogurt Kg", price: "379,58", image: waterbuffaloyogurtImg },
    { id: 50, name: "Goat Yogurt Kg", price: "330,00", image: goatyogurtImg },
    { id: 51, name: "Cow Yogurt Kg", price: "135,00", image: cowyogurtImg },
    { id: 52, name: "Kars Gruyere Cheese Kg", price: "600,00", image: KarsGruyereCheeseImg },
    { id: 53, name: "String Cheese Kg", price: "379,75", image: stringcheeseImg },
    { id: 54, name: "Plaited Cheese Kg", price: "420,58", image: plaitedcheeseImg },
    { id: 55, name: "Mihali Cheese Kg", price: "550,00", image: mihalicheeseImg },
    { id: 56, name: "Kashar Cheese Kg", price: "470,00", image: kasharcheeseImg },
    { id: 57, name: "Kars Gruyere Cheese Kg", price: "600,00", image: KarsGruyereCheeseImg },
    { id: 58, name: "Herby Cheese Kg", price: "520,25", image: herbycheeseImg },
];


const DairyPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Dairy</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {dairy.map((dairy, index) => (
                    <ProductCard key={index} product={dairy} />
                ))}
            </div>
        </div>
    );
};

export default DairyPage;


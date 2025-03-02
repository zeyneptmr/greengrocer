import ProductCard from "../components/ProductCard";
import bagelImg from '../assets/bagel.jpg';
import breadImg from "../assets/bread.jpg";
import brownbreadImg from "../assets/brownbread.jpg";
import cakeImg from "../assets/cake.jpg";
import chocolatecakeImg from "../assets/chocolatecake.jpg";
import cornbreadImg from "../assets/cornbread.jpg";
import croissantImg from "../assets/croissant.jpg";
import daisybreadImg from "../assets/daisybread.jpg";
import gevrekImg from "../assets/gevrek.jpg";
import multigrainbreadImg from "../assets/multigrainbread.jpg";
import pastryImg from "../assets/pastry.jpg";
import pastrycheeseImg from "../assets/pastrycheese.jpg";
import pastryoliveImg from "../assets/pastryolive.jpg";
import pittabreadImg from "../assets/pittabread.jpg";
import sourdoughbreadImg from "../assets/sourdoughbread.jpg";
import springrollsImg from "../assets/springrolls.jpg";
import villagebreadImg from "../assets/villagebread.jpg";
import wholewheatbreadImg from "../assets/wholewheatbread.jpg";

const bakedgoods = [
    { id: 67, name: "Bread", price: "20.00", image: breadImg },
    { id: 68, name: "Daisy Bread", price: "30.00", image: daisybreadImg },
    { id: 69, name: "Corn Bread", price: "35.00", image: cornbreadImg },
    { id: 70, name: "Pitta Bread", price: "25.00", image: pittabreadImg },
    { id: 71, name: "Sourdough Bread", price: "40.00", image: sourdoughbreadImg },
    { id: 72, name: "Brown Bread", price: "30.00", image: brownbreadImg },
    { id: 73, name: "Multi-grain bread", price: "32.00", image: multigrainbreadImg },
    { id: 74, name: "Village Bread", price: "35.00", image: villagebreadImg },
    { id: 75, name: "Whole Wheat Bread", price: "32.00", image: wholewheatbreadImg },
    { id: 76, name: "Bagel", price: "20.00", image: bagelImg },
    { id: 77, name: "Gevrek", price: "22.00", image: gevrekImg },
    { id: 78, name: "Croissant", price: "25.00", image: croissantImg },
    { id: 79, name: "Pastry", price: "30.00", image: pastryImg },
    { id: 80, name: "Pastry with Cheese", price: "35.00", image: pastrycheeseImg },
    { id: 81, name: "Pastry with Olive", price: "35.00", image: pastryoliveImg },
    { id: 82, name: "Spring Rolls", price: "35.00", image: springrollsImg },
    { id: 83, name: "Cake", price: "50.00", image: cakeImg },
    { id: 84, name: "Chocolate Cake", price: "60.00", image: chocolatecakeImg },
];


const BakedGoodsPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Baked Goods</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {bakedgoods.map((bakedgood, index) => (
                    <ProductCard key={index} product={bakedgood} />
                ))}
            </div>
        </div>
    );
};

export default BakedGoodsPage;

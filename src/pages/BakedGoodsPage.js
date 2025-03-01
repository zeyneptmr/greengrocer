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
    { name: "Bread", price: "20.00", image: breadImg },
    { name: "Daisy Bread", price: "30.00", image: daisybreadImg },
    { name: "Corn Bread", price: "35.00", image: cornbreadImg },
    { name: "Pitta Bread", price: "25.00", image: pittabreadImg },
    { name: "Sourdough Bread", price: "40.00", image: sourdoughbreadImg },
    { name: "Brown Bread", price: "30.00", image: brownbreadImg },
    { name: "Multi-grain bread", price: "32.00", image: multigrainbreadImg },
    { name: "Village Bread", price: "35.00", image: villagebreadImg },
    { name: "Whole Wheat Bread", price: "32.00", image: wholewheatbreadImg },
    { name: "Bagel", price: "20.00", image: bagelImg },
    { name: "Gevrek", price: "22.00", image: gevrekImg },
    { name: "Croissant", price: "25.00", image: croissantImg },
    { name: "Pastry", price: "30.00", image: pastryImg },
    { name: "Pastry with Cheese", price: "35.00", image: pastrycheeseImg },
    { name: "Pastry with Olive", price: "35.00", image: pastryoliveImg },
    { name: "Spring Rolls", price: "35.00", image: springrollsImg },
    { name: "Cake", price: "50.00", image: cakeImg },
    { name: "Chocolate Cake", price: "60.00", image: chocolatecakeImg },
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

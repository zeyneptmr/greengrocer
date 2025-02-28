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
    { name: "Bread", price: "129,95", image: breadImg },
    { name: "Daisy Bread", price: "129,95", image: daisybreadImg },
    { name: "Corn Bread", price: "129,95", image: cornbreadImg },
    { name: "Pitta Bread", price: "129,95", image: pittabreadImg },
    { name: "Sourdough Bread", price: "129,95", image: sourdoughbreadImg },
    { name: "Brown Bread", price: "129,95", image: brownbreadImg },
    { name: "Multi-grain bread", price: "129,95", image:multigrainbreadImg },
    { name: "Village Bread", price: "129,95", image: villagebreadImg},
    { name: "Whole Wheat Bread", price: "129,95", image: wholewheatbreadImg },
    { name: "Bagel", price: "129,95", image: bagelImg },
    { name: "Gevrek", price: "129,95", image: gevrekImg },
    { name: "Croissant", price: "129,95", image: croissantImg },
    { name: "Pastry", price: "129,95", image: pastryImg },
    { name: "Pastry with Cheese", price: "129,95", image: pastrycheeseImg },
    { name: "Pastry with Olive", price: "129,95", image: pastryoliveImg },
    { name: "Spring Rolls", price: "129,95", image: springrollsImg},
    { name: "Cake", price: "129,95", image: cakeImg },
    { name: "Chocolate Cake", price: "129,95", image: chocolatecakeImg },

];

const BakedGoodsPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Baked Goods</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bakedgoods.map((bakedgood, index) => (
                    <ProductCard key={index} product={bakedgood} />
                ))}
            </div>
        </div>
    );
};

export default BakedGoodsPage;

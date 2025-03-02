import ProductCard from "../components/ProductCard";
import arugulaImg from "../assets/arugula.jpg";
import bellpepperImg from "../assets/bellpepper.jpg";
import broccoliImg from "../assets/broccoli.jpg";
import capiapepperImg from "../assets/capiapepper.jpg";
import carrotImg from "../assets/carrot.jpg";
import cauliflowerImg from "../assets/cauliflower.jpg";
import celeryImg from "../assets/celery.jpg";
import cherrytomatoImg from "../assets/cherrytomato.jpg";
import cucumberImg from "../assets/cucumber.jpg";
import curlyletuceImg from "../assets/curlyletuce.jpg";
import eggplantImg from "../assets/eggplant.jpg";
import freshmintImg from "../assets/freshmint.jpg";
import garlicImg from "../assets/garlic.jpg";
import greenbeanImg from "../assets/greenbean.jpg";
import greenpepperImg from "../assets/greenpepper.jpg";
import iceberglettuceImg from "../assets/iceberglettuce.jpg";
import kaleImg from "../assets/kale.jpg";
import mushroomImg from "../assets/mushroom.jpg";
import onionImg from "../assets/onion.jpg";
import parsleyImg from "../assets/parsley.jpg";
import pepperImg from "../assets/pepper.jpg";
import potatoImg from "../assets/potato.jpg";
import pumpkinImg from "../assets/pumpkin.jpg";
import radishImg from "../assets/radish.jpg";
import redcabbageImg from "../assets/redcabbage.jpg";
import redonionImg from "../assets/redonion.jpg";
import redpepperImg from "../assets/redpepper.jpg";
import avocadoImg from "../assets/avocado.jpg";
import scallionImg from "../assets/scallion.jpg";
import sweetpepperImg from "../assets/sweetpepper.jpg";
import tomatoImg from "../assets/tomato.jpg";
import zucchiniImg from "../assets/zucchini.jpg";

const vegetables = [
    { id: 1, name: "Avocado", price: "85.00", image: avocadoImg },
    { id: 2, name: "Arugula", price: "40.00", image: arugulaImg },
    { id: 3, name: "Tomatoes", price: "30.00", image: tomatoImg },
    { id: 4, name: "Cucumber", price: "20.00", image: cucumberImg },
    { id: 5, name: "Potatoes", price: "15.00", image: potatoImg },
    { id: 6, name: "Onion", price: "18.00", image: onionImg },
    { id: 7, name: "Carrot", price: "18.00", image: carrotImg },
    { id: 8, name: "Zucchini", price: "25.00", image: zucchiniImg },
    { id: 9, name: "Pumpkin", price: "25.00", image: pumpkinImg  },
    { id: 10, name: "Bell Pepper", price: "30.00", image: bellpepperImg  },
    { id: 11, name: "Broccoli", price: "35.00", image: broccoliImg  },
    { id: 12, name: "Capia Pepper", price: "40.00", image: capiapepperImg },
    { id: 13, name: "Pepper", price: "35.00", image: pepperImg },
    { id: 14, name: "Green Pepper", price: "25.00", image: greenpepperImg },
    { id: 15, name: "Sweet Pepper", price: "35.00", image: sweetpepperImg },
    { id: 16, name: "Cherry Tomato", price: "35.00", image: cherrytomatoImg },
    { id: 17, name: "Celery", price: "25.00", image: celeryImg },
    { id: 18, name: "Cauliflower", price: "35.00", image: cauliflowerImg },
    { id: 19, name: "Iceberg Lettuce", price: "20.00", image: iceberglettuceImg },
    { id: 20, name: "Curly Lettuce", price: "25.00", image: curlyletuceImg },
    { id: 21, name: "Mushroom", price: "40.00", image: mushroomImg },
    { id: 22, name: "Garlic", price: "30.00", image: garlicImg },
    { id: 23, name: "Red Onion", price: "20.00", image: redonionImg },
    { id: 24, name: "Red Pepper", price: "35.00", image: redpepperImg },
    { id: 25, name: "Eggplant", price: "30.00", image: eggplantImg },
    { id: 26, name: "Fresh Mint", price: "20.00", image: freshmintImg },
    { id: 27, name: "Green Bean", price: "30.00", image: greenbeanImg },
    { id: 28, name: "Kale", price: "35.00", image: kaleImg },
    { id: 29, name: "Parsley", price: "15.00", image: parsleyImg },
    { id: 30, name: "Radish", price: "20.00", image: radishImg },
    { id: 31, name: "Red Cabbage", price: "30.00", image: redcabbageImg },
    { id: 32, name: "Scallion", price: "15.00", image: scallionImg },
];


const VegetablesPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Vegetables</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                {vegetables.map((vegetable, index) => (
                    <ProductCard key={index} product={vegetable} />
                ))}
            </div>
        </div>
    );
};


export default VegetablesPage;

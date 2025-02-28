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
    { name: "Avocado", price: "85.00", image: avocadoImg },
    { name: "Arugula", price: "40.00", image: arugulaImg },
    { name: "Tomatoes", price: "30.00", image: tomatoImg },
    { name: "Cucumber", price: "20.00", image: cucumberImg },
    { name: "Potatoes", price: "15.00", image: potatoImg },
    { name: "Onion", price: "18.00", image: onionImg },
    { name: "Carrot", price: "18.00", image: carrotImg },
    { name: "Zucchini", price: "25.00", image: zucchiniImg },
    { name: "Pumpkin", price: "25.00", image: pumpkinImg  },
    { name: "Bell Pepper", price: "30.00", image: bellpepperImg  },
    { name: "Broccoli", price: "35.00", image: broccoliImg  },
    { name: "Capia Pepper", price: "40.00", image: capiapepperImg },
    { name: "Pepper", price: "35.00", image: pepperImg },
    { name: "Green Pepper", price: "25.00", image: greenpepperImg },
    { name: "Sweet Pepper", price: "35.00", image: sweetpepperImg },
    { name: "Cherry Tomato", price: "35.00", image: cherrytomatoImg },
    { name: "Celery", price: "25.00", image: celeryImg },
    { name: "Cauliflower", price: "35.00", image: cauliflowerImg },
    { name: "Iceberg Lettuce", price: "20.00", image: iceberglettuceImg },
    { name: "Curly Lettuce", price: "25.00", image: curlyletuceImg },
    { name: "Mushroom", price: "40.00", image: mushroomImg },
    { name: "Garlic", price: "30.00", image: garlicImg },
    { name: "Red Onion", price: "20.00", image: redonionImg },
    { name: "Red Pepper", price: "35.00", image: redpepperImg },
    { name: "Eggplant", price: "30.00", image: eggplantImg },
    { name: "Fresh Mint", price: "20.00", image: freshmintImg },
    { name: "Green Bean", price: "30.00", image: greenbeanImg },
    { name: "Kale", price: "35.00", image: kaleImg },
    { name: "Parsley", price: "15.00", image: parsleyImg },
    { name: "Radish", price: "20.00", image: radishImg },
    { name: "Red Cabbage", price: "30.00", image: redcabbageImg },
    { name: "Scallion", price: "15.00", image: scallionImg },
];

const VegetablesPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Vegetables</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {vegetables.map((vegetable, index) => (
                    <ProductCard key={index} product={vegetable} />
                ))}
            </div>
        </div>
    );
};

export default VegetablesPage;

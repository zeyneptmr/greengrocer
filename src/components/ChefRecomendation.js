import { useState, useEffect } from "react";
import chefImage from "../assets/chef.jpg";
import { useTranslation } from "react-i18next";
import recipes from "../data/Recipes";

export default function ChefRecommendationModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [meal, setMeal] = useState(null);
    const [mood, setMood] = useState(null);
    const [showRecipe, setShowRecipe] = useState(false);

    const { t } = useTranslation(["mychef", "recipes"]);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setMeal(null);
            setMood(null);
            setShowRecipe(false);
        }
    }, [isOpen]);

    const meals = [
        { name: t("meals.breakfast"), icon: "🔍", value: "Breakfast" },
        { name: t("meals.salad"), icon: "🥗", value: "Salad" },
        { name: t("meals.soup"), icon: "🍜", value: "Soup" },
        { name: t("meals.mainCourse"), icon: "🍛", value: "Main Course" },
        { name: t("meals.desserts"), icon: "🧁", value: "Desserts" },
    ];

    const moods = [
        { name: t("moods.light"), value: "LIGHT", icon: "🥑 " },
        { name: t("moods.feast"), value: "FEAST", icon: "🍔 " },
        { name: t("moods.practical"), value: "PRACTICAL", icon: "🍜 " },
        { name: t("moods.surprise"), value: "SURPRISE", icon: "🍽️ " },
    ];

    const filteredRecipes = recipes.filter(recipe => {
        return recipe.category === meal && recipe.mood === mood;
    });

    if (showRecipe) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl w-96 shadow-lg relative text-gray-800">
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl" onClick={onClose}>✖</button>

                    <h2 className="text-2xl font-extrabold text-center mb-4 text-orange-600 flex items-center justify-center">
                        {t("recipeTitle")}
                    </h2>

                    {filteredRecipes.length === 0 ? (
                        <p className="text-center text-lg text-gray-500">{t("noRecipe")}</p>
                    ) : (
                        filteredRecipes.map(recipe => (
                            <div key={recipe.id} className="mb-4 text-center">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                                    {t(recipe.nameKey, { ns: "recipes" })}
                                </h3>

                                <h4 className="mt-4 text-lg font-semibold text-gray-700">{t("ingredients")}</h4>
                                <ul className="list-disc list-inside text-gray-600 text-md mt-1">
                                    {recipe.ingredientsKeys.map((key, index) => (
                                        <li key={index}>{t(key, { ns: "recipes" })}</li>
                                    ))}
                                </ul>

                                <h4 className="mt-4 text-lg font-semibold text-gray-700">{t("preparation")}</h4>
                                <p className="text-md text-gray-600 leading-relaxed mt-1">
                                    {t(recipe.preparationKey, { ns: "recipes" })}
                                </p>
                            </div>
                        ))
                    )}

                    <button onClick={() => setShowRecipe(false)}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-lg py-3 px-6 rounded-xl mt-6 w-full transition-all">
                        {t("goBack")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}>
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>

                <div className="flex justify-between mb-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 flex-1 mx-1 rounded-full ${step >= s ? "bg-orange-500" : "bg-gray-300"}`}></div>
                    ))}
                </div>

                <div className="flex items-start mb-4">
                    <img src={chefImage} alt="Şef" className="w-16 h-16 rounded-full" />
                    <div className="bg-gray-100 p-3 rounded-lg ml-3 max-w-xs">
                        {step === 1 && <p>{t("chefIntro1")}</p>}
                        {step === 2 && <p>{t("chefIntro2")}</p>}
                    </div>
                </div>

                {step === 1 && (
                    <div>
                        {meals.map((m) => (
                            <button
                                key={m.name}
                                onClick={() => setMeal(m.value)}
                                className={`flex items-center p-2 border rounded-lg w-full mb-2 ${meal === m.value ? "bg-green-500 text-white" : "bg-white text-black border-gray-300"}`}
                            >
                                {m.icon} <span>{m.name}</span>
                            </button>
                        ))}
                        <button
                            disabled={!meal}
                            onClick={() => setStep(2)}
                            className={`w-full py-2 rounded-lg mt-4 ${meal ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                            {t("continue")}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        {moods.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setMood(m.value)}
                                className={`flex items-center p-2 border rounded-lg w-full mb-2 ${mood === m.value ? "bg-green-500 text-white" : "bg-white text-black border-gray-300"}`}
                            >
                                {m.icon} <span>{m.name}</span>
                            </button>
                        ))}
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(1)}
                                    className="bg-gray-300 text-black py-2 px-4 rounded-lg flex items-center">{t("backToMood")}
                            </button>
                            <button
                                disabled={!mood}
                                onClick={() => setShowRecipe(true)}
                                className={`py-2 px-4 rounded-lg ${mood ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            >
                                {t("showRecipe")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

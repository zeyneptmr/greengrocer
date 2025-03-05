const recipes = [
    {
        id: 1,
        name: "Honey Cottage Cheese Breakfast on Village Bread",
        category: "Breakfast",
        mood: "LIGHT",
        ingredients: [
            "Village bread (thick slices)",
            "Cottage cheese",
            "Walnuts",
            "Honey"
        ],
        preparation: "Lightly toast the village bread. Sprinkle cottage cheese on top, add walnuts, and drizzle with honey before serving.",
    },
    {
        id: 2,
        name: "Whole Wheat Jam & Cheese Toast",
        category: "Breakfast",
        mood: "FEAST",
        ingredients: [
            "Whole wheat bread",
            "Cheddar cheese",
            "Cherry jam"
        ],
        preparation: "Place cheddar cheese and cherry jam between the slices of bread. Toast in a sandwich maker and serve hot.",
    },
    {
        id: 3,
        name: "Avocado & White Cheese Sandwich (on Ancient Wheat Bread)",
        category: "Breakfast",
        mood: "PRACTICAL",
        ingredients: [
            "Ancient wheat bread",
            "Avocado",
            "White cheese",
            "Lemon juice",
            "Black pepper"
        ],
        preparation: "Mash the avocado and mix with lemon juice and black pepper. Spread it on the ancient wheat bread, add white cheese, and assemble the sandwich.",
    },
    {
        id: 4,
        name: "Cheese & Roasted Vegetable Open Sandwich",
        category: "Breakfast",
        mood: "SURPRISE",
        ingredients: [
            "Sourdough bread",
            "Tulum cheese",
            "Roasted red bell pepper",
            "Roasted eggplant",
            "Olive oil"
        ],
        preparation: "Place tulum cheese on the bread, then add roasted bell pepper and eggplant. Drizzle with olive oil and serve.",
    },
    {
        id: 5,
        name: "Fermented Green Salad",
        category: "Salad",
        mood: "LIGHT",
        ingredients: [
            "Mixed greens",
            "Pickled gherkins (chopped)",
            "Pickled red bell pepper (cut into strips)",
            "White cheese (cut into small cubes)",
            "Lemon juice & olive oil"
        ],
        preparation: "Place mixed greens in a bowl. Add chopped pickles and white cheese. Season with lemon juice and olive oil, then mix well.",
    },
    {
        id: 6,
        name: "Tangy Sweet Beetroot Salad",
        category: "Salad",
        mood: "FEAST",
        ingredients: [
            "Boiled beetroot (cubed)",
            "Pickled carrot (grated)",
            "Apple slices",
            "Walnuts",
            "Cottage cheese",
            "Pomegranate molasses & olive oil"
        ],
        preparation: "Mix the boiled beetroot, grated pickled carrot, and apple slices. Add walnuts and cottage cheese. Season with pomegranate molasses and olive oil, then toss.",
    },
    {
        id: 7,
        name: "Colorful Grilled Bell Pepper Salad",
        category: "Salad",
        mood: "PRACTICAL",
        ingredients: [
            "Grilled red bell pepper pickle (cut into strips)",
            "Pickled green bell pepper (thinly sliced)",
            "Fresh onion (chopped)",
            "Corn",
            "Feta cheese (crumbled)",
            "Olive oil & vinegar"
        ],
        preparation: "Place grilled and pickled bell peppers in a bowl. Add fresh onion and corn. Crumble feta cheese on top. Season with olive oil and vinegar, and mix thoroughly.",
    },
    {
        id: 8,
        name: "Pickled Avocado Salad",
        category: "Salad",
        mood: "SURPRISE",
        ingredients: [
            "Avocado (sliced)",
            "Pickled cucumber (chopped)",
            "Red onion (thinly sliced)",
            "Dill",
            "Goat cheese (crumbled)",
            "Lemon juice & olive oil"
        ],
        preparation: "Place sliced avocado on a plate. Add chopped pickled cucumber and red onion. Sprinkle with dill and crumbled goat cheese. Season with lemon juice and olive oil.",
    },
    {
        id: 9,
        name: "Baked Pumpkin Soup",
        category: "Soup",
        mood: "LIGHT",
        ingredients: [
            "Pumpkin (cubed)",
            "Onion (chopped)",
            "Garlic (crushed)",
            "Olive oil",
            "Milk",
            "Vegetable broth",
            "Black pepper"
        ],
        preparation: "Roast the pumpkin in the oven until soft. Sauté onion and garlic in olive oil, then add the roasted pumpkin and vegetable broth. Blend it and add milk, then mix.",
    },
    {
        id: 10,
        name: "Leek and Potato Soup",
        category: "Soup",
        mood: "FEAST",
        ingredients: [
            "Leek (chopped)",
            "Potato (cubed)",
            "Onion (chopped)",
            "Olive oil",
            "Milk",
            "Vegetable broth",
            "White cheese (for topping)"
        ],
        preparation: "Sauté leek, onion, and potato in olive oil. Add vegetable broth and simmer. Blend it, add milk, and mix. Top with crumbled white cheese before serving.",
    },
    {
        id: 11,
        name: "Grilled Eggplant Yogurt Soup",
        category: "Soup",
        mood: "PRACTICAL",
        ingredients: [
            "Grilled eggplant (chopped)",
            "Yogurt",
            "Chickpeas (cooked)",
            "Dill",
            "Garlic (crushed)",
            "Olive oil",
            "Vegetable broth"
        ],
        preparation: "Mix yogurt, garlic, and vegetable broth. Add grilled eggplant and chickpeas, then stir. Drizzle with olive oil and garnish with dill. Serve chilled.",
    },
    {
        id: 12,
        name: "Swiss Chard and Cottage Cheese Soup",
        category: "Soup",
        mood: "SURPRISE",
        ingredients: [
            "Swiss chard (chopped)",
            "Cottage cheese",
            "Onion (chopped)",
            "Garlic (crushed)",
            "Olive oil",
            "Vegetable broth",
            "Black pepper"
        ],
        preparation: "Sauté onion and garlic, then add swiss chard and cook for a few minutes. Add vegetable broth and simmer. Top with cottage cheese before serving hot.",
    },

    {
        id: 13,
        name: "Grilled Vegetable & Cheese Sandwich (on Whole Wheat Bread)",
        category: "Main Course",
        mood: "LIGHT",
        ingredients: [
            "Whole wheat bread",
            "Grilled zucchini, eggplant, and red bell pepper",
            "White cheese",
            "Olive oil",
            "Oregano"
        ],
        preparation: "Grill the bread until lightly toasted. Place grilled vegetables and white cheese between the slices. Add oregano and drizzle with olive oil before serving.",
    },
    {
        id: 14,
        name: "Rich Stuffed Whole Wheat Sandwich",
        category: "Main Course",
        mood: "FEAST",
        ingredients: [
            "Whole wheat bread",
            "Grilled halloumi cheese",
            "Grilled eggplant",
            "Caramelized onions",
            "Lettuce",
            "Tomato slices",
            "Mustard yogurt sauce"
        ],
        preparation: "Layer halloumi cheese, grilled eggplant, caramelized onions, lettuce, and tomato in whole wheat bread. Drizzle with mustard yogurt sauce and serve either warm or cold.",
    },
    {
        id: 15,
        name: "Baked Cheese & Vegetable Village Bread Bowl",
        category: "Main Course",
        mood: "PRACTICAL",
        ingredients: [
            "Village bread (cut open and lightly hollowed out)",
            "Cottage cheese or white cheese",
            "Grated cheddar cheese",
            "Spinach",
            "Roasted yellow bell pepper",
            "Olive oil",
            "Black pepper",
            "Red pepper flakes"
        ],
        preparation: "Mix cottage cheese, cheddar cheese, chopped spinach, and roasted yellow bell pepper inside the village bread. Drizzle with olive oil, season with black pepper and red pepper flakes, then bake at 180°C for 10-12 minutes and serve warm.",
    },
    {
        id: 16,
        name: "Baked Cottage Cheese Cauliflower Gratin",
        category: "Main Course",
        mood: "SURPRISE",
        ingredients: [
            "Cauliflower",
            "Cottage cheese",
            "Yogurt",
            "Egg",
            "Mustard",
            "Black pepper",
            "Oregano"
        ],
        preparation: "Boil the cauliflower and place it in a baking dish. Pour the mixture of cottage cheese, yogurt, egg, and mustard over it. Season with black pepper and oregano, then bake until golden brown.",
    },
    {
        id: 17,
        name: "Baked Pear & Cherry Jam Dessert",
        category: "Desserts",
        mood: "LIGHT",
        ingredients: [
            "Sourdough bread slices",
            "Baked pear slices",
            "Cherry jam",
            "Tulum cheese",
            "Crushed hazelnuts"
        ],
        preparation: "Heat the sourdough bread. Spread tulum cheese on it, add baked pear slices, then top with cherry jam and crushed hazelnuts.",
    },
    {
        id: 18,
        name: "Fermented Fruit & Yogurt Dessert Bowl",
        category: "Desserts",
        mood: "FEAST",
        ingredients: [
            "Homemade yogurt",
            "Apple & pear slices",
            "Fig jam",
            "Honey",
            "Walnuts",
            "Cinnamon"
        ],
        preparation: "Put yogurt in a bowl. Add fermented apple and pear slices on top. Drizzle with honey, sprinkle with walnuts, and garnish with cinnamon.",
    },
    {
        id: 19,
        name: "Pomegranate & Cottage Cheese Dessert",
        category: "Desserts",
        mood: "PRACTICAL",
        ingredients: [
            "Cottage cheese",
            "Pomegranate seeds",
            "Quince jam",
            "Plums",
            "Kefir"
        ],
        preparation: "Place cottage cheese in a bowl. Add pomegranate seeds and quince jam. Serve with plums and kefir on the side.",
    },
    {
        id: 20,
        name: "Milky & Hazelnut Plum Jam Toast",
        category: "Desserts",
        mood: "SURPRISE",
        ingredients: [
            "Whole wheat bread slices",
            "Milk",
            "White cheese",
            "Strawberry jam"
        ],
        preparation: "Soak the whole wheat bread in milk until it softens. Spread white cheese on top, add strawberry jam, and serve as a sweet snack.",
    }
];

export default recipes;


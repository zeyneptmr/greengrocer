/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                //'oleo': ['Oleo Script', 'cursive'],
            },
            colors: {
                // Yeşil tonları
                'green-light': '#A3E4D7',   // Açık yeşil
                'green-base': '#2ECC71',    // Orta yeşil
                'green-dark': '#27AE60',    // Koyu yeşil
                'green-darker': '#1D8348',  // Daha koyu yeşil
                'green-forest': '#1B5E20',  // Orman yeşili
                'green-moss': '#4CAF50',    // Sulu yeşil
                'green-lime': '#8BC34A',    // Limon yeşili

                // Turuncu tonları
                'orange-light': '#FFB74D',  // Açık turuncu
                'orange-base': '#FF9800',   // Orta turuncu
                'orange-dark': '#F57C00',   // Koyu turuncu
                'orange-darker': '#E65100', // Daha koyu turuncu
                'orange-peach': '#FF7043',  // Şeftali turuncu
                'orange-amber': '#FF6F00',  // Amber turuncusu
                'orange-tangerine': '#FF5722', // Mandalina turuncusu
            },
        },
    },
    plugins: [],
};

import ProductStorage from '../helpers/ProductStorage';

export const getDiscountedProducts = () => {
    const storedDate = localStorage.getItem("discountDate");
    const today = new Date().toDateString();

    // If discounted products and date already exist, use them
    if (storedDate === today) {
        const storedProducts = JSON.parse(localStorage.getItem("discountedProducts"));
        if (storedProducts) return storedProducts;
    }

    // If products have not been saved to localStorage before, save them
    ProductStorage.initializeProducts();

    // Shuffle the products and select the first 10
    const shuffled = ProductStorage.getProducts().sort(() => Math.random() - 0.5);
    const selectedProducts = shuffled.slice(0, 10).map(product => ({
        ...product,
        discountedPrice: (product.price * 0.85).toFixed(2) // %15 indirimli fiyat
    }));

    // Save the discounted products and date information to localStorage
    localStorage.setItem("discountedProducts", JSON.stringify(selectedProducts));
    localStorage.setItem("discountDate", today);

    return selectedProducts;
};

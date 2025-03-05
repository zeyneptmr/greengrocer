import { allproducts } from "../data/products";

export const getDiscountedProducts = () => {
    const storedDate = localStorage.getItem("discountDate");
    const today = new Date().toDateString();

    if (storedDate === today) {
        const storedProducts = JSON.parse(localStorage.getItem("discountedProducts"));
        if (storedProducts) return storedProducts;
    }

    const shuffled = allproducts.sort(() => Math.random() - 0.5);
    const selectedProducts = shuffled.slice(0, 10).map(product => ({
        ...product,
        discountedPrice: (product.price * 0.85).toFixed(2) // %15 indirimli fiyat
    }));

    localStorage.setItem("discountedProducts", JSON.stringify(selectedProducts));
    localStorage.setItem("discountDate", today);

    return selectedProducts;
};
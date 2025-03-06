import allproducts from "../data/products";

const PRODUCTS_KEY = 'products';

export const ProductStorage = {

    initializeProducts: () => {
        const existingProducts = localStorage.getItem(PRODUCTS_KEY);
        if (!existingProducts) {
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allproducts));
        }
    },

    
    getProducts: () => {
        const products = localStorage.getItem(PRODUCTS_KEY);
        return products ? JSON.parse(products) : [];
    },


    saveProducts: (products) => {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    },


    addProduct: (product) => {
        const products = ProductStorage.getProducts();
        
        let maxId = 0;
        
        products.forEach(p => {
            if (p.id && typeof p.id === 'number' && !isNaN(p.id) && p.id > maxId) {
                maxId = p.id;
            }
        });
        
        const newId = maxId + 1;
        
        const newProduct = {
            ...product,
            id: newId
        };
        
        products.push(newProduct);
        ProductStorage.saveProducts(products);
        
        return newProduct;
    },

    
    updateProduct: (updatedProduct) => {
        const products = ProductStorage.getProducts();
        const index = products.findIndex(p => p.id === updatedProduct.id);
        
        if (index !== -1) {
            products[index] = updatedProduct;
            ProductStorage.saveProducts(products);
            return updatedProduct;
        }
        
        return null;
    },


    deleteProduct: (productId) => {
        const products = ProductStorage.getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        
        ProductStorage.saveProducts(filteredProducts);
        return filteredProducts;
    },

    getCategories: () => {
        const products = ProductStorage.getProducts();
        return [...new Set(products.map(p => p.category.toUpperCase()))];
    }
};


ProductStorage.initializeProducts();

export default ProductStorage;
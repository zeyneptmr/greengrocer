import React, { useEffect, useState } from 'react';
import UserSidebar from "../components/UserSidebar";
import managerIcon from "../assets/manager.svg";
import Sidebar from "../components/Sidebar";
import adminIcon from "../assets/admin.svg";
import AdminSearchBar from "../components/AdminSearchBar";
import DisplayProducts from "../components/DisplayProducts";
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
        let maxId = products.reduce((max, p) => (p.id && p.id > max ? p.id : max), 0);
        const newProduct = { ...product, id: maxId + 1 };
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
        const products = ProductStorage.getProducts().filter(p => p.id !== productId);
        ProductStorage.saveProducts(products);
        return products;
    },
    getCategories: () => {
        return [...new Set(ProductStorage.getProducts().map(p => p.category.toUpperCase()))];
    }
};

ProductStorage.initializeProducts();
console.log(ProductStorage.getProducts());

export default ProductStorage;

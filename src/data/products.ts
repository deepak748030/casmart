import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import product9 from "@/assets/product-9.jpg";
import product10 from "@/assets/product-10.jpg";

export interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    rating: number;
}

export const products: Product[] = [
    {
        id: 1,
        name: "Varsi Premium Leather Bag",
        price: 3899,
        oldPrice: 5199,
        image: product1,
        category: "Bags & Accessories",
        rating: 4.5,
    },
    {
        id: 2,
        name: "Fit Twill Shirt for Woman",
        price: 4960,
        image: product2,
        category: "Women's Fashion",
        rating: 4.8,
    },
    {
        id: 3,
        name: "Grand Atlantic Chukka Boots",
        price: 2560,
        image: product3,
        category: "Footwear",
        rating: 4.3,
    },
    {
        id: 4,
        name: "Classic Denim Jacket",
        price: 3200,
        oldPrice: 4500,
        image: product4,
        category: "Men's Fashion",
        rating: 4.6,
    },
    {
        id: 5,
        name: "Soft Touch Interlock Polo",
        price: 3600,
        image: product5,
        category: "Men's Fashion",
        rating: 4.4,
    },
    {
        id: 6,
        name: "Casmart Smart Watch",
        price: 2400,
        oldPrice: 3040,
        image: product6,
        category: "Electronics",
        rating: 4.7,
    },
    {
        id: 7,
        name: "Premium Leather Wallet",
        price: 1899,
        oldPrice: 2499,
        image: product7,
        category: "Bags & Accessories",
        rating: 4.5,
    },
    {
        id: 8,
        name: "Wireless Earbuds Pro",
        price: 3999,
        oldPrice: 5999,
        image: product8,
        category: "Electronics",
        rating: 4.8,
    },
    {
        id: 9,
        name: "Sports Running Shoes",
        price: 4200,
        image: product9,
        category: "Footwear",
        rating: 4.6,
    },
    {
        id: 10,
        name: "Designer Sunglasses",
        price: 2800,
        oldPrice: 3500,
        image: product10,
        category: "Bags & Accessories",
        rating: 4.4,
    },
];

import { Product } from "@/api/productApi";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
    products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
            {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
            ))}
        </ul>
    );
};

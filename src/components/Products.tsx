import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getAllProducts, Product } from "@/api/productApi";
import { ProductFilter } from "./products/ProductFilter";
import { ProductGrid } from "./products/ProductGrid";
import { ProductsLoading } from "./products/ProductsLoading";

export const Products = () => {
  const [activeFilter, setActiveFilter] = useState("Best Seller");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts({ limit: 10 });
      setProducts(response.data.products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProductsLoading />;
  }

  return (
    <section id="shop" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">

        <ProductFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <ProductGrid products={products} />

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
            style={{ boxShadow: 'var(--shadow-md)' }}
            onClick={() => navigate('/products')}
          >
            <span>View All Products</span>
            <ShoppingBag className="ml-2 h-5 w-5 group-hover:animate-bounce-subtle" />
          </Button>
        </div>
      </div>
    </section>
  );
};
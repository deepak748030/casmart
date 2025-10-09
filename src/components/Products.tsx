import { useState, useEffect } from "react";
import { Eye, ShoppingBag, Heart, IndianRupee, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getAllProducts, getProductImageUrl, Product } from "@/api/productApi";

const filters = ["Best Seller", "Hot Collection", "Trendy", "New Arrival"];

export const Products = () => {
  const [activeFilter, setActiveFilter] = useState("Best Seller");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getBadgeInfo = (product: Product) => {
    if (product.discountPercent && product.discountPercent > 0) {
      return { text: `-${Math.round(product.discountPercent)}%`, variant: "destructive" as const };
    }
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 7) {
      return { text: "New", variant: "default" as const };
    }
    return null;
  };

  if (loading) {
    return (
      <section id="shop" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Products of the Week
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked collection of premium fashion essentials
          </p>
        </div>

        {/* Filter Buttons */}
        <ul className="flex flex-wrap justify-center gap-3 mb-16">
          {filters.map((filter) => (
            <li key={filter}>
              <Button
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`transition-all duration-300 ${activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-glow scale-105"
                  : "hover:scale-105 hover:border-primary/50"
                  }`}
              >
                {filter}
              </Button>
            </li>
          ))}
        </ul>

        {/* Products Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
          {products.map((product, index) => {
            const badge = getBadgeInfo(product);
            const imageUrl = product.imageUrl
              ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`
              : undefined;

            return (
              <li
                key={product._id}
                className="group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-card overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 border border-border/50">
                  <figure className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                    <Link to={`/product/${product._id}`} className="block h-full">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                        </div>
                      )}
                    </Link>

                    {badge && (
                      <Badge
                        variant={badge.variant}
                        className="absolute top-4 left-4 shadow-medium z-10 text-xs font-bold px-3 py-1"
                      >
                        {badge.text}
                      </Badge>
                    )}

                    {!product.inStock && (
                      <Badge
                        variant="secondary"
                        className="absolute top-4 left-4 shadow-medium z-10 text-xs font-bold px-3 py-1"
                      >
                        Out of Stock
                      </Badge>
                    )}

                    {/* Quick View Badge */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-strong backdrop-blur-sm bg-white/90 hover:bg-white h-10 w-10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-6 gap-3">
                      <Button
                        variant="secondary"
                        className="flex items-center gap-2 shadow-strong bg-white hover:bg-white/95 text-foreground font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full text-white hover:text-destructive hover:bg-white/90 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </figure>

                  <div className="p-4 space-y-3">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < Math.floor(product.averageRating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.numOfReviews})
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
                      <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors">
                        {product.title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 text-foreground font-bold" />
                        <span className="text-xl font-bold text-foreground">
                          {(product.discountedAmount || product.amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {product.discountedAmount && product.discountedAmount < product.amount && (
                        <div className="flex items-center">
                          <IndianRupee className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground line-through">
                            {product.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </div>

                    {product.discountPercent && product.discountPercent > 0 && (
                      <div className="pt-1">
                        <span className="text-xs font-semibold text-accent">
                          Save {Math.round(product.discountPercent)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-glow group"
          >
            <span>View All Products</span>
            <ShoppingBag className="ml-2 h-5 w-5 group-hover:animate-bounce-subtle" />
          </Button>
        </div>
      </div>
    </section>
  );
};

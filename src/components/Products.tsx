import { useState } from "react";
import { Eye, ShoppingBag, Heart, IndianRupee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const products = [
  {
    image: product1,
    name: "Varsi Leather Bag",
    price: 3899,
    oldPrice: 5199,
    rating: 4.5,
    reviews: 128,
    badge: { text: "-25%", variant: "destructive" as const },
  },
  {
    image: product2,
    name: "Fit Twill Shirt for Woman",
    price: 4960,
    rating: 4.8,
    reviews: 95,
    badge: { text: "New", variant: "default" as const },
  },
  {
    image: product3,
    name: "Grand Atlantic Chukka Boots",
    price: 2560,
    rating: 4.3,
    reviews: 67,
  },
  {
    image: product4,
    name: "Women's Faux-Trim Shirt",
    price: 6720,
    rating: 4.6,
    reviews: 142,
  },
  {
    image: product5,
    name: "Soft Touch Interlock Polo",
    price: 3600,
    rating: 4.4,
    reviews: 89,
  },
  {
    image: product6,
    name: "Casmart Smart Watch",
    price: 2400,
    oldPrice: 3040,
    rating: 4.7,
    reviews: 203,
  },
  {
    image: product7,
    name: "Casmart Smart Glass",
    price: 2000,
    oldPrice: 3120,
    rating: 4.2,
    reviews: 76,
  },
  {
    image: product8,
    name: "Cotton Shirt for Men",
    price: 6800,
    oldPrice: 7920,
    rating: 4.5,
    reviews: 111,
  },
  {
    image: product9,
    name: "Double-breasted Blazer",
    price: 2560,
    rating: 4.6,
    reviews: 93,
  },
  {
    image: product10,
    name: "Ribbed Cotton Bodysuits",
    price: 5680,
    rating: 4.9,
    reviews: 167,
    badge: { text: "New", variant: "default" as const },
  },
];

const filters = ["Best Seller", "Hot Collection", "Trendy", "New Arrival"];

export const Products = () => {
  const [activeFilter, setActiveFilter] = useState("Best Seller");

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
          {products.map((product, index) => (
            <li
              key={index}
              className="group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border border-border/50">
                <figure className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                  <a href="#" className="block h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                  </a>

                  {product.badge && (
                    <Badge
                      variant={product.badge.variant}
                      className="absolute top-4 left-4 shadow-medium z-10 text-xs font-bold px-3 py-1"
                    >
                      {product.badge.text}
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
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
                    <a href="#" className="hover:text-primary transition-colors">
                      {product.name}
                    </a>
                  </h3>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-foreground font-bold" />
                      <span className="text-xl font-bold text-foreground">
                        {product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {product.oldPrice && (
                      <div className="flex items-center">
                        <IndianRupee className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground line-through">
                          {product.oldPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {product.oldPrice && (
                    <div className="pt-1">
                      <span className="text-xs font-semibold text-accent">
                        Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
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

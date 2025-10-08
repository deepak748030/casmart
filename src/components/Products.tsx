import { useState } from "react";
import { Eye, ShoppingBag, Heart } from "lucide-react";
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
    price: 48.75,
    oldPrice: 65.0,
    badge: { text: "-25%", variant: "destructive" as const },
  },
  {
    image: product2,
    name: "Fit Twill Shirt for Woman",
    price: 62.0,
    badge: { text: "New", variant: "default" as const },
  },
  {
    image: product3,
    name: "Grand Atlantic Chukka Boots",
    price: 32.0,
  },
  {
    image: product4,
    name: "Women's Faux-Trim Shirt",
    price: 84.0,
  },
  {
    image: product5,
    name: "Soft Touch Interlock Polo",
    price: 45.0,
  },
  {
    image: product6,
    name: "Casmart Smart Watch",
    price: 30.0,
    oldPrice: 38.0,
  },
  {
    image: product7,
    name: "Casmart Smart Glass",
    price: 25.0,
    oldPrice: 39.0,
  },
  {
    image: product8,
    name: "Cotton Shirt for Men",
    price: 85.0,
    oldPrice: 99.0,
  },
  {
    image: product9,
    name: "Double-breasted Blazer",
    price: 32.0,
  },
  {
    image: product10,
    name: "Ribbed Cotton Bodysuits",
    price: 71.0,
    badge: { text: "New", variant: "default" as const },
  },
];

const filters = ["Best Seller", "Hot Collection", "Trendy", "New Arrival"];

export const Products = () => {
  const [activeFilter, setActiveFilter] = useState("Best Seller");

  return (
    <section id="shop" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Products of the week
        </h2>

        {/* Filter Buttons */}
        <ul className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <li key={filter}>
              <Button
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "bg-primary text-primary-foreground" : ""}
              >
                {filter}
              </Button>
            </li>
          ))}
        </ul>

        {/* Products Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {products.map((product, index) => (
            <li key={index} className="group">
              <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <figure className="relative aspect-[4/5] overflow-hidden">
                  <a href="#">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </a>

                  {product.badge && (
                    <Badge
                      variant={product.badge.variant}
                      className="absolute top-4 left-4"
                    >
                      {product.badge.text}
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Eye className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </Button>

                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </figure>

                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    <a href="#" className="hover:text-primary transition-colors">
                      {product.name}
                    </a>
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      £{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        £{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

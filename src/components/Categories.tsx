import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import category1 from "@/assets/category-1.jpg";
import category2 from "@/assets/category-2.jpg";
import category3 from "@/assets/category-3.jpg";
import category4 from "@/assets/category-4.jpg";
import category5 from "@/assets/category-5.jpg";
import category6 from "@/assets/category-6.jpg";

const categories = [
  { image: category1, name: "Sunglass & Eye" },
  { image: category2, name: "Active & Outdoor" },
  { image: category3, name: "Winter Wear" },
  { image: category4, name: "Exclusive Footwear" },
  { image: category5, name: "Jewelry" },
  { image: category6, name: "Sports Cap" },
];

export const Categories = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collections designed for every style
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <li
              key={index}
              className="group relative overflow-hidden animate-fade-up hover-lift border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <figure className="relative aspect-[17/20] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Animated border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-all duration-300" />
              </figure>

              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-10">
                <h3 className="text-white font-bold text-2xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-300">
                  {category.name}
                </h3>

                <Button
                  variant="secondary"
                  className="bg-white/95 hover:bg-white text-foreground font-semibold shadow-strong group-hover:shadow-glow transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

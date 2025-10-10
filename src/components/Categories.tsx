import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { getCategories, type Category } from "@/api/categoryApi";
import { useNavigate } from "react-router-dom";

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) {
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
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

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

        {categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg">No categories available at the moment.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <li
                key={category._id}
                className="group relative overflow-hidden animate-fade-up hover-lift border border-border/50 rounded-lg cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCategoryClick(category._id)}
              >
                <figure className="relative aspect-[17/20] overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Animated border effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-all duration-300" />
                </figure>

                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-10">
                  <h3 className="text-white font-bold text-2xl mb-4 text-center transform group-hover:-translate-y-2 transition-transform duration-300">
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
        )}
      </div>
    </section>
  );
};

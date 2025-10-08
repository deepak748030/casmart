import { Button } from "@/components/ui/button";
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <li key={index} className="group relative overflow-hidden rounded-lg">
              <figure className="relative aspect-[17/20] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </figure>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
                <Button variant="secondary" className="bg-white hover:bg-white/90 text-foreground">
                  {category.name}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

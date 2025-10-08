import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-[600px] flex items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBanner})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            Fashion Everyday
          </p>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8">
            Unrivalled Fashion House
          </h1>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
};

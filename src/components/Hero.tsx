import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-[600px] md:min-h-[700px] flex items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBanner})` }}
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Fashion Everyday</span>
            <TrendingUp className="h-4 w-4" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-up">
            Unrivalled Fashion House
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Discover premium collections crafted with passion. Where style meets sophistication.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-strong hover:shadow-glow hover:scale-105 transition-all duration-300 group"
            >
              <ShoppingBag className="mr-2 h-5 w-5 group-hover:animate-bounce-subtle" />
              <span className="font-semibold">Shop Now</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-foreground/20 hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="font-semibold">View Collections</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">10k+</span>
              <span className="text-sm text-muted-foreground">Happy Customers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">500+</span>
              <span className="text-sm text-muted-foreground">Premium Products</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">4.9★</span>
              <span className="text-sm text-muted-foreground">Customer Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

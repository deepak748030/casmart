import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-8 md:p-12 lg:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjItMnptLTItMGgyLTJ6bTAtMmgyLTJ6bS0yIDBoMi0yem0wLTJoMi0yem0tMiAwaDItMnptMC0yaDItMnptLTIgMGgyLTJ6bTAtMmgyLTJ6bTItMGgyLTJ6bTAtMmgyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Subscribe Newsletter
            </h2>

            <p className="text-muted-foreground mb-8">
              Enter your email below to be the first to know about new collections and product launches.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="pl-10"
                />
              </div>

              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto">
                <span>Subscribe</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

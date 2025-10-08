import { Mail, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 p-8 md:p-12 lg:p-20 text-center overflow-hidden shadow-soft border border-primary/20">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjItMnptLTItMGgyLTJ6bTAtMmgyLTJ6bS0yIDBoMi0yem0wLTJoMi0yem0tMiAwaDItMnptMC0yaDItMnptLTIgMGgyLTJ6bTAtMmgyLTJ6bTItMGgyLTJ6bTAtMmgyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6 animate-bounce-subtle">
              <Send className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-up">
              Subscribe Newsletter
            </h2>

            <p className="text-muted-foreground text-lg mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Enter your email below to be the first to know about new collections, exclusive offers, and product launches.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="pl-12 h-14 text-base border-2 border-border/50 focus:border-primary shadow-inner-soft"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground sm:w-auto h-14 px-8 shadow-soft hover:shadow-medium hover:scale-105 transition-all duration-300 group"
              >
                <span className="font-semibold">Subscribe</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

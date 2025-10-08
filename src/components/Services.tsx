import { Truck, RotateCcw, ShieldCheck, Headphones, IndianRupee } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Free Shipping",
    text: "On All Order Over ₹999",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    text: "30 Day Returns Policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    text: "100% Secure Guarantee",
  },
  {
    icon: Headphones,
    title: "Special Support",
    text: "24/7 Dedicated Support",
  },
];

export const Services = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <li
              key={index}
              className="group animate-fade-up hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/30">
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner-soft">
                  <service.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground mb-2 text-lg group-hover:text-primary transition-colors">
                    {service.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

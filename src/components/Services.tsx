import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Free Shipping",
    text: "On All Order Over $599",
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
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">
                  {service.title}
                </p>
                <p className="text-sm text-muted-foreground">{service.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

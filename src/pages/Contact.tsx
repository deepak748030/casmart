import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Headphones, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
    {
        icon: MapPin,
        title: "Visit Our Store",
        details: ["123 Fashion Street, MG Road", "Mumbai, Maharashtra 400001", "India"],
    },
    {
        icon: Phone,
        title: "Call Us",
        details: ["+91 98765 43210", "+91 98765 43211", "Mon-Sat: 10AM - 8PM"],
    },
    {
        icon: Mail,
        title: "Email Us",
        details: ["support@casmart.com", "sales@casmart.com", "24/7 Response Time"],
    },
    {
        icon: Clock,
        title: "Working Hours",
        details: ["Monday - Saturday", "10:00 AM - 8:00 PM", "Sunday: 11:00 AM - 6:00 PM"],
    },
];

const features = [
    {
        icon: MessageSquare,
        title: "Live Chat Support",
        description: "Connect with our team instantly for quick assistance",
    },
    {
        icon: Headphones,
        title: "24/7 Customer Service",
        description: "We're always here to help you with your queries",
    },
    {
        icon: Shield,
        title: "Secure Communication",
        description: "Your information is safe and protected with us",
    },
];

const Contact = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Message Sent Successfully!",
            description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 border-b-2 border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center animate-fade-up">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-6 border border-primary/20">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-sm font-semibold">We're Here to Help</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                                Get In Touch
                            </h1>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4">
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                            {contactInfo.map((info, index) => (
                                <li
                                    key={index}
                                    className="group animate-fade-up hover-lift"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="bg-card border-2 border-border/50 p-8 text-center shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/30 h-full">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/10 mb-4 group-hover:scale-110 transition-all duration-300">
                                            <info.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-4">{info.title}</h3>
                                        <ul className="space-y-2">
                                            {info.details.map((detail, idx) => (
                                                <li key={idx} className="text-muted-foreground text-sm">
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Main Contact Section */}
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Contact Form */}
                            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                                <div className="bg-card border-2 border-border/50 p-8 md:p-10 shadow-soft">
                                    <h2 className="text-3xl font-bold text-foreground mb-2">Send us a Message</h2>
                                    <p className="text-muted-foreground mb-8">
                                        Fill out the form below and we'll get back to you within 24 hours.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                                                    Full Name *
                                                </label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="border-2 border-border/50 focus:border-primary h-12"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                                                    Email Address *
                                                </label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="border-2 border-border/50 focus:border-primary h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                                                    Phone Number
                                                </label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="border-2 border-border/50 focus:border-primary h-12"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-semibold text-foreground mb-2">
                                                    Subject *
                                                </label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    type="text"
                                                    placeholder="Order Inquiry"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="border-2 border-border/50 focus:border-primary h-12"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                                                Your Message *
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Tell us how we can help you..."
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                className="border-2 border-border/50 focus:border-primary resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium hover:scale-105 transition-all duration-300 group h-14"
                                        >
                                            <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            <span className="font-semibold">Send Message</span>
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Features & Map */}
                            <div className="space-y-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                                {/* Features */}
                                <ul className="space-y-6">
                                    {features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-4 bg-card border-2 border-border/50 p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/30 group"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/10 group-hover:scale-110 transition-all duration-300">
                                                <feature.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Map Placeholder */}
                                <div className="bg-card border-2 border-border/50 p-6 shadow-soft">
                                    <h3 className="text-xl font-bold text-foreground mb-4">Visit Our Store</h3>
                                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border-2 border-border/50">
                                        <div className="text-center">
                                            <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
                                            <p className="text-muted-foreground font-semibold">123 Fashion Street, MG Road</p>
                                            <p className="text-muted-foreground text-sm">Mumbai, Maharashtra 400001</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                                        >
                                            Get Directions
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-gradient-to-b from-muted/20 to-background border-t-2 border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Quick answers to common questions about our services
                            </p>
                        </div>

                        <ul className="max-w-3xl mx-auto space-y-4">
                            {[
                                {
                                    q: "What are your shipping policies?",
                                    a: "We offer free shipping on all orders above ₹999. Standard delivery takes 3-5 business days across India.",
                                },
                                {
                                    q: "Do you offer international shipping?",
                                    a: "Yes, we ship to over 50 countries worldwide. International shipping costs vary by location.",
                                },
                                {
                                    q: "What is your return policy?",
                                    a: "We offer a 30-day hassle-free return policy. Items must be unused and in original packaging.",
                                },
                                {
                                    q: "How can I track my order?",
                                    a: "Once your order ships, you'll receive a tracking number via email and SMS to track your delivery.",
                                },
                            ].map((faq, index) => (
                                <li
                                    key={index}
                                    className="bg-card border-2 border-border/50 p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <h3 className="text-lg font-bold text-foreground mb-2">{faq.q}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;

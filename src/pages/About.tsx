import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Award, Users, Target, Heart, TrendingUp, Globe, Leaf, Shield, Star, CheckCircle } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import sustainability from "@/assets/sustainability.jpg";
import quality from "@/assets/quality.jpg";

const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "50+", label: "Team Members" },
];

const values = [
    {
        icon: Heart,
        title: "Customer First",
        description: "Every decision we make prioritizes our customers' satisfaction and trust. Your happiness is our success.",
    },
    {
        icon: Award,
        title: "Quality Excellence",
        description: "We source only the finest materials and employ rigorous quality control to ensure premium products.",
    },
    {
        icon: Leaf,
        title: "Sustainability",
        description: "Committed to eco-friendly practices and ethical sourcing to protect our planet for future generations.",
    },
    {
        icon: Shield,
        title: "Trust & Integrity",
        description: "Building lasting relationships through transparent business practices and unwavering honesty.",
    },
];

const team = [
    {
        image: team1,
        name: "Priya Sharma",
        role: "Founder & CEO",
        description: "Leading Casmart with 15+ years of fashion industry expertise and vision for sustainable luxury.",
    },
    {
        image: team2,
        name: "Rahul Verma",
        role: "Creative Director",
        description: "Award-winning designer bringing innovation and creativity to every collection we launch.",
    },
    {
        image: team3,
        name: "Anjali Patel",
        role: "Marketing Director",
        description: "Strategic marketing leader connecting our brand with customers across digital platforms.",
    },
    {
        image: team4,
        name: "Vikram Singh",
        role: "Operations Head",
        description: "Ensuring seamless logistics and superior customer experience through operational excellence.",
    },
];

const milestones = [
    { year: "2009", title: "Foundation", description: "Casmart was born with a vision to revolutionize Indian fashion retail" },
    { year: "2012", title: "First Flagship Store", description: "Opened our premium store in Mumbai, setting new standards in retail experience" },
    { year: "2015", title: "Online Expansion", description: "Launched our e-commerce platform, reaching customers across India" },
    { year: "2018", title: "Sustainability Initiative", description: "Committed to eco-friendly practices and ethical sourcing" },
    { year: "2020", title: "International Presence", description: "Expanded to international markets across 20+ countries" },
    { year: "2024", title: "AI & Innovation", description: "Pioneering personalized shopping experiences with cutting-edge technology" },
];

const achievements = [
    "Best Fashion Retailer of the Year 2023",
    "Sustainable Fashion Pioneer Award 2022",
    "Top 10 E-commerce Brands in India 2023",
    "Customer Choice Award for 5 consecutive years",
    "ISO 9001:2015 Quality Certification",
    "Green Business Certification 2023",
];

const About = () => {
    return (
        <div className="min-h-screen">
            <Header />

            <main>
                {/* Hero Section */}
                <section
                    className="relative min-h-[500px] md:min-h-[600px] flex items-center bg-cover bg-center bg-no-repeat border-b-2 border-border"
                    style={{ backgroundImage: `url(${aboutHero})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl animate-fade-up">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-6 border border-primary/20">
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-semibold">Est. 2009</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                                Redefining Fashion Excellence
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                                For over 15 years, Casmart has been at the forefront of fashion innovation, bringing premium quality and sustainable style to customers worldwide.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center md:text-left">
                                        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                            {stat.number}
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            <div className="animate-fade-up">
                                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-6 border border-primary/20">
                                    <Target className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Our Mission</span>
                                </div>
                                <h2 className="text-4xl font-bold text-foreground mb-6">
                                    Empowering Style, Elevating Lives
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    At Casmart, we believe fashion is more than clothing—it's a form of self-expression. Our mission is to provide premium, sustainable fashion that empowers individuals to express their unique identity while making a positive impact on the world.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We're committed to ethical sourcing, exceptional craftsmanship, and creating an inclusive community where everyone feels valued and inspired.
                                </p>
                            </div>

                            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 mb-6 border border-accent/20">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Our Vision</span>
                                </div>
                                <h2 className="text-4xl font-bold text-foreground mb-6">
                                    Leading Global Fashion Revolution
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We envision a future where fashion is sustainable, accessible, and inclusive for all. Casmart aims to become the world's most trusted fashion brand by 2030, setting new industry standards in quality, ethics, and customer experience.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Through innovation and dedication, we're building a legacy that transcends trends—creating timeless style that respects both people and planet.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-20 bg-gradient-to-b from-muted/20 to-background border-y-2 border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Our Core Values
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                The principles that guide everything we do and define who we are
                            </p>
                        </div>

                        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <li
                                    key={index}
                                    className="group animate-fade-up hover-lift"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="bg-card border-2 border-border/50 p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/30 h-full">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/10 mb-6 group-hover:scale-110 transition-all duration-300">
                                            <value.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed text-sm">
                                            {value.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Journey Timeline */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Our Journey
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                A timeline of milestones that shaped Casmart into what it is today
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <ul className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-6 animate-fade-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex-shrink-0 w-24 text-right">
                                            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold text-lg px-4 py-2 shadow-soft">
                                                {milestone.year}
                                            </div>
                                        </div>
                                        <div className="flex-1 border-l-4 border-primary/30 pl-6 pb-8">
                                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {milestone.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-gradient-to-b from-muted/20 to-background border-y-2 border-border">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Meet Our Leadership
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Passionate experts driving innovation and excellence every day
                            </p>
                        </div>

                        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <li
                                    key={index}
                                    className="group animate-fade-up hover-lift"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="bg-card border-2 border-border/50 overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/30">
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-primary font-semibold mb-3 text-sm">
                                                {member.role}
                                            </p>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {member.description}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Commitment Sections */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 mb-20">
                            {/* Sustainability */}
                            <div className="animate-fade-up">
                                <div className="overflow-hidden border-2 border-border/50 shadow-soft mb-6">
                                    <img
                                        src={sustainability}
                                        alt="Sustainability"
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                </div>
                                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 mb-4 border border-accent/20">
                                    <Leaf className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Sustainability</span>
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">
                                    Committed to a Greener Future
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We're dedicated to reducing our environmental footprint through sustainable sourcing, eco-friendly packaging, and ethical manufacturing practices. Our goal is carbon neutrality by 2030.
                                </p>
                                <ul className="space-y-2">
                                    {["100% recyclable packaging", "Organic cotton sourcing", "Carbon-neutral shipping", "Zero-waste production"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                                            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quality */}
                            <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                                <div className="overflow-hidden border-2 border-border/50 shadow-soft mb-6">
                                    <img
                                        src={quality}
                                        alt="Quality Control"
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                </div>
                                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 mb-4 border border-primary/20">
                                    <Award className="h-4 w-4" />
                                    <span className="text-sm font-semibold">Quality Excellence</span>
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">
                                    Uncompromising Quality Standards
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Every product undergoes rigorous quality checks before reaching you. Our commitment to excellence ensures you receive only the finest fashion items that stand the test of time.
                                </p>
                                <ul className="space-y-2">
                                    {["Premium material sourcing", "Multi-level quality inspection", "Expert craftsmanship", "Lifetime quality guarantee"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Achievements */}
                <section className="py-20 bg-gradient-to-b from-muted/20 to-background border-t-2 border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12 animate-fade-up">
                                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                    Awards & Recognition
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Honored by industry leaders and customers alike
                                </p>
                            </div>

                            <ul className="grid md:grid-cols-2 gap-4">
                                {achievements.map((achievement, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 bg-card border-2 border-border/50 p-4 shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/30 animate-fade-up"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <Star className="h-6 w-6 text-primary flex-shrink-0" />
                                        <span className="text-foreground font-medium">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-background border-t-2 border-border">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Join Our Fashion Journey
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                Be part of a community that values quality, sustainability, and style. Explore our collections and experience the Casmart difference.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-medium hover:scale-105 transition-all duration-300"
                                >
                                    <TrendingUp className="mr-2 h-5 w-5" />
                                    <span className="font-semibold">Shop Now</span>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                                >
                                    <span className="font-semibold">Contact Us</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;

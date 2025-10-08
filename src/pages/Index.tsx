import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Categories } from "@/components/Categories";
import { Products } from "@/components/Products";
import { Blog } from "@/components/Blog";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[190px] md:pt-[170px]">
        <Hero />
        <Services />
        <Categories />
        <Products />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

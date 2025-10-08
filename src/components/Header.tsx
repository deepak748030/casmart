import { useState, useEffect } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, Mail, MapPin, IndianRupee, Truck, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Promotional Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>support@casmart.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mx-auto md:mx-0">
              <Truck className="h-4 w-4" />
              <span className="font-medium">Free Shipping on Orders Above ₹999</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>Track Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Section - Scrollable */}
      <header className="bg-background border-b-2 border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Logo - Left */}
            <div className="flex items-center gap-3">
              <a href="#home" className="flex items-center">
                <Logo className="text-3xl" />
              </a>
              <Badge variant="secondary" className="hidden lg:flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span className="text-xs">Trusted</span>
              </Badge>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for products, brands and more..."
                  className="pr-12 h-11 border-2 focus:border-primary"
                />
                <Button
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Desktop Actions - Right */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted">
                <User className="h-5 w-5" />
                <span className="text-xs font-medium">Account</span>
              </Button>

              <div className="w-px h-8 bg-border mx-1" />

              <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative hover:bg-muted">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    3
                  </Badge>
                </div>
                <span className="text-xs font-medium">Cart</span>
              </Button>

              <div className="w-px h-8 bg-border mx-1" />

              <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative hover:bg-muted">
                <div className="relative">
                  <Heart className="h-5 w-5" />
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    2
                  </Badge>
                </div>
                <span className="text-xs font-medium">Wishlist</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="pr-12 border-2"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Navigation Menu with Features */}
      <nav className={`${isScrolled ? "fixed top-0 left-0 right-0" : ""} bg-background border-b-2 border-border z-50 transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Navigation Links */}
            <ul className={`hidden md:flex items-center justify-center gap-1 py-3 flex-1 ${isMobileMenuOpen ? "hidden" : ""}`}>
              <li>
                <a href="/" className="px-6 py-2 text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide">
                  Home
                </a>
              </li>
              <li>
                <a href="/#shop" className="px-6 py-2 text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="px-6 py-2 text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide">
                  About
                </a>
              </li>
              <li>
                <a href="/#blog" className="px-6 py-2 text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="px-6 py-2 text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide">
                  Contact
                </a>
              </li>
            </ul>

            {/* Right Side Features */}
            <div className="hidden lg:flex items-center gap-6 py-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm border-l-2 border-border pl-6">
                <IndianRupee className="h-4 w-4 text-accent" />
                <span className="font-semibold">Best Prices</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <ul className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} border-t-2 border-border bg-background`}>
            <li>
              <a href="/" className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border">
                Home
              </a>
            </li>
            <li>
              <a href="/#shop" className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border">
                Shop
              </a>
            </li>
            <li>
              <a href="/about" className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border">
                About
              </a>
            </li>
            <li>
              <a href="/#blog" className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border">
                Blog
              </a>
            </li>
            <li>
              <a href="/contact" className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b-2 border-border">
                Contact
              </a>
            </li>

            {/* Mobile Actions */}
            <li className="border-b border-border">
              <a href="#" className="flex items-center gap-3 py-4 px-4 text-foreground hover:bg-muted transition-all">
                <User className="h-5 w-5" />
                <span className="font-semibold">My Account</span>
              </a>
            </li>
            <li className="border-b border-border">
              <a href="#" className="flex items-center justify-between py-4 px-4 text-foreground hover:bg-muted transition-all">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-semibold">Shopping Cart</span>
                </div>
                <Badge className="h-6 w-6 p-0 flex items-center justify-center">
                  3
                </Badge>
              </a>
            </li>
            <li className="border-b border-border">
              <a href="#" className="flex items-center justify-between py-4 px-4 text-foreground hover:bg-muted transition-all">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">Wishlist</span>
                </div>
                <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center">
                  2
                </Badge>
              </a>
            </li>

            {/* Mobile Features */}
            <li className="py-4 px-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">Best Price</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Trusted</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

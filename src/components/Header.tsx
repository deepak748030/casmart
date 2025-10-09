import { useState, useEffect } from "react";
import { ShoppingCart, Heart, User, Menu, X, Phone, Mail, MapPin, IndianRupee, Truck, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Badge } from "@/components/ui/badge";
import { NavLink, Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { getCartCount, getWishlistCount } = useCart();

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
          <div className="flex items-center justify-between py-3 md:py-4 gap-2 md:gap-4">
            {/* Logo - Left */}
            <div className="flex items-center gap-2 md:gap-3">
              <NavLink to="/" className="flex items-center">
                <Logo className="text-xl md:text-2xl lg:text-3xl" />
              </NavLink>
              <Badge variant="secondary" className="hidden lg:flex items-center gap-1">
                <Award className="h-3 w-3" />
                <span className="text-xs">Trusted</span>
              </Badge>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Desktop Actions - Right */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={user ? "/profile" : "/login"}>
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="text-xs font-medium">{user ? 'Profile' : 'Account'}</span>
                </Button>
              </Link>

              <div className="w-px h-8 bg-border mx-1" />

              <Link to="/cart">
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative hover:bg-muted hover:text-primary transition-colors">
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                        {getCartCount()}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">Cart</span>
                </Button>
              </Link>

              <div className="w-px h-8 bg-border mx-1" />

              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative hover:bg-muted hover:text-primary transition-colors">
                  <div className="relative">
                    <Heart className="h-5 w-5" />
                    {getWishlistCount() > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                        {getWishlistCount()}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">Wishlist</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex items-center justify-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <SearchBar isMobile />
          </div>
        </div>
      </header>

      {/* Sticky Navigation Menu with Features */}
      <nav className={`${isScrolled ? "fixed top-0 left-0 right-0 shadow-md" : ""} bg-background border-b-2 border-border z-50 transition-all duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Show Logo and Menu button when scrolled on mobile */}
            {isScrolled && (
              <div className="md:hidden flex items-center justify-between w-full py-2">
                <NavLink to="/" className="flex items-center">
                  <Logo className="text-lg" />
                </NavLink>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            )}

            {/* Navigation Links */}
            <ul className={`hidden md:flex items-center justify-center gap-1 py-3 flex-1 ${isMobileMenuOpen ? "hidden" : ""}`}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `px-4 lg:px-6 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide ${isActive ? 'text-primary bg-muted' : ''}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <a
                  href="/#shop"
                  className="px-4 lg:px-6 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide scroll-smooth"
                >
                  Shop
                </a>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `px-4 lg:px-6 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide ${isActive ? 'text-primary bg-muted' : ''}`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <a
                  href="/#blog"
                  className="px-4 lg:px-6 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide scroll-smooth"
                >
                  Blog
                </a>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `px-4 lg:px-6 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide ${isActive ? 'text-primary bg-muted' : ''}`
                  }
                >
                  Contact
                </NavLink>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `px-4 lg:px-6 py-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-all font-semibold uppercase text-sm tracking-wide ${isActive ? 'text-primary bg-muted' : ''}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
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
          <ul className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} border-t-2 border-border bg-background relative z-50`}>
            <li className="bg-background">
              <NavLink
                to="/"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border ${isActive ? 'bg-muted text-primary' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="bg-background">
              <a
                href="/#shop"
                onClick={toggleMobileMenu}
                className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border"
              >
                Shop
              </a>
            </li>
            <li className="bg-background">
              <NavLink
                to="/about"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border ${isActive ? 'bg-muted text-primary' : ''}`
                }
              >
                About
              </NavLink>
            </li>
            <li className="bg-background">
              <a
                href="/#blog"
                onClick={toggleMobileMenu}
                className="block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b border-border"
              >
                Blog
              </a>
            </li>
            <li className="bg-background">
              <NavLink
                to="/contact"
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  `block py-4 px-4 text-foreground hover:bg-muted hover:text-primary transition-all font-semibold border-b-2 border-border ${isActive ? 'bg-muted text-primary' : ''}`
                }
              >
                Contact
              </NavLink>
            </li>

            {/* Mobile Actions */}
            <li className="border-b border-border bg-background">
              <Link to={user ? "/profile" : "/login"} onClick={toggleMobileMenu} className="flex items-center gap-3 py-4 px-4 text-foreground hover:bg-muted transition-all">
                <User className="h-5 w-5" />
                <span className="font-semibold">{user ? 'My Profile' : 'My Account'}</span>
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="border-b border-border bg-background">
                <Link to="/admin" onClick={toggleMobileMenu} className="flex items-center gap-3 py-4 px-4 text-foreground hover:bg-muted transition-all">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Admin Dashboard</span>
                </Link>
              </li>
            )}
            <li className="border-b border-border bg-background">
              <Link to="/cart" onClick={toggleMobileMenu} className="flex items-center justify-between py-4 px-4 text-foreground hover:bg-muted transition-all">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-semibold">Shopping Cart</span>
                </div>
                {getCartCount() > 0 && (
                  <Badge className="h-6 w-6 p-0 flex items-center justify-center">
                    {getCartCount()}
                  </Badge>
                )}
              </Link>
            </li>
            <li className="border-b border-border bg-background">
              <Link to="/wishlist" onClick={toggleMobileMenu} className="flex items-center justify-between py-4 px-4 text-foreground hover:bg-muted transition-all">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">Wishlist</span>
                </div>
                {getWishlistCount() > 0 && (
                  <Badge variant="destructive" className="h-6 w-6 p-0 flex items-center justify-center">
                    {getWishlistCount()}
                  </Badge>
                )}
              </Link>
            </li>

            {/* Mobile Features */}
            <li className="py-4 px-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-3 bg-card p-3 rounded-md border border-border">
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
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

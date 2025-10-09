import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    IndianRupee,
    ArrowRight,
    ShoppingCart,
    Truck,
    Shield,
    LogIn,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Cart() {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
    } = useCart();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);



    const subtotal = getCartTotal();
    const deliveryCharges = 200;
    const discount = 0;
    const total = subtotal + deliveryCharges - discount;

    const handleCheckout = () => {
        // Navigate to checkout page (to be implemented)
        navigate("/checkout");
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                    <div className="container mx-auto px-4 py-16 md:py-24">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="mb-8">
                                <LogIn className="h-24 w-24 md:h-32 md:w-32 mx-auto text-muted-foreground/50" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Login Required
                            </h1>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Please log in to view your shopping cart.
                            </p>
                            <Link to="/login">
                                <Button size="lg" className="shadow-glow">
                                    <LogIn className="h-5 w-5 mr-2" />
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                    <div className="container mx-auto px-4 py-16 md:py-24">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="mb-8">
                                <ShoppingCart className="h-24 w-24 md:h-32 md:w-32 mx-auto text-muted-foreground/50" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Your Cart is Empty
                            </h1>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Looks like you haven't added anything to your cart yet.
                            </p>
                            <Link to="/#shop">
                                <Button size="lg" className="shadow-glow">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Start Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 py-8 md:py-16">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Shopping Cart
                            </h1>
                            <p className="text-muted-foreground">
                                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            className="hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Cart
                        </Button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={`${item._id}-${item.size}`} className="hover-lift">
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover rounded-md"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                                    }}
                                                />
                                                {!item.inStock && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="absolute top-2 left-2 text-xs"
                                                    >
                                                        Out of Stock
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between gap-4 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <Link to={`/product/${item._id}`}>
                                                            <h3 className="font-semibold text-base md:text-lg hover:text-primary transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {item.category}
                                                        </p>
                                                        {item.size && (
                                                            <p className="text-sm text-muted-foreground">
                                                                Size: {item.size}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="flex-shrink-0 hover:bg-destructive hover:text-destructive-foreground"
                                                        onClick={() => removeFromCart(item._id, item.size)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border border-border rounded-md w-fit">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10"
                                                            onClick={() =>
                                                                updateQuantity(item._id, item.size, item.quantity - 1)
                                                            }
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-12 text-center font-semibold">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10"
                                                            onClick={() =>
                                                                updateQuantity(item._id, item.size, item.quantity + 1)
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-center gap-2">
                                                        {item.discountedAmount && item.discountedAmount < item.amount && (
                                                            <div className="flex items-center text-muted-foreground line-through text-sm">
                                                                <IndianRupee className="h-3 w-3" />
                                                                <span>{item.amount.toLocaleString("en-IN")}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center font-bold text-lg">
                                                            <IndianRupee className="h-5 w-5" />
                                                            <span>
                                                                {((item.discountedAmount || item.amount) * item.quantity).toLocaleString("en-IN")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8 shadow-lg border-2">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground">Subtotal</span>
                                            <div className="flex items-center font-medium text-sm">
                                                <IndianRupee className="h-3.5 w-3.5" />
                                                <span>{subtotal.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Truck className="h-3.5 w-3.5" />
                                                Delivery Charges
                                            </span>
                                            <div className="flex items-center font-medium text-sm">
                                                <IndianRupee className="h-3.5 w-3.5" />
                                                <span>{deliveryCharges}</span>
                                            </div>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-sm text-muted-foreground">Discount</span>
                                                <div className="flex items-center text-accent font-medium text-sm">
                                                    <span>-</span>
                                                    <IndianRupee className="h-3.5 w-3.5" />
                                                    <span>{discount.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                        )}

                                        <Separator className="my-4" />

                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-base font-bold">Total</span>
                                            <div className="flex items-center text-lg font-bold text-primary">
                                                <IndianRupee className="h-5 w-5" />
                                                <span>{total.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full shadow-glow mb-4"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </Button>

                                    <Link to="/#shop">
                                        <Button variant="outline" className="w-full">
                                            Continue Shopping
                                        </Button>
                                    </Link>

                                    {/* Features */}
                                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-sm">Fast Delivery</p>
                                                <span className="text-xs text-muted-foreground">
                                                    Delivered within 3-5 business days
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-sm">Secure Payment</p>
                                                <span className="text-xs text-muted-foreground">
                                                    100% secure payment gateway
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

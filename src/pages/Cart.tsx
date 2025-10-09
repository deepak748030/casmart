import { useState } from "react";
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
    Tag,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
    } = useCart();

    const [promoCode, setPromoCode] = useState("");

    const subtotal = getCartTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const discount = 0;
    const total = subtotal + shipping - discount;

    const handleCheckout = () => {
        // Navigate to checkout page (to be implemented)
        navigate("/checkout");
    };

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
                                                        onClick={() => removeFromCart(item._id)}
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
                                                                updateQuantity(item._id, item.quantity - 1)
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
                                                                updateQuantity(item._id, item.quantity + 1)
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
                            <Card className="sticky top-8">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <div className="flex items-center font-semibold">
                                                <IndianRupee className="h-4 w-4" />
                                                <span>{subtotal.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            {shipping === 0 ? (
                                                <span className="text-accent font-semibold">FREE</span>
                                            ) : (
                                                <div className="flex items-center font-semibold">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>{shipping}</span>
                                                </div>
                                            )}
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Discount</span>
                                                <div className="flex items-center text-accent font-semibold">
                                                    <span>-</span>
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>{discount.toLocaleString("en-IN")}</span>
                                                </div>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <div className="flex items-center">
                                                <IndianRupee className="h-5 w-5" />
                                                <span>{total.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Promo Code */}
                                    <div className="mb-6">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Promo code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <Button variant="outline">
                                                <Tag className="h-4 w-4 mr-2" />
                                                Apply
                                            </Button>
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
                                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span className="text-muted-foreground">
                                                {shipping === 0
                                                    ? "Free shipping on this order"
                                                    : "Free shipping on orders above ₹999"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                                            <span className="text-muted-foreground">
                                                100% Secure Payment
                                            </span>
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

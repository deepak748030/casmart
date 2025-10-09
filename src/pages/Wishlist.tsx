import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    ShoppingCart,
    Trash2,
    IndianRupee,
    ShoppingBag,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Wishlist() {
    const { wishlistItems, removeFromWishlist, moveToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                    <div className="container mx-auto px-4 py-16 md:py-24">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="mb-8">
                                <Heart className="h-24 w-24 md:h-32 md:w-32 mx-auto text-muted-foreground/50" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Your Wishlist is Empty
                            </h1>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Save your favorite items here to purchase them later.
                            </p>
                            <Link to="/#shop">
                                <Button size="lg" className="shadow-glow">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Explore Products
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
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
                        <p className="text-muted-foreground">
                            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
                        </p>
                    </div>

                    {/* Wishlist Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => {
                            const discount = item.discountedAmount && item.amount
                                ? Math.round(((item.amount - item.discountedAmount) / item.amount) * 100)
                                : 0;

                            return (
                                <Card key={item._id} className="group hover-lift overflow-hidden">
                                    <CardContent className="p-0">
                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-muted/30">
                                            <Link to={`/product/${item._id}`}>
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                                    }}
                                                />
                                            </Link>

                                            {/* Discount Badge */}
                                            {discount > 0 && (
                                                <Badge
                                                    variant="destructive"
                                                    className="absolute top-3 left-3 font-bold"
                                                >
                                                    -{discount}%
                                                </Badge>
                                            )}

                                            {/* Stock Badge */}
                                            {!item.inStock && (
                                                <Badge
                                                    variant="secondary"
                                                    className="absolute top-3 right-3"
                                                >
                                                    Out of Stock
                                                </Badge>
                                            )}

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeFromWishlist(item._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-4">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                {item.category}
                                            </p>
                                            <Link to={`/product/${item._id}`}>
                                                <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
                                                    {item.title}
                                                </h3>
                                            </Link>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex items-center font-bold text-lg">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>
                                                        {(item.discountedAmount || item.amount).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                                {item.discountedAmount && item.discountedAmount < item.amount && (
                                                    <div className="flex items-center text-sm text-muted-foreground line-through">
                                                        <IndianRupee className="h-3 w-3" />
                                                        <span>{item.amount.toLocaleString("en-IN")}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => moveToCart(item._id)}
                                                    disabled={!item.inStock}
                                                >
                                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                                    Add to Cart
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => removeFromWishlist(item._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Continue Shopping */}
                    <div className="mt-12 text-center">
                        <Link to="/#shop">
                            <Button size="lg" variant="outline">
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

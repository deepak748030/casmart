import { Eye, ShoppingBag, Heart, IndianRupee, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/api/productApi";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
    product: Product;
    index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

    const getBadgeInfo = (product: Product) => {
        if (product.discountPercent && product.discountPercent > 0) {
            return { text: `-${Math.round(product.discountPercent)}%`, variant: "destructive" as const };
        }
        const daysSinceCreated = Math.floor(
            (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceCreated <= 7) {
            return { text: "New", variant: "default" as const };
        }
        return null;
    };

    const badge = getBadgeInfo(product);
    const imageUrl = product.imageUrl
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`
        : undefined;

    return (
        <li
            className="group animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <Link to={`/product/${product._id}`}>
                <article className="card-enterprise overflow-hidden h-full flex flex-col">
                    {/* Product Image */}
                    <figure className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
                            </div>
                        )}

                        {/* Badges */}
                        {badge && (
                            <Badge
                                variant={badge.variant}
                                className="absolute top-4 left-4 discount-badge z-10"
                            >
                                {badge.text}
                            </Badge>
                        )}

                        {!product.inStock && (
                            <Badge
                                variant="secondary"
                                className="absolute top-4 left-4 shadow-md z-10 text-xs font-bold px-3 py-1"
                            >
                                Out of Stock
                            </Badge>
                        )}

                        {/* Quick View */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full shadow-lg backdrop-blur-sm bg-background/95 hover:bg-background h-10 w-10"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Action Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-6 gap-3">
                            <Button
                                variant="secondary"
                                className="flex items-center gap-2 bg-background hover:bg-background/95 text-foreground font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 shadow-lg"
                                disabled={!product.inStock}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart({
                                        _id: product._id,
                                        title: product.title,
                                        amount: product.amount,
                                        discountedAmount: product.discountedAmount,
                                        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                                        category: product.category.name,
                                        inStock: product.inStock,
                                    }, 1);
                                }}
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>Add to Cart</span>
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                className={`rounded-full hover:bg-background/90 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 ${isInWishlist(product._id) ? "text-destructive" : "text-white hover:text-destructive"
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (isInWishlist(product._id)) {
                                        removeFromWishlist(product._id);
                                    } else {
                                        addToWishlist({
                                            _id: product._id,
                                            title: product.title,
                                            amount: product.amount,
                                            discountedAmount: product.discountedAmount,
                                            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                                            category: product.category.name,
                                            inStock: product.inStock,
                                        });
                                    }
                                }}
                            >
                                <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? "fill-current" : ""}`} />
                            </Button>
                        </div>
                    </figure>

                    {/* Product Details */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < Math.floor(product.averageRating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "fill-muted text-muted"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                ({product.numOfReviews})
                            </span>
                        </div>

                        {/* Product Title */}
                        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug hover:text-primary transition-colors flex-1">
                            {product.title}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex items-center price-badge">
                                <IndianRupee className="h-4 w-4" />
                                <span className="text-xl">
                                    {(product.discountedAmount || product.amount).toLocaleString('en-IN')}
                                </span>
                            </div>
                            {product.discountedAmount && product.discountedAmount < product.amount && (
                                <div className="flex items-center">
                                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground line-through">
                                        {product.amount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Savings Info */}
                        {product.discountPercent && product.discountPercent > 0 && (
                            <div className="pt-1">
                                <span className="text-xs font-semibold text-accent">
                                    Save {Math.round(product.discountPercent)}%
                                </span>
                            </div>
                        )}
                    </div>
                </article>
            </Link>
        </li>
    );
};

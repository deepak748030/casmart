import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Heart,
    ShoppingBag,
    Star,
    IndianRupee,
    Minus,
    Plus,
    ChevronLeft,
    Truck,
    Shield,
    RotateCcw,
    Loader2,
} from "lucide-react";
import { getProductById, getProductImageUrl, type Product } from "@/api/productApi";
import { useToast } from "@/hooks/use-toast";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const productImages = [product1, product2, product3, product4];

const product = {
    name: "Varsi Premium Leather Bag",
    price: 3899,
    oldPrice: 5199,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    sku: "VAR-LB-001",
    category: "Bags & Accessories",
    description:
        "Crafted from premium full-grain leather, this versatile bag combines timeless elegance with modern functionality. Perfect for daily use or special occasions, featuring multiple compartments and adjustable straps for maximum comfort.",
    features: [
        "100% Premium Full-Grain Leather",
        "Multiple Interior & Exterior Pockets",
        "Adjustable Leather Straps",
        "YKK Premium Zippers",
        "Water-Resistant Lining",
        "Dimensions: 35 x 28 x 12 cm",
    ],
    colors: [
        { name: "Black", value: "#000000" },
        { name: "Brown", value: "#8B4513" },
        { name: "Tan", value: "#D2B48C" },
    ],
    sizes: ["Small", "Medium", "Large"],
};

const relatedProducts = [
    {
        image: product5,
        name: "Soft Touch Interlock Polo",
        price: 3600,
        rating: 4.4,
    },
    {
        image: product6,
        name: "Casmart Smart Watch",
        price: 2400,
        oldPrice: 3040,
        rating: 4.7,
    },
    {
        image: product2,
        name: "Fit Twill Shirt for Woman",
        price: 4960,
        rating: 4.8,
    },
    {
        image: product3,
        name: "Grand Atlantic Chukka Boots",
        price: 2560,
        rating: 4.3,
    },
];

const reviews = [
    {
        author: "Priya Sharma",
        rating: 5,
        date: "2 weeks ago",
        comment:
            "Absolutely love this bag! The leather quality is exceptional and it's so versatile. Worth every rupee.",
        verified: true,
    },
    {
        author: "Rahul Mehta",
        rating: 4,
        date: "1 month ago",
        comment:
            "Great quality and design. The only minor issue is that it took a while to break in, but now it's perfect.",
        verified: true,
    },
    {
        author: "Ananya Patel",
        rating: 5,
        date: "1 month ago",
        comment:
            "This is my third purchase from this brand. Never disappoints! The craftsmanship is outstanding.",
        verified: true,
    },
];

export default function ProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await getProductById(id!);
            setProduct(response.data.product);
            if (response.data.product.sizes.length > 0) {
                setSelectedSize(response.data.product.sizes[0]);
            }
        } catch (error: any) {
            console.error("Error fetching product:", error);
            toast({
                title: "Error",
                description: "Failed to load product",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                        <Button onClick={() => navigate("/")}>Go to Home</Button>
                    </div>
                </div>
            </>
        );
    }

    const discount = product.discountedAmount && product.amount
        ? Math.round(((product.amount - product.discountedAmount) / product.amount) * 100)
        : 0;

    const productImages = product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls.map(url => `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`)
        : [getProductImageUrl(product._id, 0)];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 pt-16 md:pt-24">


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 mb-8 md:mb-16">
                        {/* Image Gallery */}
                        <div className="space-y-3 md:space-y-4">
                            <div className="relative aspect-square bg-muted/30 overflow-hidden">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                    }}
                                />
                                {discount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute top-6 left-6 text-sm font-bold px-4 py-2"
                                    >
                                        -{discount}%
                                    </Badge>
                                )}
                            </div>

                            {/* Thumbnail Grid */}
                            {productImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 md:gap-4">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square bg-muted/30 overflow-hidden transition-all duration-300 ${selectedImage === index
                                                ? "ring-2 ring-primary scale-95"
                                                : "hover:opacity-80"
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.title} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3 md:space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1 md:mb-2">
                                    {product.category.name}
                                </p>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                                    {product.title}
                                </h1>

                                {/* Rating */}
                                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <div className="flex items-center gap-0.5 md:gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.floor(product.averageRating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "fill-muted text-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {product.averageRating}
                                        </span>
                                        <span className="text-xs md:text-sm text-muted-foreground">
                                            ({product.numOfReviews} reviews)
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex flex-wrap items-baseline gap-2 md:gap-4 mb-2">
                                    <div className="flex items-center">
                                        <IndianRupee className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                                        <span className="text-3xl md:text-4xl font-bold text-foreground">
                                            {(product.discountedAmount || product.amount).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    {product.discountedAmount && product.discountedAmount < product.amount && (
                                        <div className="flex items-center">
                                            <IndianRupee className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                                            <span className="text-lg md:text-xl text-muted-foreground line-through">
                                                {product.amount.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {product.discountedAmount && product.discountedAmount < product.amount && (
                                    <p className="text-accent font-semibold mb-4 md:mb-6 text-sm md:text-base">
                                        You save ₹{(product.amount - product.discountedAmount).toLocaleString("en-IN")} ({discount}% off)
                                    </p>
                                )}

                                <p className="text-foreground/80 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
                                    {product.description}
                                </p>
                            </div>


                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold mb-3">
                                        Size: <span className="text-foreground">{selectedSize}</span>
                                    </label>
                                    <div className="flex gap-3 flex-wrap">
                                        {product.sizes.map((size) => (
                                            <Button
                                                key={size}
                                                variant={selectedSize === size ? "default" : "outline"}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[80px] transition-all duration-300 ${selectedSize === size
                                                    ? "shadow-glow scale-105"
                                                    : "hover:scale-105"
                                                    }`}
                                            >
                                                {size}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-border">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="h-12 w-12"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-16 text-center font-semibold text-lg">
                                            {quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="h-12 w-12"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Badge
                                        variant={product.inStock ? "default" : "destructive"}
                                        className="px-4 py-2"
                                    >
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    size="lg"
                                    className="flex-1 h-14 text-lg font-semibold shadow-glow hover:shadow-strong transition-all duration-300"
                                    disabled={!product.inStock}
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    size="lg"
                                    variant={isWishlisted ? "default" : "outline"}
                                    className="h-14 w-14 transition-all duration-300"
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                                    />
                                </Button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-6 border-t border-border">
                                <div className="flex flex-col items-center text-center gap-1 md:gap-2 p-2 md:p-4">
                                    <Truck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                                    <p className="text-[10px] md:text-xs font-semibold">Free Shipping</p>
                                    <p className="text-[9px] md:text-xs text-muted-foreground leading-tight">
                                        On orders over ₹2000
                                    </p>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1 md:gap-2 p-2 md:p-4">
                                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                                    <p className="text-[10px] md:text-xs font-semibold">Secure Payment</p>
                                    <p className="text-[9px] md:text-xs text-muted-foreground leading-tight">
                                        100% Protected
                                    </p>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1 md:gap-2 p-2 md:p-4">
                                    <RotateCcw className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                                    <p className="text-[10px] md:text-xs font-semibold">Easy Returns</p>
                                    <p className="text-[9px] md:text-xs text-muted-foreground leading-tight">
                                        30-day policy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <Tabs defaultValue="description" className="mb-8 md:mb-16">
                        <TabsList className="w-full justify-start border-b h-auto bg-transparent p-0 space-x-8">
                            <TabsTrigger
                                value="description"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="specifications"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-4"
                            >
                                Specifications
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="py-8">
                            <div className="max-w-3xl">
                                <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                                <p className="text-foreground/80 leading-relaxed mb-6">
                                    {product.description}
                                </p>
                                {product.keyFeatures && product.keyFeatures.length > 0 && (
                                    <>
                                        <h4 className="text-xl font-semibold mb-4">Key Features</h4>
                                        <ul className="space-y-3">
                                            {product.keyFeatures.map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-3 text-foreground/80"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-primary mt-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="specifications" className="py-8">
                            <div className="max-w-3xl">
                                <h3 className="text-2xl font-bold mb-6">
                                    Product Specifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-6">
                                        <p className="text-sm text-muted-foreground mb-1">SKU</p>
                                        <p className="font-semibold">{product.SKU}</p>
                                    </div>
                                    <div className="bg-muted/30 p-6">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Category
                                        </p>
                                        <p className="font-semibold">{product.category.name}</p>
                                    </div>
                                    <div className="bg-muted/30 p-6">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Stock
                                        </p>
                                        <p className="font-semibold">{product.totalStocks} units</p>
                                    </div>
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="bg-muted/30 p-6">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                Available Sizes
                                            </p>
                                            <p className="font-semibold">{product.sizes.join(", ")}</p>
                                        </div>
                                    )}
                                    {product.specifications && product.specifications.map((spec, index) => (
                                        <div key={index} className="bg-muted/30 p-6">
                                            <p className="text-sm text-muted-foreground mb-1">{spec.name}</p>
                                            <p className="font-semibold">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                    </Tabs>

                    {/* Related Products */}
                    <div className="pb-8 md:pb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center gradient-text">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((item, index) => (
                                <div
                                    key={index}
                                    className="group bg-card overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-2 border border-border/50"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < Math.floor(item.rating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "fill-muted text-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <h3 className="font-semibold text-foreground line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                <IndianRupee className="h-4 w-4 text-foreground" />
                                                <span className="text-xl font-bold text-foreground">
                                                    {item.price.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                            {item.oldPrice && (
                                                <div className="flex items-center">
                                                    <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {item.oldPrice.toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Product, getProductImageUrl } from "@/api/productApi";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductPreviewDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductPreviewDialog({
    product,
    open,
    onOpenChange,
}: ProductPreviewDialogProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    // Update current slide when carousel changes
    useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    if (!product) return null;

    const hasDiscount = product.discountedAmount && product.discountedAmount < product.amount;

    // Get the number of images
    const imageCount = product.imageUrls?.length || 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-100px)] pr-4">
                    <div className="space-y-6">
                        {/* Images */}
                        {imageCount > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Product Images</h3>
                                    <Badge variant="secondary">
                                        {imageCount} {imageCount === 1 ? 'image' : 'images'}
                                    </Badge>
                                </div>

                                {/* Main Carousel */}
                                <Carousel className="w-full" setApi={setApi}>
                                    <CarouselContent>
                                        {Array.from({ length: imageCount }).map((_, index) => (
                                            <CarouselItem key={index}>
                                                <div className="flex justify-center bg-muted/30 rounded-lg p-4">
                                                    <img
                                                        src={getProductImageUrl(product._id, index)}
                                                        alt={`${product.title} - Image ${index + 1}`}
                                                        className="rounded-lg max-h-96 object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/placeholder.svg";
                                                        }}
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {imageCount > 1 && (
                                        <>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </>
                                    )}
                                </Carousel>

                                {/* Image counter */}
                                {imageCount > 1 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        Image {current + 1} of {imageCount}
                                    </p>
                                )}

                                {/* Thumbnail Grid */}
                                {imageCount > 1 && (
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({ length: imageCount }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => api?.scrollTo(index)}
                                                className={cn(
                                                    "relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:opacity-80",
                                                    current === index
                                                        ? "border-primary ring-2 ring-primary ring-offset-2"
                                                        : "border-transparent"
                                                )}
                                            >
                                                <img
                                                    src={getProductImageUrl(product._id, index)}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/placeholder.svg";
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <Separator />

                        {/* Basic Information */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Title</p>
                                    <p className="font-medium">{product.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm">{product.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">SKU</p>
                                        <p className="font-medium">{product.SKU}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Category</p>
                                        <Badge>{product.category.name}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Pricing */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Pricing</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Original Price</p>
                                    <p className={`font-medium ${hasDiscount ? 'line-through text-muted-foreground' : ''}`}>
                                        ₹{product.amount.toFixed(2)}
                                    </p>
                                </div>
                                {hasDiscount && (
                                    <>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Discounted Price</p>
                                            <p className="font-medium text-primary">
                                                ₹{product.discountedAmount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Discount</p>
                                            <Badge variant="secondary">
                                                {product.discountPercent?.toFixed(0)}% OFF
                                            </Badge>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Inventory */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Inventory</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Stock</p>
                                    <p className="font-medium">{product.totalStocks} units</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={product.inStock ? "default" : "destructive"}>
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Available Sizes</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {product.sizes.map((size) => (
                                            <Badge key={size} variant="outline">
                                                {size}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Variants</h3>
                                    <div className="space-y-3">
                                        {product.variants.map((variant, index) => (
                                            <Card key={index} className="p-4">
                                                <div className="grid grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Type</p>
                                                        <p className="font-medium">{variant.type}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Value</p>
                                                        <Badge>{variant.value}</Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Price Adjustment</p>
                                                        <p className={`font-medium ${variant.priceAdjustment > 0 ? 'text-primary' : variant.priceAdjustment < 0 ? 'text-destructive' : ''}`}>
                                                            {variant.priceAdjustment > 0 ? '+' : ''}₹{variant.priceAdjustment}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Stock</p>
                                                        <p className="font-medium">{variant.stock} units</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Specifications */}
                        {product.specifications && product.specifications.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                                    <div className="space-y-2">
                                        {product.specifications.map((spec, index) => (
                                            <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b last:border-0">
                                                <p className="text-sm font-medium">{spec.name}</p>
                                                <p className="text-sm text-muted-foreground">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Key Features */}
                        {product.keyFeatures && product.keyFeatures.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Key Features</h3>
                                    <ul className="space-y-2">
                                        {product.keyFeatures.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        {/* Reviews */}
                        {product.numOfReviews > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-4">Reviews</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Average Rating</p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-2xl">{product.averageRating}</p>
                                                <span className="text-yellow-500">★</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Reviews</p>
                                            <p className="font-medium text-2xl">{product.numOfReviews}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Timestamps */}
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-4">Timestamps</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Created At</p>
                                    <p>{new Date(product.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Updated At</p>
                                    <p>{new Date(product.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Product } from "@/api/productApi";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
    if (!product) return null;

    const hasDiscount = product.discountedAmount && product.discountedAmount < product.amount;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-100px)] pr-4">
                    <div className="space-y-6">
                        {/* Images */}
                        {product.imageUrls && product.imageUrls.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-4">Product Images</h3>
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {product.imageUrls.map((imageUrl, index) => (
                                            <CarouselItem key={index}>
                                                <div className="flex justify-center">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`${product.title} - ${index + 1}`}
                                                        className="rounded-lg max-h-96 object-contain"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    {product.imageUrls.length > 1 && (
                                        <>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </>
                                    )}
                                </Carousel>
                                <p className="text-sm text-muted-foreground text-center mt-2">
                                    {product.imageUrls.length} {product.imageUrls.length === 1 ? 'image' : 'images'}
                                </p>
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

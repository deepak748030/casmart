import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { type Product } from "@/api/productApi";
import { type Category } from "@/api/categoryApi";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

const variantSchema = z.object({
    type: z.string().min(1, "Variant type is required"),
    value: z.string().min(1, "Variant value is required"),
    priceAdjustment: z.coerce.number().default(0),
    stock: z.coerce.number().min(0, "Stock must be positive").default(0),
});

const specificationSchema = z.object({
    name: z.string().min(1, "Specification name is required"),
    value: z.string().min(1, "Specification value is required"),
});

const productSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
    description: z.string().min(1, "Description is required").max(1000, "Description cannot exceed 1000 characters"),
    amount: z.coerce.number().min(0, "Price must be positive"),
    discountedAmount: z.coerce.number().min(0).optional(),
    category: z.string().min(1, "Category is required"),
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    totalStocks: z.coerce.number().min(0, "Stock must be positive"),
    SKU: z.string().min(1, "SKU is required").toUpperCase(),
    variants: z.array(variantSchema).optional(),
    specifications: z.array(specificationSchema).optional(),
    keyFeatures: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ExistingImage {
    index: number;
    url: string;
}

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingProduct: Product | null;
    categories: Category[];
    onSubmit: (data: ProductFormValues, images: File[], imagesToKeep: number[]) => Promise<void>;
    submitting: boolean;
}

export default function ProductFormDialog({
    open,
    onOpenChange,
    editingProduct,
    categories,
    onSubmit,
    submitting,
}: ProductFormDialogProps) {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
    const [imagesToKeep, setImagesToKeep] = useState<number[]>([]);
    const [keyFeatureInput, setKeyFeatureInput] = useState("");

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            amount: 0,
            discountedAmount: undefined,
            category: "",
            sizes: [],
            totalStocks: 0,
            SKU: "",
            variants: [],
            specifications: [],
            keyFeatures: [],
        },
    });

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control: form.control,
        name: "variants",
    });

    const {
        fields: specificationFields,
        append: appendSpecification,
        remove: removeSpecification,
    } = useFieldArray({
        control: form.control,
        name: "specifications",
    });

    useEffect(() => {
        if (open && editingProduct) {
            // Populate form with existing product data
            form.reset({
                title: editingProduct.title,
                description: editingProduct.description,
                amount: editingProduct.amount,
                discountedAmount: editingProduct.discountedAmount,
                category: editingProduct.category._id,
                sizes: editingProduct.sizes,
                totalStocks: editingProduct.totalStocks,
                SKU: editingProduct.SKU,
                variants: editingProduct.variants || [],
                specifications: editingProduct.specifications || [],
                keyFeatures: editingProduct.keyFeatures || [],
            });

            // Set existing images
            if (editingProduct.imageUrls) {
                const images = editingProduct.imageUrls.map((url, index) => ({
                    index,
                    url,
                }));
                setExistingImages(images);
                setImagesToKeep(images.map((img) => img.index));
            }
        } else if (open) {
            // Reset for new product
            form.reset({
                title: "",
                description: "",
                amount: 0,
                discountedAmount: undefined,
                category: "",
                sizes: [],
                totalStocks: 0,
                SKU: "",
                variants: [],
                specifications: [],
                keyFeatures: [],
            });
            setExistingImages([]);
            setImagesToKeep([]);
            setSelectedImages([]);
        }
    }, [open, editingProduct, form]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedImages((prev) => [...prev, ...newFiles]);
        }
    };

    const removeSelectedImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleExistingImage = (index: number) => {
        setImagesToKeep((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const toggleSize = (size: string) => {
        const currentSizes = form.getValues("sizes");
        if (currentSizes.includes(size)) {
            form.setValue(
                "sizes",
                currentSizes.filter((s) => s !== size)
            );
        } else {
            form.setValue("sizes", [...currentSizes, size]);
        }
    };

    const addKeyFeature = () => {
        if (keyFeatureInput.trim()) {
            const currentFeatures = form.getValues("keyFeatures") || [];
            form.setValue("keyFeatures", [...currentFeatures, keyFeatureInput.trim()]);
            setKeyFeatureInput("");
        }
    };

    const removeKeyFeature = (index: number) => {
        const currentFeatures = form.getValues("keyFeatures") || [];
        form.setValue(
            "keyFeatures",
            currentFeatures.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (values: ProductFormValues) => {
        await onSubmit(values, selectedImages, imagesToKeep);
        setSelectedImages([]);
        setExistingImages([]);
        setImagesToKeep([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {editingProduct ? "Edit Product" : "Create Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingProduct
                            ? "Update product information including images, variants, and specifications"
                            : "Add a new product with all details"}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-180px)] pr-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Basic Information</h3>
                                <Separator />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Product description"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="SKU"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="PROD-001" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Stock Keeping Unit (unique identifier)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category._id} value={category._id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Pricing</h3>
                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (₹) *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" placeholder="0" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="discountedAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discounted Price (₹)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" placeholder="0" {...field} />
                                                </FormControl>
                                                <FormDescription>Leave empty if no discount</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Inventory */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Inventory</h3>
                                <Separator />

                                <FormField
                                    control={form.control}
                                    name="totalStocks"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Stock *</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sizes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sizes *</FormLabel>
                                            <div className="flex flex-wrap gap-2">
                                                {AVAILABLE_SIZES.map((size) => (
                                                    <Badge
                                                        key={size}
                                                        variant={field.value.includes(size) ? "default" : "outline"}
                                                        className="cursor-pointer"
                                                        onClick={() => toggleSize(size)}
                                                    >
                                                        {size}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <FormDescription>Click to select sizes</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Images</h3>
                                <Separator />

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div>
                                        <FormLabel>Existing Images</FormLabel>
                                        <div className="grid grid-cols-4 gap-4 mt-2">
                                            {existingImages.map((img) => (
                                                <div
                                                    key={img.index}
                                                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${imagesToKeep.includes(img.index)
                                                            ? "border-primary"
                                                            : "border-border opacity-50"
                                                        }`}
                                                    onClick={() => toggleExistingImage(img.index)}
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={`Existing ${img.index}`}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    {!imagesToKeep.includes(img.index) && (
                                                        <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                                                            <X className="h-6 w-6 text-destructive" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <FormDescription className="mt-2">
                                            Click images to toggle removal
                                        </FormDescription>
                                    </div>
                                )}

                                {/* New Images */}
                                <div>
                                    <FormLabel>Upload New Images</FormLabel>
                                    <div className="mt-2">
                                        <label
                                            htmlFor="image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                Click to upload images
                                            </p>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageSelect}
                                            />
                                        </label>
                                    </div>

                                    {selectedImages.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4 mt-4">
                                            {selectedImages.map((file, index) => (
                                                <div key={index} className="relative border rounded-lg overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`New ${index}`}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6"
                                                        onClick={() => removeSelectedImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Variants */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">Variants</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            appendVariant({ type: "", value: "", priceAdjustment: 0, stock: 0 })
                                        }
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Variant
                                    </Button>
                                </div>
                                <Separator />

                                {variantFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-5 gap-4 items-start border p-4 rounded-lg">
                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Color" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Value</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Red" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.priceAdjustment`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price +/-</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" placeholder="0" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.stock`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="0" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeVariant(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Specifications */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg">Specifications</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendSpecification({ name: "", value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Specification
                                    </Button>
                                </div>
                                <Separator />

                                {specificationFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-3 gap-4 items-start border p-4 rounded-lg">
                                        <FormField
                                            control={form.control}
                                            name={`specifications.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Material" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`specifications.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Value</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., 100% Cotton" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSpecification(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Key Features */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Key Features</h3>
                                <Separator />

                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter a key feature"
                                        value={keyFeatureInput}
                                        onChange={(e) => setKeyFeatureInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addKeyFeature();
                                            }
                                        }}
                                    />
                                    <Button type="button" variant="secondary" onClick={addKeyFeature}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {form.watch("keyFeatures")?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {form.watch("keyFeatures").map((feature, index) => (
                                            <Badge key={index} variant="secondary" className="pl-3 pr-1">
                                                {feature}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 ml-2"
                                                    onClick={() => removeKeyFeature(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </Form>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button onClick={form.handleSubmit(handleSubmit)} disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

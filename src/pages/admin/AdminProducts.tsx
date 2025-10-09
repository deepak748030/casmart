import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductImageUrl,
    type Product,
} from "@/api/productApi";
import { getCategories, type Category } from "@/api/categoryApi";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const productSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required"),
    amount: z.coerce.number().min(0, "Price must be positive"),
    discountedAmount: z.coerce.number().min(0).optional(),
    category: z.string().min(1, "Category is required"),
    sizes: z.string()
        .min(1, "At least one size required")
        .regex(/^[a-zA-Z\s,]+$/, "Only letters and commas allowed"),
    totalStocks: z.coerce.number().min(0, "Stock must be positive"),
    SKU: z.string().min(1, "SKU is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
    const { toast } = useToast();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            amount: 0,
            discountedAmount: 0,
            category: "",
            sizes: "",
            totalStocks: 0,
            SKU: "",
        },
    });

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts({ limit: 100 });
            setProducts(response.data.products);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load products",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const categories = await getCategories();
            setCategories(categories);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    const handleCreate = () => {
        setEditingProduct(null);
        form.reset({
            title: "",
            description: "",
            amount: 0,
            discountedAmount: 0,
            category: "",
            sizes: "",
            totalStocks: 0,
            SKU: "",
        });
        setSelectedImages(null);
        setDialogOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.reset({
            title: product.title,
            description: product.description,
            amount: product.amount,
            discountedAmount: product.discountedAmount || 0,
            category: product.category._id,
            sizes: product.sizes.join(", "),
            totalStocks: product.totalStocks,
            SKU: product.SKU,
        });
        setSelectedImages(null);
        setDialogOpen(true);
    };

    const handleDelete = (product: Product) => {
        setDeletingProduct(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingProduct) return;

        try {
            await deleteProduct(deletingProduct._id);
            toast({
                title: "Success",
                description: "Product deleted successfully",
            });
            loadProducts();
            setDeleteDialogOpen(false);
            setDeletingProduct(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive",
            });
        }
    };

    const onSubmit = async (values: ProductFormValues) => {
        try {
            setSubmitting(true);

            // Clean and parse sizes - remove unwanted characters, keep only alphabets
            const cleanedSizes = values.sizes
                .replace(/[^a-zA-Z,\s]/g, '') // Remove anything that's not letter, comma, or space
                .split(',')
                .map(size => size.trim().toUpperCase())
                .filter(size => size.length > 0);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("amount", values.amount.toString());
            if (values.discountedAmount && values.discountedAmount > 0) {
                formData.append("discountedAmount", values.discountedAmount.toString());
            }
            formData.append("category", values.category);
            formData.append("sizes", JSON.stringify(cleanedSizes));
            formData.append("totalStocks", values.totalStocks.toString());
            formData.append("SKU", values.SKU);

            if (selectedImages) {
                Array.from(selectedImages).forEach((file) => {
                    formData.append("images", file);
                });
            }

            if (editingProduct) {
                await updateProduct(editingProduct._id, formData);
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                });
            } else {
                await createProduct(formData);
                toast({
                    title: "Success",
                    description: "Product created successfully",
                });
            }

            setDialogOpen(false);
            loadProducts();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${editingProduct ? "update" : "create"} product`,
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Products</h2>
                    <p className="text-muted-foreground">Manage your product catalog</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            <img
                                                src={getProductImageUrl(product._id, 0)}
                                                alt={product.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.title}</TableCell>
                                        <TableCell>{product.SKU}</TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>
                                            ₹{product.discountedAmount || product.amount}
                                            {product.discountedAmount && (
                                                <span className="text-xs text-muted-foreground line-through ml-2">
                                                    ₹{product.amount}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{product.totalStocks}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${product.inStock
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                    }`}
                                            >
                                                {product.inStock ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(product)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct ? "Edit Product" : "Create Product"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProduct
                                ? "Update product information"
                                : "Add a new product to your catalog"}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
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
                                        <FormLabel>Description</FormLabel>
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
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" {...field} />
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
                                                <Input type="number" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
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

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="sizes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sizes</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="S, M, L, XL"
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Remove unwanted characters on input
                                                        const cleaned = e.target.value.replace(/[^a-zA-Z,\s]/g, '');
                                                        field.onChange(cleaned);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground">
                                                Enter sizes separated by commas (letters only)
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="totalStocks"
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
                            </div>

                            <FormField
                                control={form.control}
                                name="SKU"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl>
                                            <Input placeholder="PROD-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Product Images</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setSelectedImages(e.target.files)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload product images (optional)
                                </p>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingProduct ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingProduct?.title}"? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

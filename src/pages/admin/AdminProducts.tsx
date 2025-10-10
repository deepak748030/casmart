import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Eye, Search, X } from "lucide-react";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductImageUrl,
    type Product,
    type ProductQueryParams,
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
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import ProductPreviewDialog from "@/components/admin/ProductPreviewDialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [stockFilter, setStockFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("all");

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [searchQuery, selectedCategory, stockFilter, sortBy]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const params: ProductQueryParams = {
                limit: 100,
            };

            if (searchQuery) params.search = searchQuery;
            if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory;
            if (stockFilter === "in-stock") params.inStock = true;
            if (stockFilter === "out-of-stock") params.inStock = false;
            if (sortBy && sortBy !== "all") params.sort = sortBy;

            const response = await getAllProducts(params);
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
        setDialogOpen(true);
    };

    const handleEdit = async (product: Product) => {
        try {
            // Fetch full product details to get all images and variants
            const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setEditingProduct(data.data.product);
            setDialogOpen(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load product details",
                variant: "destructive",
            });
        }
    };

    const handlePreview = async (product: Product) => {
        try {
            // Fetch full product details
            const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setPreviewProduct(data.data.product);
            setPreviewDialogOpen(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load product details",
                variant: "destructive",
            });
        }
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

    const handleFormSubmit = async (
        values: any,
        images: File[],
        imagesToKeep: number[]
    ) => {
        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("amount", values.amount.toString());
            if (values.discountedAmount && values.discountedAmount > 0) {
                formData.append("discountedAmount", values.discountedAmount.toString());
            }
            formData.append("category", values.category);
            formData.append("sizes", JSON.stringify(values.sizes));
            formData.append("totalStocks", values.totalStocks.toString());
            formData.append("SKU", values.SKU);

            // Add variants
            if (values.variants && values.variants.length > 0) {
                formData.append("variants", JSON.stringify(values.variants));
            }

            // Add specifications
            if (values.specifications && values.specifications.length > 0) {
                formData.append("specifications", JSON.stringify(values.specifications));
            }

            // Add key features
            if (values.keyFeatures && values.keyFeatures.length > 0) {
                formData.append("keyFeatures", JSON.stringify(values.keyFeatures));
            }

            // Add images to keep (for update)
            if (editingProduct && imagesToKeep.length > 0) {
                formData.append("imagesToKeep", JSON.stringify(imagesToKeep));
            }

            // Add new images as individual fields (image0, image1, ...)
            if (images && images.length > 0) {
                images.forEach((file, index) => {
                    formData.append(`image${index}`, file);
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
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${editingProduct ? "update" : "create"} product`,
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setStockFilter("all");
        setSortBy("all");
    };

    const hasActiveFilters = searchQuery || (selectedCategory !== "all") || (stockFilter !== "all") || (sortBy !== "all");

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

            {/* Filters */}
            <Card className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Filters</h3>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <X className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Stock Status</label>
                            <Select value={stockFilter} onValueChange={setStockFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All products" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All products</SelectItem>
                                    <SelectItem value="in-stock">In Stock</SelectItem>
                                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Sort By</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Default" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Default</SelectItem>
                                    <SelectItem value="title">Name (A-Z)</SelectItem>
                                    <SelectItem value="-title">Name (Z-A)</SelectItem>
                                    <SelectItem value="amount">Price (Low to High)</SelectItem>
                                    <SelectItem value="-amount">Price (High to Low)</SelectItem>
                                    <SelectItem value="-createdAt">Newest First</SelectItem>
                                    <SelectItem value="createdAt">Oldest First</SelectItem>
                                    <SelectItem value="-totalStocks">Stock (High to Low)</SelectItem>
                                    <SelectItem value="totalStocks">Stock (Low to High)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Products Table */}
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
                                    <TableCell colSpan={8} className="text-center text-muted-foreground h-32">
                                        No products found
                                        {hasActiveFilters && (
                                            <div className="mt-2">
                                                <Button variant="link" onClick={clearFilters}>
                                                    Clear filters
                                                </Button>
                                            </div>
                                        )}
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
                                                onError={(e) => {
                                                    e.currentTarget.src = "/placeholder.svg";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {product.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.SKU}</Badge>
                                        </TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    ₹{product.discountedAmount || product.amount}
                                                </span>
                                                {product.discountedAmount && product.discountedAmount < product.amount && (
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        ₹{product.amount}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.totalStocks}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={product.inStock ? "default" : "destructive"}
                                            >
                                                {product.inStock ? "In Stock" : "Out of Stock"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handlePreview(product)}
                                                    title="Preview"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(product)}
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(product)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create/Edit Dialog */}
            <ProductFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingProduct={editingProduct}
                categories={categories}
                onSubmit={handleFormSubmit}
                submitting={submitting}
            />

            {/* Preview Dialog */}
            <ProductPreviewDialog
                product={previewProduct}
                open={previewDialogOpen}
                onOpenChange={setPreviewDialogOpen}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete "{deletingProduct?.title}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

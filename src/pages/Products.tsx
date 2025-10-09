import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, Product, getProductImageUrl } from '@/api/productApi';
import { getCategories, Category } from '@/api/categoryApi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Star, ShoppingCart, Filter, X, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Products = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalProducts, setTotalProducts] = useState(0);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [maxPrice] = useState(10000);
    const [inStock, setInStock] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('-createdAt');
    const [showFilters, setShowFilters] = useState(true);

    // Collapsible filter sections
    const [categoryOpen, setCategoryOpen] = useState(true);
    const [priceOpen, setPriceOpen] = useState(true);
    const [stockOpen, setStockOpen] = useState(true);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const fetchProducts = useCallback(async (pageNum: number, append = false) => {
        try {
            if (!append) setLoading(true);
            else setLoadingMore(true);

            const params: any = {
                page: pageNum,
                limit: 12,
                sort: sortBy,
            };

            if (selectedCategories.length > 0) {
                params.category = selectedCategories.join(',');
            }

            if (priceRange[0] > 0) {
                params['amount[gte]'] = priceRange[0];
            }
            if (priceRange[1] < maxPrice) {
                params['amount[lte]'] = priceRange[1];
            }

            if (inStock !== undefined) {
                params.inStock = inStock;
            }

            const response = await getAllProducts(params);
            const newProducts = response.data.products;

            if (append) {
                setProducts(prev => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            setTotalProducts(response.total);
            setHasMore(newProducts.length === 12);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: 'Error',
                description: 'Failed to load products',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategories, priceRange, maxPrice, inStock, sortBy]);

    useEffect(() => {
        setPage(1);
        fetchProducts(1, false);
    }, [fetchProducts]);

    useEffect(() => {
        if (loading || loadingMore || !hasMore) return;

        observerRef.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchProducts(nextPage, true);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loading, loadingMore, hasMore, fetchProducts]);

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        setSelectedCategories(prev =>
            checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
        );
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            _id: product._id,
            title: product.title,
            amount: product.amount,
            discountedAmount: product.discountedAmount,
            imageUrl: getProductImageUrl(product._id),
            category: product.category.name,
            inStock: product.inStock,
        });
        toast({
            title: 'Added to cart',
            description: `${product.title} has been added to your cart`,
        });
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, maxPrice]);
        setInStock(undefined);
        setSortBy('-createdAt');
    };

    const activeFiltersCount =
        selectedCategories.length +
        (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
        (inStock !== undefined ? 1 : 0);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background">
                {/* Page Header */}


                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <aside className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <Filter className="h-5 w-5" />
                                            Filters
                                        </h2>
                                        {activeFiltersCount > 0 && (
                                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                                <X className="h-4 w-4 mr-1" />
                                                Clear
                                            </Button>
                                        )}
                                    </div>

                                    <ScrollArea className="h-[calc(100vh-300px)]">
                                        <div className="space-y-6 pr-4">
                                            {/* Categories Filter */}
                                            <div>
                                                <button
                                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                                    className="w-full flex items-center justify-between mb-3 font-medium"
                                                >
                                                    Categories
                                                    {categoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </button>
                                                {categoryOpen && (
                                                    <div className="space-y-3 animate-fade-in">
                                                        {categories.map(category => (
                                                            <div key={category._id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={category._id}
                                                                    checked={selectedCategories.includes(category._id)}
                                                                    onCheckedChange={(checked) =>
                                                                        handleCategoryChange(category._id, checked as boolean)
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={category._id}
                                                                    className="text-sm cursor-pointer flex-1"
                                                                >
                                                                    {category.name}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <Separator className="mt-4" />
                                            </div>

                                            {/* Price Range Filter */}
                                            <div>
                                                <button
                                                    onClick={() => setPriceOpen(!priceOpen)}
                                                    className="w-full flex items-center justify-between mb-3 font-medium"
                                                >
                                                    Price Range
                                                    {priceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </button>
                                                {priceOpen && (
                                                    <div className="space-y-4 animate-fade-in">
                                                        <Slider
                                                            min={0}
                                                            max={maxPrice}
                                                            step={100}
                                                            value={priceRange}
                                                            onValueChange={(value) => setPriceRange(value as [number, number])}
                                                            className="my-6"
                                                        />
                                                        <div className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-0.5 font-medium">
                                                                <IndianRupee className="h-3 w-3" />
                                                                <span>{priceRange[0]}</span>
                                                            </div>
                                                            <span className="text-muted-foreground">to</span>
                                                            <div className="flex items-center gap-0.5 font-medium">
                                                                <IndianRupee className="h-3 w-3" />
                                                                <span>{priceRange[1]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <Separator className="mt-4" />
                                            </div>

                                            {/* Stock Status Filter */}
                                            <div>
                                                <button
                                                    onClick={() => setStockOpen(!stockOpen)}
                                                    className="w-full flex items-center justify-between mb-3 font-medium"
                                                >
                                                    Availability
                                                    {stockOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </button>
                                                {stockOpen && (
                                                    <div className="space-y-3 animate-fade-in">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="all-stock"
                                                                checked={inStock === undefined}
                                                                onCheckedChange={() => setInStock(undefined)}
                                                            />
                                                            <Label htmlFor="all-stock" className="text-sm cursor-pointer">
                                                                All Products
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="in-stock"
                                                                checked={inStock === true}
                                                                onCheckedChange={() => setInStock(true)}
                                                            />
                                                            <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                                                                In Stock Only
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="out-stock"
                                                                checked={inStock === false}
                                                                onCheckedChange={() => setInStock(false)}
                                                            />
                                                            <Label htmlFor="out-stock" className="text-sm cursor-pointer">
                                                                Out of Stock
                                                            </Label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1">
                            {/* Sort Options */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm text-muted-foreground">
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="secondary" className="mr-2">
                                            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                                        </Badge>
                                    )}
                                </p>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="-createdAt">Newest First</SelectItem>
                                        <SelectItem value="createdAt">Oldest First</SelectItem>
                                        <SelectItem value="amount">Price: Low to High</SelectItem>
                                        <SelectItem value="-amount">Price: High to Low</SelectItem>
                                        <SelectItem value="-averageRating">Rating: High to Low</SelectItem>
                                        <SelectItem value="title">Name: A to Z</SelectItem>
                                        <SelectItem value="-title">Name: Z to A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Products */}
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <Skeleton className="w-full h-64" />
                                            <CardContent className="p-4 space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-6 w-1/2" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {products.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-muted-foreground">No products found</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {products.map((product) => (
                                                <Card key={product._id} className="group overflow-hidden hover-lift">
                                                    <Link to={`/product/${product._id}`}>
                                                        <div className="relative aspect-square overflow-hidden bg-muted">
                                                            <img
                                                                src={getProductImageUrl(product._id)}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                                                }}
                                                            />
                                                            {!product.inStock && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="absolute top-2 right-2 bg-background/90"
                                                                >
                                                                    Out of Stock
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </Link>

                                                    <CardContent className="p-4 space-y-3">
                                                        <Link to={`/product/${product._id}`}>
                                                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                                                {product.title}
                                                            </h3>
                                                        </Link>

                                                        <div className="flex items-center gap-1 mb-3">
                                                            <div className="flex">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < Math.floor(product.averageRating)
                                                                            ? 'fill-accent text-accent'
                                                                            : 'text-muted'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-muted-foreground ml-1">
                                                                ({product.numOfReviews})
                                                            </span>
                                                        </div>

                                                        <div className="flex items-baseline gap-2 mb-3">
                                                            {product.discountedAmount ? (
                                                                <>
                                                                    <div className="flex items-center text-2xl font-bold text-primary">
                                                                        <IndianRupee className="h-5 w-5" />
                                                                        {product.discountedAmount.toLocaleString('en-IN')}
                                                                    </div>
                                                                    <div className="flex items-center text-sm text-muted-foreground line-through">
                                                                        <IndianRupee className="h-3 w-3" />
                                                                        {product.amount.toLocaleString('en-IN')}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center text-2xl font-bold text-primary">
                                                                    <IndianRupee className="h-5 w-5" />
                                                                    {product.amount.toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {product.category && (
                                                            <Badge variant="secondary" className="mb-3">
                                                                {product.category.name}
                                                            </Badge>
                                                        )}
                                                    </CardContent>

                                                    <CardFooter className="p-4 pt-0">
                                                        <Button
                                                            className="w-full"
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={!product.inStock}
                                                        >
                                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    {/* Infinite Scroll Trigger */}
                                    {hasMore && (
                                        <div ref={loadMoreRef} className="flex justify-center py-8">
                                            {loadingMore && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                    Loading more products...
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Products;

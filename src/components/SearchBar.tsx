import { useState, useRef, useEffect } from "react";
import { Search, IndianRupee, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { getAllProducts, Product } from "@/api/productApi";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SearchBarProps {
    className?: string;
    isMobile?: boolean;
}

export const SearchBar = ({ className = "", isMobile = false }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState<Product[]>([]);

    useEffect(() => {
        const searchProducts = async () => {
            if (debouncedSearch.trim().length > 0) {
                try {
                    setIsSearching(true);
                    const response = await getAllProducts({
                        keyword: debouncedSearch,
                        limit: 5
                    });
                    setSearchResults(response.data.products);
                    setIsOpen(true);
                } catch (error: any) {
                    console.error('Search error:', error);
                    toast({
                        title: "Search Error",
                        description: error.response?.data?.message || "Failed to search products",
                        variant: "destructive",
                    });
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setIsOpen(false);
            }
        };

        searchProducts();
    }, [debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
        setSearchQuery("");
        setIsOpen(false);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <Input
                    type="search"
                    placeholder={isMobile ? "Search products..." : "Search for products, brands and more..."}
                    className={`pr-12 ${isMobile ? 'border-2' : 'h-11 border-2'} focus:border-primary`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    disabled={isSearching}
                />
                <Button
                    size="icon"
                    className={`absolute right-0 top-0 ${isMobile ? '' : 'h-11 w-11'}`}
                    onClick={handleSearch}
                    variant={isMobile ? "ghost" : "default"}
                    disabled={isSearching}
                >
                    {isSearching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Search className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Search Results Dropdown */}
            {isOpen && !isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                        <button
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                        >
                            <div className="w-16 h-16 bg-muted/30 flex-shrink-0 overflow-hidden rounded">
                                <img
                                    src={
                                        product.imageUrl
                                            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.imageUrl}`
                                            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
                                    }
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                    }}
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-semibold text-foreground line-clamp-1">
                                    {product.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {product.category?.name || 'Uncategorized'}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center text-foreground font-bold">
                                        <IndianRupee className="h-4 w-4" />
                                        <span>{product.amount.toLocaleString("en-IN")}</span>
                                    </div>
                                    {product.discountedAmount && (
                                        <div className="flex items-center text-muted-foreground line-through text-sm">
                                            <IndianRupee className="h-3 w-3" />
                                            <span>{product.discountedAmount.toLocaleString("en-IN")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isOpen && isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border shadow-lg rounded-lg z-50 p-8 text-center">
                    <Loader2 className="h-12 w-12 text-primary mx-auto mb-3 animate-spin" />
                    <p className="text-muted-foreground font-medium">Searching...</p>
                </div>
            )}

            {/* No Results */}
            {isOpen && !isSearching && searchQuery.trim() && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border shadow-lg rounded-lg z-50 p-8 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No products found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Try searching with different keywords
                    </p>
                </div>
            )}
        </div>
    );
};

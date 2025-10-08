import { useState, useRef, useEffect } from "react";
import { Search, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { products, Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    className?: string;
    isMobile?: boolean;
}

export const SearchBar = ({ className = "", isMobile = false }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState<Product[]>([]);

    useEffect(() => {
        if (debouncedSearch.trim().length > 0) {
            const filtered = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 5)); // Show top 5 results
            setIsOpen(true);
        } else {
            setSearchResults([]);
            setIsOpen(false);
        }
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

    const handleProductClick = (productId: number) => {
        navigate(`/product/${productId}`);
        setSearchQuery("");
        setIsOpen(false);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // In a real app, navigate to search results page
            console.log("Searching for:", searchQuery);
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
                />
                <Button
                    size="icon"
                    className={`absolute right-0 top-0 ${isMobile ? '' : 'h-11 w-11'}`}
                    onClick={handleSearch}
                    variant={isMobile ? "ghost" : "default"}
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>

            {/* Search Results Dropdown */}
            {isOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border shadow-lg z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                        >
                            <div className="w-16 h-16 bg-muted/30 flex-shrink-0 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-semibold text-foreground line-clamp-1">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {product.category}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center text-foreground font-bold">
                                        <IndianRupee className="h-4 w-4" />
                                        <span>{product.price.toLocaleString("en-IN")}</span>
                                    </div>
                                    {product.oldPrice && (
                                        <div className="flex items-center text-muted-foreground line-through text-sm">
                                            <IndianRupee className="h-3 w-3" />
                                            <span>{product.oldPrice.toLocaleString("en-IN")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {isOpen && searchQuery.trim() && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border shadow-lg z-50 p-8 text-center">
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

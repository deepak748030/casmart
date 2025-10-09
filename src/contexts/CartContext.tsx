import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
    _id: string;
    title: string;
    amount: number;
    discountedAmount?: number;
    imageUrl: string;
    category: string;
    quantity: number;
    size?: string;
    inStock: boolean;
}

export interface WishlistItem {
    _id: string;
    title: string;
    amount: number;
    discountedAmount?: number;
    imageUrl: string;
    category: string;
    inStock: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    wishlistItems: WishlistItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string, size?: string) => void;
    updateQuantity: (id: string, size: string | undefined, quantity: number) => void;
    clearCart: () => void;
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    moveToCart: (id: string) => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    getWishlistCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const { toast } = useToast();

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
        setCartItems((prev) => {
            const existingItem = prev.find((i) => i._id === item._id && i.size === item.size);
            if (existingItem) {
                toast({
                    title: "Updated",
                    description: "Item quantity updated in cart",
                });
                return prev.map((i) =>
                    i._id === item._id && i.size === item.size
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            toast({
                title: "Added to Cart",
                description: `${item.title} has been added to your cart`,
            });
            return [...prev, { ...item, quantity }];
        });
    };

    const removeFromCart = (id: string, size?: string) => {
        setCartItems((prev) => prev.filter((item) => !(item._id === id && item.size === size)));
        toast({
            title: "Removed",
            description: "Item removed from cart",
        });
    };

    const updateQuantity = (id: string, size: string | undefined, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id, size);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                (item._id === id && item.size === size) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        toast({
            title: "Cart Cleared",
            description: "All items removed from cart",
        });
    };

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prev) => {
            if (prev.find((i) => i._id === item._id)) {
                toast({
                    title: "Already in Wishlist",
                    description: "This item is already in your wishlist",
                    variant: "destructive",
                });
                return prev;
            }
            toast({
                title: "Added to Wishlist",
                description: `${item.title} has been added to your wishlist`,
            });
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) => prev.filter((item) => item._id !== id));
        toast({
            title: "Removed",
            description: "Item removed from wishlist",
        });
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item._id === id);
    };

    const moveToCart = (id: string) => {
        const item = wishlistItems.find((i) => i._id === id);
        if (item) {
            addToCart(item, 1);
            removeFromWishlist(id);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) =>
                total + (item.discountedAmount || item.amount) * item.quantity,
            0
        );
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                wishlistItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                moveToCart,
                getCartTotal,
                getCartCount,
                getWishlistCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

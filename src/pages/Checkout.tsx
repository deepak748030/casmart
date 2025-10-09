import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ShoppingBag,
    IndianRupee,
    CreditCard,
    Truck,
    MapPin,
    User,
    Phone,
    Mail,
    Home,
    CheckCircle2,
    ArrowLeft,
    Lock,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { createOrder } from "@/api/orderApi";
import type { CreateOrderData } from "@/api/orderApi";

export default function Checkout() {
    const navigate = useNavigate();
    const { user, isLoading: authLoading } = useAuth();
    const { cartItems, getCartTotal, clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [saveAddress, setSaveAddress] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
        if (cartItems.length === 0) {
            navigate("/cart");
        }
    }, [user, authLoading, cartItems.length, navigate]);

    const subtotal = getCartTotal();
    const deliveryCharges = 200;
    const total = subtotal + deliveryCharges;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async () => {
        // Validate form
        if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsProcessing(true);

        try {
            // Prepare order data
            const orderData: CreateOrderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.title,
                    quantity: item.quantity,
                    image: item.imageUrl,
                    price: item.amount,
                    discountedPrice: item.discountedAmount,
                    variant: item.size,
                })),
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.pincode,
                    country: "India",
                },
                paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
                taxPrice: 0,
                shippingPrice: deliveryCharges,
                totalPrice: total,
            };

            // Create order via API
            const response = await createOrder(orderData);

            if (response.success) {
                clearCart();
                toast.success("Order placed successfully!");
                // Navigate to order confirmation or profile orders page
                navigate("/profile");
            }
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (authLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 py-8 md:py-16">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/cart">
                            <Button variant="ghost" className="mb-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Cart
                            </Button>
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
                        <p className="text-muted-foreground">Complete your purchase</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-primary" />
                                        Delivery Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="John Doe"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 98765 43210"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Street Address *</Label>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="123 Main Street"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City *</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Mumbai"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State *</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="Maharashtra"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Pincode *</Label>
                                            <Input
                                                id="pincode"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                placeholder="400001"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="saveAddress"
                                            checked={saveAddress}
                                            onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                                        />
                                        <label
                                            htmlFor="saveAddress"
                                            className="text-sm text-muted-foreground cursor-pointer"
                                        >
                                            Save this address for future orders
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <label htmlFor="cod" className="flex-1 cursor-pointer">
                                                <div className="font-semibold">Cash on Delivery</div>
                                                <div className="text-sm text-muted-foreground">Pay when you receive</div>
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer opacity-50">
                                            <RadioGroupItem value="online" id="online" disabled />
                                            <label htmlFor="online" className="flex-1 cursor-pointer">
                                                <div className="font-semibold">Online Payment</div>
                                                <div className="text-sm text-muted-foreground">Coming Soon</div>
                                            </label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-8 shadow-lg border-2">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={`${item._id}-${item.size}`} className="flex gap-3 p-3 border rounded-lg">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold line-clamp-1">{item.title}</h4>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                    {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                                                    <div className="flex items-center text-sm font-semibold mt-1">
                                                        <IndianRupee className="h-3 w-3" />
                                                        <span>{((item.discountedAmount || item.amount) * item.quantity).toLocaleString("en-IN")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Price Breakdown */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <div className="flex items-center font-medium">
                                                <IndianRupee className="h-3.5 w-3.5" />
                                                <span>{subtotal.toLocaleString("en-IN")}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Delivery Charges</span>
                                            <div className="flex items-center font-medium">
                                                <IndianRupee className="h-3.5 w-3.5" />
                                                <span>{deliveryCharges}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-base font-bold">Total Amount</span>
                                        <div className="flex items-center text-lg font-bold text-primary">
                                            <IndianRupee className="h-5 w-5" />
                                            <span>{total.toLocaleString("en-IN")}</span>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full shadow-glow"
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                                Place Order
                                            </>
                                        )}
                                    </Button>

                                    {/* Security Badge */}
                                    <div className="flex items-center justify-center gap-2 pt-4 text-xs text-muted-foreground">
                                        <Lock className="h-3.5 w-3.5" />
                                        <span>Secure checkout powered by encryption</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

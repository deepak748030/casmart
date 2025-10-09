import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Truck, MapPin, CreditCard, User, Mail, IndianRupee } from "lucide-react";
import type { Order } from "@/api/orderApi";

interface OrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
    if (!order) return null;

    const user = typeof order.user === 'object' ? order.user : null;

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "delivered":
                return "default";
            case "shipped":
                return "secondary";
            case "processing":
                return "outline";
            case "pending":
                return "outline";
            case "cancelled":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center justify-between">
                        <span>Order Details</span>
                        <Badge variant={getStatusBadgeVariant(order.orderStatus)} className="capitalize">
                            {order.orderStatus}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Order ID</p>
                                <p className="font-medium">{order._id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Order Date</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    {user && (
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Customer Information
                            </h3>
                            <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Address */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Shipping Address
                        </h3>
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Order Items
                        </h3>
                        <div className="space-y-3">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex gap-4 p-3 border rounded-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                        {item.variant && (
                                            <p className="text-sm text-muted-foreground">Variant: {item.variant}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center text-sm">
                                                <IndianRupee className="h-3 w-3" />
                                                <span className="font-semibold">{item.discountedPrice || item.price}</span>
                                            </div>
                                            {item.discountedPrice && item.discountedPrice < item.price && (
                                                <div className="flex items-center text-xs text-muted-foreground line-through">
                                                    <IndianRupee className="h-3 w-3" />
                                                    <span>{item.price}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center font-semibold">
                                            <IndianRupee className="h-4 w-4" />
                                            <span>{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Info */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Information
                        </h3>
                        <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span className="font-medium capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Status:</span>
                                <Badge variant={order.isPaid ? "default" : "outline"}>
                                    {order.isPaid ? "Paid" : "Unpaid"}
                                </Badge>
                            </div>
                            {order.isPaid && order.paidAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Paid At:</span>
                                    <span>{new Date(order.paidAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            Delivery Information
                        </h3>
                        <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Status:</span>
                                <Badge variant={order.isDelivered ? "default" : "outline"}>
                                    {order.isDelivered ? "Delivered" : "Not Delivered"}
                                </Badge>
                            </div>
                            {order.isDelivered && order.deliveredAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivered At:</span>
                                    <span>{new Date(order.deliveredAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div>
                        <h3 className="font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Items Price:</span>
                                <div className="flex items-center">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{order.itemsPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping:</span>
                                <div className="flex items-center">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{order.shippingPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax:</span>
                                <div className="flex items-center">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{order.taxPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <div className="flex items-center">
                                    <IndianRupee className="h-5 w-5" />
                                    <span>{order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

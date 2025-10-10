import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Truck, MapPin, CreditCard, User, Mail, IndianRupee, CheckCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { updateOrderToPaid, updateOrderToDelivered } from "@/api/orderApi";
import type { Order } from "@/api/orderApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface OrderDetailsDialogProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOrderUpdate?: () => void;
}

export default function OrderDetailsDialog({ order, open, onOpenChange, onOrderUpdate }: OrderDetailsDialogProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [localOrder, setLocalOrder] = useState<Order | null>(order);

    // Update local order when prop changes - MUST be before any conditional returns
    useEffect(() => {
        setLocalOrder(order);
    }, [order]);

    // Early return AFTER all hooks
    if (!order || !localOrder) return null;

    const user = typeof localOrder.user === 'object' ? localOrder.user : null;

    const handleMarkAsPaid = async () => {
        if (!localOrder) return;

        try {
            setIsUpdating(true);
            await updateOrderToPaid(localOrder._id, {
                id: `PAY-${Date.now()}`,
                status: 'completed',
                update_time: new Date().toISOString(),
            });

            toast.success("Order marked as paid successfully");

            // Update local state
            setLocalOrder({
                ...localOrder,
                isPaid: true,
                paidAt: new Date().toISOString(),
                orderStatus: 'processing'
            });

            onOrderUpdate?.();
        } catch (error) {
            toast.error("Failed to mark order as paid");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMarkAsDelivered = async () => {
        if (!localOrder) return;

        try {
            setIsUpdating(true);
            await updateOrderToDelivered(localOrder._id);

            toast.success("Order marked as delivered successfully");

            // Update local state
            setLocalOrder({
                ...localOrder,
                isDelivered: true,
                deliveredAt: new Date().toISOString(),
                orderStatus: 'delivered'
            });

            onOrderUpdate?.();
        } catch (error) {
            toast.error("Failed to mark order as delivered");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "text-green-600 dark:text-green-400";
            case "shipped":
                return "text-orange-600 dark:text-orange-400";
            case "processing":
                return "text-blue-600 dark:text-blue-400";
            case "pending":
                return "text-yellow-600 dark:text-yellow-400";
            case "cancelled":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-muted-foreground";
        }
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-foreground">Order Details</span>
                        <Badge
                            variant={getStatusBadgeVariant(localOrder.orderStatus)}
                            className={`capitalize ${getStatusColor(localOrder.orderStatus)}`}
                        >
                            {localOrder.orderStatus}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Admin Quick Actions */}
                    <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20">
                        <div className="w-full mb-2">
                            <p className="text-sm font-semibold text-foreground mb-1">Quick Actions</p>
                            <p className="text-xs text-muted-foreground">Update order status and payment</p>
                        </div>
                        <Button
                            size="sm"
                            variant={localOrder.isPaid ? "outline" : "default"}
                            onClick={handleMarkAsPaid}
                            disabled={isUpdating || localOrder.isPaid}
                            className="gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            {localOrder.isPaid ? "Marked as Paid" : "Mark as Paid"}
                        </Button>
                        <Button
                            size="sm"
                            variant={localOrder.isDelivered ? "outline" : "default"}
                            onClick={handleMarkAsDelivered}
                            disabled={isUpdating || localOrder.isDelivered || !localOrder.isPaid}
                            className="gap-2"
                        >
                            <Truck className="h-4 w-4" />
                            {localOrder.isDelivered ? "Marked as Delivered" : "Mark as Delivered"}
                        </Button>
                        {!localOrder.isPaid && (
                            <p className="text-xs text-muted-foreground italic w-full mt-1">
                                💡 Mark as paid before delivery
                            </p>
                        )}
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Order ID</p>
                                <p className="font-mono font-medium text-sm">{localOrder._id.slice(-12).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Order Date</p>
                                <p className="font-medium text-sm">{new Date(localOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
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
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                            <Package className="h-5 w-5 text-primary" />
                            Order Items ({localOrder.orderItems.length})
                        </h3>
                        <div className="space-y-3">
                            {localOrder.orderItems.map((item, index) => {
                                const imageUrl = item.image.startsWith('http')
                                    ? item.image
                                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`;

                                return (
                                    <div key={index} className="flex gap-4 p-4 border border-border rounded-lg hover:border-primary/30 transition-colors bg-card">
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-md ring-1 ring-border"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    Qty: {item.quantity}
                                                </Badge>
                                                {item.variant && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {item.variant}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center text-sm font-semibold text-foreground">
                                                    <IndianRupee className="h-3.5 w-3.5" />
                                                    <span>{item.discountedPrice || item.price}</span>
                                                </div>
                                                {item.discountedPrice && item.discountedPrice < item.price && (
                                                    <div className="flex items-center text-xs text-muted-foreground line-through">
                                                        <IndianRupee className="h-3 w-3" />
                                                        <span>{item.price}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col justify-between">
                                            <div className="flex items-center font-bold text-foreground">
                                                <IndianRupee className="h-4 w-4" />
                                                <span>{((item.discountedPrice || item.price) * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Info */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Payment Information
                        </h3>
                        <div className="space-y-3 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Payment Method:</span>
                                <Badge variant="outline" className="capitalize font-medium">
                                    {localOrder.paymentMethod}
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Payment Status:</span>
                                <Badge variant={localOrder.isPaid ? "default" : "outline"} className={localOrder.isPaid ? "bg-green-600 dark:bg-green-500" : ""}>
                                    {localOrder.isPaid ? "✓ Paid" : "Unpaid"}
                                </Badge>
                            </div>
                            {localOrder.isPaid && localOrder.paidAt && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Paid At:</span>
                                    <span className="font-medium">{new Date(localOrder.paidAt).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                            <Truck className="h-5 w-5 text-primary" />
                            Delivery Information
                        </h3>
                        <div className="space-y-3 p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Delivery Status:</span>
                                <Badge variant={localOrder.isDelivered ? "default" : "outline"} className={localOrder.isDelivered ? "bg-green-600 dark:bg-green-500" : ""}>
                                    {localOrder.isDelivered ? "✓ Delivered" : "Not Delivered"}
                                </Badge>
                            </div>
                            {localOrder.isDelivered && localOrder.deliveredAt && (
                                <>
                                    <Separator />
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Delivered At:</span>
                                        <span className="font-medium">{new Date(localOrder.deliveredAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div>
                        <h3 className="font-semibold mb-3 text-foreground">Order Summary</h3>
                        <div className="space-y-3 p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items Price:</span>
                                <div className="flex items-center font-medium">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{localOrder.itemsPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping:</span>
                                <div className="flex items-center font-medium">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{localOrder.shippingPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax:</span>
                                <div className="flex items-center font-medium">
                                    <IndianRupee className="h-4 w-4" />
                                    <span>{localOrder.taxPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <Separator className="bg-primary/20" />
                            <div className="flex justify-between text-xl font-bold pt-2">
                                <span className="text-foreground">Total:</span>
                                <div className="flex items-center text-primary">
                                    <IndianRupee className="h-6 w-6" />
                                    <span>{localOrder.totalPrice.toFixed(2)}</span>
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

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { Package, Calendar, IndianRupee, Eye, RefreshCw, ShoppingBag, XCircle } from "lucide-react";
import { toast } from "sonner";
import { getMyOrders, cancelOrder } from "@/api/orderApi";
import type { Order } from "@/api/orderApi";
import OrderDetailsDialog from "@/components/admin/OrderDetailsDialog";

export default function UserOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await getMyOrders();
            setOrders(response.data.orders);
        } catch (error) {
            toast.error("Failed to fetch orders");
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleCancelClick = (order: Order) => {
        setOrderToCancel(order);
    };

    const handleCancelConfirm = async () => {
        if (!orderToCancel) return;

        try {
            setIsCancelling(true);
            await cancelOrder(orderToCancel._id);
            toast.success("Order cancelled successfully");
            await fetchOrders();
            setOrderToCancel(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to cancel order");
            console.error("Error cancelling order:", error);
        } finally {
            setIsCancelling(false);
        }
    };

    const canCancelOrder = (order: Order) => {
        return (
            !order.isPaid &&
            !order.isDelivered &&
            order.orderStatus !== 'cancelled' &&
            order.orderStatus !== 'delivered'
        );
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading your orders...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (orders.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                            <p className="text-muted-foreground mb-4">
                                You haven't placed any orders yet.
                            </p>
                            <Button onClick={() => window.location.href = "/"}>
                                Start Shopping
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Orders ({orders.length})</CardTitle>
                    <Button onClick={fetchOrders} size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order._id} className="border-2">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                                <Badge
                                                    variant={getStatusBadgeVariant(order.orderStatus)}
                                                    className="capitalize"
                                                >
                                                    {order.orderStatus}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">
                                                    {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                                                </span>
                                                <Separator orientation="vertical" className="h-4" />
                                                <div className="flex items-center font-semibold">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span>{order.totalPrice.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>

                                            {/* Order Items Preview */}
                                            <div className="flex gap-2 mt-3">
                                                {order.orderItems.slice(0, 3).map((item, idx) => {
                                                    const imageUrl = item.image.startsWith('http')
                                                        ? item.image
                                                        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}`;

                                                    return (
                                                        <img
                                                            key={idx}
                                                            src={imageUrl}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded border"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
                                                            }}
                                                        />
                                                    );
                                                })}
                                                {order.orderItems.length > 3 && (
                                                    <div className="w-12 h-12 flex items-center justify-center bg-muted rounded border text-xs font-medium">
                                                        +{order.orderItems.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                            {canCancelOrder(order) && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleCancelClick(order)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Cancel Order
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <OrderDetailsDialog
                order={selectedOrder}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />

            <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel order{" "}
                            <span className="font-semibold">
                                #{orderToCancel?._id.slice(-8).toUpperCase()}
                            </span>
                            ? This action cannot be undone and the items will be returned to inventory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCancelling}>
                            Keep Order
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelConfirm}
                            disabled={isCancelling}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isCancelling ? "Cancelling..." : "Cancel Order"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

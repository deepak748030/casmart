import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Truck, Calendar, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getAllOrders, updateOrderToPaid, updateOrderToDelivered } from "@/api/orderApi";
import type { Order } from "@/api/orderApi";
import OrderDetailsDialog from "@/components/admin/OrderDetailsDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminOrders() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await getAllOrders({
                sort: '-createdAt'
            });
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

    const filteredOrders = orders.filter((order) => {
        const user = typeof order.user === 'object' ? order.user : null;
        const searchLower = searchQuery.toLowerCase();

        const matchesSearch = !searchQuery ||
            order._id.toLowerCase().includes(searchLower) ||
            (user?.name.toLowerCase().includes(searchLower)) ||
            (user?.email.toLowerCase().includes(searchLower));

        const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

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

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.orderStatus === "pending").length,
        processing: orders.filter((o) => o.orderStatus === "processing").length,
        shipped: orders.filter((o) => o.orderStatus === "shipped").length,
        delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Orders Management</h2>
                    <p className="text-muted-foreground mt-1">Track and manage all orders</p>
                </div>
                <Button onClick={fetchOrders} disabled={isLoading} size="sm">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Package className="h-8 w-8 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="h-8 w-8 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-yellow-600 text-sm font-bold">{stats.pending}</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                            <p className="text-sm text-muted-foreground">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="h-8 w-8 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-blue-600 text-sm font-bold">{stats.processing}</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stats.processing}</p>
                            <p className="text-sm text-muted-foreground">Processing</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Truck className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                            <p className="text-2xl font-bold text-foreground">{stats.shipped}</p>
                            <p className="text-sm text-muted-foreground">Shipped</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="h-8 w-8 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-green-600 text-sm font-bold">✓</span>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
                            <p className="text-sm text-muted-foreground">Delivered</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">All Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID, customer name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Order ID</TableHead>
                                    <TableHead className="font-semibold">Customer</TableHead>
                                    <TableHead className="font-semibold">Items</TableHead>
                                    <TableHead className="font-semibold">Total</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                <span>Loading orders...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const user = typeof order.user === 'object' ? order.user : null;
                                        return (
                                            <TableRow key={order._id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">
                                                    {order._id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {user?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {user?.email || 'N/A'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {order.orderItems.length} items
                                                </TableCell>
                                                <TableCell className="font-semibold text-foreground">
                                                    ₹{order.totalPrice.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusBadgeVariant(order.orderStatus)}
                                                        className="capitalize"
                                                    >
                                                        {order.orderStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:text-primary"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <OrderDetailsDialog
                order={selectedOrder}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}

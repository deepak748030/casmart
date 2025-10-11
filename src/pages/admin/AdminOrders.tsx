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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminOrders() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

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

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Orders Management</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Track and manage all orders</p>
                </div>
                <Button onClick={fetchOrders} disabled={isLoading} size="sm">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <Card className="border-border">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                        <div className="text-center">
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-primary mb-2" />
                            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Total Orders</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                        <div className="text-center">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-yellow-600 text-xs sm:text-sm font-bold">{stats.pending}</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.pending}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                        <div className="text-center">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-blue-600 text-xs sm:text-sm font-bold">{stats.processing}</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.processing}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Processing</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                        <div className="text-center">
                            <Truck className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-orange-600 mb-2" />
                            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.shipped}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Shipped</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border col-span-2 sm:col-span-3 lg:col-span-1">
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                        <div className="text-center">
                            <div className="h-6 w-6 sm:h-8 sm:w-8 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-green-600 text-xs sm:text-sm font-bold">✓</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.delivered}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Delivered</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg text-foreground">All Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID, customer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 text-sm"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px] text-sm">
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

                    <div className="rounded-md border border-border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold text-xs sm:text-sm">Order ID</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Customer</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell">Items</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Total</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
                                    <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-xs sm:text-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                <span className="text-sm">Loading orders...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedOrders.map((order) => {
                                        const user = typeof order.user === 'object' ? order.user : null;
                                        return (
                                            <TableRow key={order._id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground text-xs sm:text-sm">
                                                    {order._id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-foreground text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                                                            {user?.name || 'N/A'}
                                                        </p>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                                                            {user?.email || 'N/A'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                                                    {order.orderItems.length} items
                                                </TableCell>
                                                <TableCell className="font-semibold text-foreground text-xs sm:text-sm whitespace-nowrap">
                                                    ₹{order.totalPrice.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getStatusBadgeVariant(order.orderStatus)}
                                                        className="capitalize text-[10px] sm:text-xs"
                                                    >
                                                        {order.orderStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:text-primary h-8 w-8"
                                                        onClick={() => handleViewOrder(order)}
                                                    >
                                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <Pagination className="mt-4">
                            <PaginationContent className="flex-wrap gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(page)}
                                                    isActive={currentPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        );
                                    }
                                    return null;
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </CardContent>
            </Card>

            <OrderDetailsDialog
                order={selectedOrder}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onOrderUpdate={fetchOrders}
            />
        </div>
    );
}

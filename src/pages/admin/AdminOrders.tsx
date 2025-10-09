import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Truck, Calendar, Package } from "lucide-react";
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

interface MockOrder {
    _id: string;
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

export default function AdminOrders() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Mock data
    const mockOrders: MockOrder[] = [
        {
            _id: "1",
            orderId: "ORD-1001",
            customerName: "John Doe",
            customerEmail: "john@example.com",
            items: 3,
            total: 2499.99,
            status: "delivered",
            createdAt: "2024-03-15",
        },
        {
            _id: "2",
            orderId: "ORD-1002",
            customerName: "Jane Smith",
            customerEmail: "jane@example.com",
            items: 1,
            total: 999.00,
            status: "shipped",
            createdAt: "2024-03-16",
        },
        {
            _id: "3",
            orderId: "ORD-1003",
            customerName: "Bob Wilson",
            customerEmail: "bob@example.com",
            items: 5,
            total: 4599.50,
            status: "processing",
            createdAt: "2024-03-17",
        },
        {
            _id: "4",
            orderId: "ORD-1004",
            customerName: "Alice Brown",
            customerEmail: "alice@example.com",
            items: 2,
            total: 1899.00,
            status: "pending",
            createdAt: "2024-03-18",
        },
        {
            _id: "5",
            orderId: "ORD-1005",
            customerName: "Charlie Davis",
            customerEmail: "charlie@example.com",
            items: 4,
            total: 3299.99,
            status: "cancelled",
            createdAt: "2024-03-14",
        },
    ];

    const filteredOrders = mockOrders.filter(
        (order) =>
            (order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (statusFilter === "all" || order.status === statusFilter)
    );

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
        total: mockOrders.length,
        pending: mockOrders.filter((o) => o.status === "pending").length,
        processing: mockOrders.filter((o) => o.status === "processing").length,
        shipped: mockOrders.filter((o) => o.status === "shipped").length,
        delivered: mockOrders.filter((o) => o.status === "delivered").length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Orders Management</h2>
                <p className="text-muted-foreground mt-1">Track and manage all orders</p>
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
                                {filteredOrders.map((order) => (
                                    <TableRow key={order._id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium text-foreground">{order.orderId}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-foreground">{order.customerName}</p>
                                                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{order.items} items</TableCell>
                                        <TableCell className="font-semibold text-foreground">₹{order.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="hover:text-primary">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

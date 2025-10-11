import { useState, useEffect } from "react";
import { Users, Package, ShoppingCart, TrendingUp, Activity, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActivityLogs, ActivityLog } from "@/api/activityApi";
import { getSalesData, SalesDataPoint } from "@/api/analyticsApi";
import { getAllOrders } from "@/api/orderApi";
import { getUsers } from "@/api/userApi";
import { getCategories } from "@/api/categoryApi";
import { format, subDays, subMonths } from "date-fns";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent
} from "@/components/ui/chart";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminDashboard() {
    const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
    const [loadingSales, setLoadingSales] = useState(true);
    const [timeRange, setTimeRange] = useState<'7days' | '30days' | '12months'>('30days');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalActivities, setTotalActivities] = useState(0);
    const activitiesPerPage = 5;
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        usersChange: 0,
        ordersChange: 0,
        revenueChange: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, [timeRange, currentPage]);

    const fetchAllData = async () => {
        await Promise.all([
            fetchRecentActivities(),
            fetchSalesData(),
            fetchStats(),
        ]);
    };

    const fetchRecentActivities = async () => {
        try {
            setLoadingActivities(true);
            const response = await getActivityLogs({
                limit: activitiesPerPage,
                page: currentPage
            });
            setRecentActivities(response.data.activities);
            setTotalActivities(response.total || 0);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoadingActivities(false);
        }
    };

    const totalPages = Math.ceil(totalActivities / activitiesPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchSalesData = async () => {
        try {
            setLoadingSales(true);
            const endDate = new Date();
            let startDate: Date;
            let groupBy: 'day' | 'month' | 'year' = 'day';

            if (timeRange === '7days') {
                startDate = subDays(endDate, 7);
                groupBy = 'day';
            } else if (timeRange === '30days') {
                startDate = subDays(endDate, 30);
                groupBy = 'day';
            } else {
                startDate = subMonths(endDate, 12);
                groupBy = 'month';
            }

            const response = await getSalesData({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                groupBy,
            });

            setSalesData(response.data.salesData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setSalesData([]);
        } finally {
            setLoadingSales(false);
        }
    };

    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const [usersRes, categoriesData, ordersRes] = await Promise.all([
                getUsers({ limit: 1 }),
                getCategories(),
                getAllOrders({ limit: 1 }),
            ]);

            // Calculate revenue from orders
            const allOrdersRes = await getAllOrders({ limit: 10000 });
            const paidOrders = allOrdersRes.data.orders.filter(order => order.isPaid);
            const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

            // Get previous period data for comparison
            const thirtyDaysAgo = subDays(new Date(), 30);
            const sixtyDaysAgo = subDays(new Date(), 60);

            const recentOrders = paidOrders.filter(order => new Date(order.paidAt || order.createdAt) >= thirtyDaysAgo);
            const previousOrders = paidOrders.filter(order => {
                const date = new Date(order.paidAt || order.createdAt);
                return date >= sixtyDaysAgo && date < thirtyDaysAgo;
            });

            const recentRevenue = recentOrders.reduce((sum, order) => sum + order.totalPrice, 0);
            const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalPrice, 0);

            const ordersChange = previousOrders.length > 0
                ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
                : 100;
            const revenueChange = previousRevenue > 0
                ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
                : 100;

            setStats({
                totalUsers: usersRes.pagination.total,
                totalCategories: categoriesData.length,
                totalOrders: ordersRes.total,
                totalRevenue,
                usersChange: 12, // Mock value - implement user tracking for real value
                ordersChange,
                revenueChange,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const getMethodBadge = (method: string) => {
        const colors: Record<string, string> = {
            GET: "bg-blue-500",
            POST: "bg-green-500",
            PUT: "bg-yellow-500",
            PATCH: "bg-orange-500",
            DELETE: "bg-red-500",
        };
        return <Badge className={`${colors[method]} text-white text-xs`}>{method}</Badge>;
    };

    const getStatusBadge = (statusCode: number) => {
        if (statusCode >= 200 && statusCode < 300) {
            return <Badge className="bg-green-500 text-white text-xs">{statusCode}</Badge>;
        } else if (statusCode >= 400) {
            return <Badge variant="destructive" className="text-xs">{statusCode}</Badge>;
        }
        return <Badge variant="secondary" className="text-xs">{statusCode}</Badge>;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const formatChartData = (data: SalesDataPoint[]) => {
        return data.map(item => ({
            date: format(new Date(item.date), timeRange === '12months' ? 'MMM yyyy' : 'MMM dd'),
            sales: item.totalSales,
            orders: item.totalOrders,
            avgOrder: item.averageOrderValue,
        }));
    };

    const chartConfig = {
        sales: {
            label: "Sales",
            color: "hsl(var(--primary))",
        },
        orders: {
            label: "Orders",
            color: "hsl(var(--accent))",
        },
    };

    const statCards = [
        {
            title: "Total Users",
            value: formatNumber(stats.totalUsers),
            change: stats.usersChange,
            icon: Users,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Categories",
            value: formatNumber(stats.totalCategories),
            change: 0,
            icon: Package,
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
        {
            title: "Total Orders",
            value: formatNumber(stats.totalOrders),
            change: stats.ordersChange,
            icon: ShoppingCart,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Revenue",
            value: formatCurrency(stats.totalRevenue),
            change: stats.revenueChange,
            icon: TrendingUp,
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Monitor your store's performance and analytics</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {loadingStats ? (
                    Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="border-border">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    statCards.map((stat) => {
                        const isPositive = stat.change >= 0;
                        const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

                        return (
                            <Card key={stat.title} className="border-border hover-lift transition-smooth">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 sm:p-2.5 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1 truncate">{stat.value}</div>
                                    {stat.change !== 0 && (
                                        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                                            <ChangeIcon className="h-3 w-3" />
                                            <span className="truncate">{Math.abs(stat.change).toFixed(1)}% from last month</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Sales Analytics Chart */}
            <Card className="border-border">
                <CardHeader className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle className="text-base sm:text-lg text-foreground">Sales Analytics</CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Revenue and orders over time</p>
                        </div>
                        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
                            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                                <TabsTrigger value="7days" className="text-xs sm:text-sm">7D</TabsTrigger>
                                <TabsTrigger value="30days" className="text-xs sm:text-sm">30D</TabsTrigger>
                                <TabsTrigger value="12months" className="text-xs sm:text-sm">12M</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    {loadingSales ? (
                        <div className="h-64 sm:h-80 flex items-center justify-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : salesData.length === 0 ? (
                        <div className="h-64 sm:h-80 flex items-center justify-center">
                            <p className="text-sm text-muted-foreground text-center px-4">No sales data available for this period</p>
                        </div>
                    ) : (
                        <div className="w-full overflow-hidden">
                            <ChartContainer config={chartConfig} className="h-64 sm:h-80 w-full">
                                <AreaChart data={formatChartData(salesData)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="date"
                                        className="text-[10px] sm:text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        className="text-[10px] sm:text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        width={40}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        className="text-[10px] sm:text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        width={40}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ fontSize: '12px' }} />
                                    <Area
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="hsl(var(--primary))"
                                        fill="url(#salesGradient)"
                                        strokeWidth={2}
                                        name="Sales (₹)"
                                    />
                                    <Area
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="hsl(var(--accent))"
                                        fill="url(#ordersGradient)"
                                        strokeWidth={2}
                                        name="Orders"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Activity */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg text-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                            Recent API Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingActivities ? (
                            <div className="text-center py-8">
                                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                            </div>
                        ) : recentActivities.length === 0 ? (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                No recent activity
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {recentActivities.map((activity) => (
                                        <div key={activity._id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-2 border-b border-border last:border-0 gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    {getMethodBadge(activity.method)}
                                                    {getStatusBadge(activity.statusCode)}
                                                </div>
                                                <p className="text-xs sm:text-sm font-mono text-foreground truncate">
                                                    {activity.endpoint}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                                    {activity.user?.name || 'Anonymous'} • {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                                                </p>
                                            </div>
                                            {activity.responseTime && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {activity.responseTime}ms
                                                </div>
                                            )}
                                        </div>
                                    ))}
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
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Average Order Value Chart */}
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg text-foreground">Average Order Value</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">Track average order value trends</p>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {loadingSales ? (
                            <div className="h-64 sm:h-80 flex items-center justify-center">
                                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                            </div>
                        ) : salesData.length === 0 ? (
                            <div className="h-64 sm:h-80 flex items-center justify-center">
                                <p className="text-sm text-muted-foreground text-center px-4">No data available</p>
                            </div>
                        ) : (
                            <div className="w-full overflow-hidden">
                                <ChartContainer config={{ avgOrder: { label: "Avg Order", color: "hsl(var(--accent))" } }} className="h-64 sm:h-80 w-full">
                                    <BarChart data={formatChartData(salesData)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="date"
                                            className="text-[10px] sm:text-xs"
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={70}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis
                                            className="text-[10px] sm:text-xs"
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                            width={50}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar
                                            dataKey="avgOrder"
                                            fill="hsl(var(--accent))"
                                            radius={[4, 4, 0, 0]}
                                            name="Avg Order (₹)"
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

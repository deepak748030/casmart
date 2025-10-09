import { useState, useEffect } from "react";
import { Users, Package, ShoppingCart, TrendingUp, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActivityLogs, ActivityLog } from "@/api/activityApi";
import { format } from "date-fns";

export default function AdminDashboard() {
    const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
    const [loadingActivities, setLoadingActivities] = useState(true);

    useEffect(() => {
        fetchRecentActivities();
    }, []);

    const fetchRecentActivities = async () => {
        try {
            setLoadingActivities(true);
            const response = await getActivityLogs({ limit: 10 });
            setRecentActivities(response.data.activities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoadingActivities(false);
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

    const stats = [
        {
            title: "Total Users",
            value: "1,234",
            change: "+12%",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Categories",
            value: "42",
            change: "+3",
            icon: Package,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Total Orders",
            value: "3,456",
            change: "+23%",
            icon: ShoppingCart,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
        {
            title: "Revenue",
            value: "₹2,45,678",
            change: "+18%",
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
                <p className="text-muted-foreground mt-1">Monitor your store's performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <p className="text-xs text-green-600 mt-1">
                                {stat.change} from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Recent API Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingActivities ? (
                            <div className="text-center py-8">
                                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                            </div>
                        ) : recentActivities.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No recent activity
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div key={activity._id} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getMethodBadge(activity.method)}
                                                {getStatusBadge(activity.statusCode)}
                                            </div>
                                            <p className="text-sm font-mono text-foreground truncate">
                                                {activity.endpoint}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.user?.name || 'Anonymous'} • {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                                            </p>
                                        </div>
                                        {activity.responseTime && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                                                <Clock className="h-3 w-3" />
                                                {activity.responseTime}ms
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Top Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {["Electronics", "Clothing", "Home & Garden", "Sports", "Books"].map((category, i) => (
                                <div key={category} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{category}</p>
                                            <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100 + 20)} products</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-foreground">{Math.floor(Math.random() * 500 + 100)} sales</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

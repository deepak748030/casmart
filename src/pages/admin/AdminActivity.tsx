import { useState, useEffect } from "react";
import { Activity, Filter, RefreshCw, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { getActivityLogs, ActivityLog } from "@/api/activityApi";
import { format } from "date-fns";

export default function AdminActivity() {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [methodFilter, setMethodFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const limit = 20;

    useEffect(() => {
        fetchActivities();
    }, [page, methodFilter, statusFilter]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const params: any = { page, limit };

            if (methodFilter !== "all") params.method = methodFilter;
            if (statusFilter !== "all") params.statusCode = parseInt(statusFilter);

            const response = await getActivityLogs(params);
            setActivities(response.data.activities);
            setTotal(response.total);
        } catch (error: any) {
            console.error('Error fetching activities:', error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to load activity logs",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (statusCode: number) => {
        if (statusCode >= 200 && statusCode < 300) {
            return <Badge className="bg-green-500 hover:bg-green-600">{statusCode}</Badge>;
        } else if (statusCode >= 300 && statusCode < 400) {
            return <Badge variant="secondary">{statusCode}</Badge>;
        } else if (statusCode >= 400 && statusCode < 500) {
            return <Badge variant="destructive">{statusCode}</Badge>;
        } else {
            return <Badge className="bg-red-700 hover:bg-red-800">{statusCode}</Badge>;
        }
    };

    const getMethodBadge = (method: string) => {
        const colors: Record<string, string> = {
            GET: "bg-blue-500 hover:bg-blue-600",
            POST: "bg-green-500 hover:bg-green-600",
            PUT: "bg-yellow-500 hover:bg-yellow-600",
            PATCH: "bg-orange-500 hover:bg-orange-600",
            DELETE: "bg-red-500 hover:bg-red-600",
        };
        return <Badge className={colors[method] || ""}>{method}</Badge>;
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="h-8 w-8" />
                        Activity Logs
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Monitor all API requests and user activities
                    </p>
                </div>
                <Button onClick={fetchActivities} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Success Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {activities.length > 0
                                ? `${Math.round((activities.filter(a => a.statusCode < 400).length / activities.length) * 100)}%`
                                : '0%'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg Response Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activities.length > 0
                                ? `${Math.round(activities.reduce((acc, a) => acc + (a.responseTime || 0), 0) / activities.length)}ms`
                                : '0ms'}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Error Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {activities.length > 0
                                ? `${Math.round((activities.filter(a => a.statusCode >= 400).length / activities.length) * 100)}%`
                                : '0%'}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block">Method</label>
                            <Select value={methodFilter} onValueChange={setMethodFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Methods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-2 block">Status Code</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="200">200 (Success)</SelectItem>
                                    <SelectItem value="201">201 (Created)</SelectItem>
                                    <SelectItem value="400">400 (Bad Request)</SelectItem>
                                    <SelectItem value="401">401 (Unauthorized)</SelectItem>
                                    <SelectItem value="403">403 (Forbidden)</SelectItem>
                                    <SelectItem value="404">404 (Not Found)</SelectItem>
                                    <SelectItem value="500">500 (Server Error)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                            <p className="mt-4 text-muted-foreground">Loading activities...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No activity logs found
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Timestamp</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Endpoint</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Response Time</TableHead>
                                            <TableHead>IP Address</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activities.map((activity) => (
                                            <TableRow key={activity._id}>
                                                <TableCell className="font-mono text-xs">
                                                    {format(new Date(activity.createdAt), 'MMM dd, HH:mm:ss')}
                                                </TableCell>
                                                <TableCell>
                                                    {activity.user ? (
                                                        <div>
                                                            <div className="font-medium">{activity.user.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {activity.user.email}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">Anonymous</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getMethodBadge(activity.method)}</TableCell>
                                                <TableCell className="font-mono text-sm max-w-xs truncate">
                                                    {activity.endpoint}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(activity.statusCode)}</TableCell>
                                                <TableCell>
                                                    {activity.responseTime ? `${activity.responseTime}ms` : '-'}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {activity.ipAddress || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

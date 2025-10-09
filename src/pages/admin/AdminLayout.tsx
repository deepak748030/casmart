import { useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, LayoutDashboard, LogOut, Menu, X, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    const menuItems = [
        { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
        { to: "/admin/users", icon: Users, label: "Users" },
        { to: "/admin/categories", icon: Package, label: "Categories" },
        { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
        { to: "/admin/activity", icon: Activity, label: "Activity Logs" },
    ];

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r border-border transition-all duration-300 flex flex-col",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    {sidebarOpen ? (
                        <>
                            <Logo className="text-lg" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="mx-auto"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                                    "hover:bg-muted hover:text-primary",
                                    isActive ? "bg-primary text-primary-foreground" : "text-foreground",
                                    !sidebarOpen && "justify-center"
                                )
                            }
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive",
                            !sidebarOpen && "justify-center"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

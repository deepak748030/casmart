import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Package, Loader2 } from 'lucide-react';
import UserOrders from '@/components/UserOrders';

export default function MyOrders() {
    const { user, isLoading } = useAuth();

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Package className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                    My Orders
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Track and manage your order history
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Component */}
                    <UserOrders />
                </div>
            </main>
            <Footer />
        </>
    );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { signup, ApiError } from "@/api/authApi";
import signupIllustration from "@/assets/signup-illustration.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await signup({ name, email, password });
            await refreshUser();

            toast({
                title: "Account created successfully",
                description: `Welcome, ${response.data.user.name}!`,
            });

            navigate("/profile");
        } catch (error) {
            if (error instanceof ApiError) {
                // Handle validation errors
                if (error.errors && error.errors.length > 0) {
                    error.errors.forEach((err) => {
                        toast({
                            title: "Validation Error",
                            description: err.msg,
                            variant: "destructive",
                        });
                    });
                } else {
                    toast({
                        title: "Signup Failed",
                        description: error.message,
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent/10 to-primary/10 items-center justify-center p-12">
                <div className="max-w-lg animate-scale-in">
                    <img
                        src={signupIllustration}
                        alt="Welcome signup illustration"
                        className="w-full h-auto rounded-lg shadow-strong"
                    />
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Get Started Today</h2>
                        <p className="text-muted-foreground">Join thousands of users who trust our platform</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    <div className="text-center">
                        <Logo className="justify-center mb-6" />
                        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground mt-2">Join us today and get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                minLength={2}
                                maxLength={50}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Must be at least 8 characters with uppercase, lowercase, number, and special character
                            </p>
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Already have an account? </span>
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;

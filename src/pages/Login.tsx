import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import loginIllustration from "@/assets/login-illustration.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login attempt:", { email, password });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-accent/10 items-center justify-center p-12">
                <div className="max-w-lg animate-scale-in">
                    <img
                        src={loginIllustration}
                        alt="Secure login illustration"
                        className="w-full h-auto rounded-lg shadow-strong"
                    />
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Secure Access</h2>
                        <p className="text-muted-foreground">Your data is protected with industry-leading security measures</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    <div className="text-center">
                        <Logo className="justify-center mb-6" />
                        <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
                        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                            Sign In
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Don't have an account? </span>
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

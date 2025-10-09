import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import forgotPasswordIllustration from "@/assets/forgot-password-illustration.jpg";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password reset requested for:", email);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-accent/10 items-center justify-center p-12">
                <div className="max-w-lg animate-scale-in">
                    <img
                        src={forgotPasswordIllustration}
                        alt="Password recovery illustration"
                        className="w-full h-auto rounded-lg shadow-strong"
                    />
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Password Recovery</h2>
                        <p className="text-muted-foreground">We'll help you get back into your account securely</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    <div className="text-center">
                        <Logo className="justify-center mb-6" />
                        <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                        <p className="text-muted-foreground mt-2">
                            {isSubmitted
                                ? "Check your email for reset instructions"
                                : "Enter your email to receive password reset link"}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    We'll send you a password reset link
                                </p>
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Send Reset Link
                            </Button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center space-y-3">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                                    <svg
                                        className="w-8 h-8 text-accent"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Email Sent!</h3>
                                    <p className="text-sm text-muted-foreground">
                                        We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="text-center text-sm space-y-3">
                                <p className="text-muted-foreground">
                                    Didn't receive the email? Check your spam folder
                                </p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Try another email address
                                </button>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

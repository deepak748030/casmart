import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, Calendar, LogOut, Lock, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDetails, updatePassword } from '@/api/authApi';
import { ApiError } from '@/api/authApi';

export default function Profile() {
    const { user, isLoading, refreshUser, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const [detailsForm, setDetailsForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingDetails(true);

        try {
            await updateDetails(detailsForm);
            await refreshUser();
            toast({
                title: 'Success',
                description: 'Your details have been updated successfully.',
            });
        } catch (error) {
            if (error instanceof ApiError) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error.message,
                });
            }
        } finally {
            setIsUpdatingDetails(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'New passwords do not match.',
            });
            return;
        }

        setIsUpdatingPassword(true);

        try {
            await updatePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            toast({
                title: 'Success',
                description: 'Your password has been updated successfully.',
            });
        } catch (error) {
            if (error instanceof ApiError) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error.message,
                });
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast({
            title: 'Logged out',
            description: 'You have been logged out successfully.',
        });
        navigate('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-muted/30 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Profile Header */}
                    <Card className="mb-8 border-2 shadow-medium">
                        <CardContent className="pt-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-strong">
                                    <AvatarImage src={user.avatar?.url} alt={user.name} />
                                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                                    <p className="text-muted-foreground mb-3">{user.email}</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                        {user.isEmailVerified && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Content */}
                    <Tabs defaultValue="details" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                            <TabsTrigger value="details" className="gap-2">
                                <User className="h-4 w-4" />
                                Profile Details
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2">
                                <Lock className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Details Tab */}
                        <TabsContent value="details">
                            <Card className="border-2 shadow-medium">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>
                                        Update your personal details and contact information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateDetails} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-primary" />
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={detailsForm.name}
                                                    onChange={(e) =>
                                                        setDetailsForm({ ...detailsForm, name: e.target.value })
                                                    }
                                                    placeholder="Enter your full name"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-primary" />
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={detailsForm.email}
                                                    onChange={(e) =>
                                                        setDetailsForm({ ...detailsForm, email: e.target.value })
                                                    }
                                                    placeholder="Enter your email"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-primary" />
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={detailsForm.phoneNumber}
                                                    onChange={(e) =>
                                                        setDetailsForm({ ...detailsForm, phoneNumber: e.target.value })
                                                    }
                                                    placeholder="Enter your phone number"
                                                    className="border-2"
                                                />
                                            </div>

                                            {user.dateOfBirth && (
                                                <div className="space-y-2">
                                                    <Label className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-primary" />
                                                        Date of Birth
                                                    </Label>
                                                    <Input
                                                        value={new Date(user.dateOfBirth).toLocaleDateString()}
                                                        disabled
                                                        className="border-2 bg-muted"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                                            <span>Last updated {new Date(user.updatedAt).toLocaleDateString()}</span>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isUpdatingDetails}
                                            className="w-full gap-2"
                                        >
                                            {isUpdatingDetails ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security">
                            <Card className="border-2 shadow-medium">
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>
                                        Ensure your account is using a strong password
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password" className="flex items-center gap-2">
                                                    <Lock className="h-4 w-4 text-primary" />
                                                    Current Password
                                                </Label>
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    value={passwordForm.currentPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            currentPassword: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter current password"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            newPassword: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter new password"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) =>
                                                        setPasswordForm({
                                                            ...passwordForm,
                                                            confirmPassword: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Confirm new password"
                                                    className="border-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-muted/50 border-2 border-border rounded-md p-4">
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Password requirements:</strong>
                                            </p>
                                            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                                                <li>At least 8 characters long</li>
                                                <li>Contains uppercase and lowercase letters</li>
                                                <li>Contains at least one number</li>
                                                <li>Contains at least one special character (@$!%*?&)</li>
                                            </ul>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className="w-full gap-2"
                                        >
                                            {isUpdatingPassword ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </>
    );
}

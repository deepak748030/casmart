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
import { User, Mail, Phone, Calendar, LogOut, Lock, Save, Loader2, Camera, MapPin, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDetails, updatePassword } from '@/api/authApi';
import { ApiError } from '@/api/authApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Address } from '@/types/auth';

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
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar?.url || '');

    const [addresses, setAddresses] = useState<Address[]>(user?.addresses || []);
    const [newAddress, setNewAddress] = useState<Address>({
        type: 'home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAddress = () => {
        if (newAddress.street && newAddress.city && newAddress.country) {
            setAddresses([...addresses, { ...newAddress }]);
            setNewAddress({
                type: 'home' as const,
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                isDefault: false,
            });
            toast({
                title: 'Address added',
                description: 'Address has been added. Click "Save Changes" to update your profile.',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please fill in required address fields (street, city, country).',
            });
        }
    };

    const handleRemoveAddress = (index: number) => {
        setAddresses(addresses.filter((_, i) => i !== index));
        toast({
            title: 'Address removed',
            description: 'Address has been removed. Click "Save Changes" to update your profile.',
        });
    };

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingDetails(true);

        try {
            const updateData: any = {
                ...detailsForm,
                addresses,
            };

            // Note: Avatar upload would require additional backend endpoint
            // For now, we're just updating other fields
            if (avatarFile) {
                toast({
                    title: 'Note',
                    description: 'Avatar upload requires backend configuration. Other details will be updated.',
                });
            }

            await updateDetails(updateData);
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
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-strong">
                                        <AvatarImage src={avatarPreview || user.avatar?.url} alt={user.name} />
                                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="h-8 w-8 text-white" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
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
                        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                            <TabsTrigger value="details" className="gap-2">
                                <User className="h-4 w-4" />
                                Personal Info
                            </TabsTrigger>
                            <TabsTrigger value="addresses" className="gap-2">
                                <MapPin className="h-4 w-4" />
                                Addresses
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

                                            <div className="space-y-2">
                                                <Label htmlFor="dob" className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                    Date of Birth
                                                </Label>
                                                <Input
                                                    id="dob"
                                                    type="date"
                                                    value={detailsForm.dateOfBirth}
                                                    onChange={(e) =>
                                                        setDetailsForm({ ...detailsForm, dateOfBirth: e.target.value })
                                                    }
                                                    className="border-2"
                                                />
                                            </div>
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

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <Card className="border-2 shadow-medium">
                                <CardHeader>
                                    <CardTitle>Manage Addresses</CardTitle>
                                    <CardDescription>
                                        Add and manage your delivery addresses
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Existing Addresses */}
                                    {addresses.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-foreground">Your Addresses</h3>
                                            {addresses.map((address, index) => (
                                                <Card key={index} className="border-2">
                                                    <CardContent className="pt-6">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                                                        {address.type.toUpperCase()}
                                                                    </span>
                                                                    {address.isDefault && (
                                                                        <span className="text-xs text-muted-foreground">(Default)</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm font-medium text-foreground">{address.street}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {address.city}, {address.state} {address.zipCode}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">{address.country}</p>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveAddress(index)}
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Add New Address */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-foreground">Add New Address</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="address-type">Address Type</Label>
                                                <Select
                                                    value={newAddress.type}
                                                    onValueChange={(value) => setNewAddress({ ...newAddress, type: value as Address['type'] })}
                                                >
                                                    <SelectTrigger className="border-2">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="home">Home</SelectItem>
                                                        <SelectItem value="office">Office</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="street">Street Address *</Label>
                                                <Input
                                                    id="street"
                                                    value={newAddress.street}
                                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                    placeholder="123 Main St"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    placeholder="New York"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="state">State/Province</Label>
                                                <Input
                                                    id="state"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    placeholder="NY"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                                                <Input
                                                    id="zipCode"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                    placeholder="10001"
                                                    className="border-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country *</Label>
                                                <Input
                                                    id="country"
                                                    value={newAddress.country}
                                                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                    placeholder="United States"
                                                    className="border-2"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddAddress}
                                            className="w-full gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Address
                                        </Button>
                                    </div>

                                    <Separator />

                                    <Button
                                        type="button"
                                        onClick={handleUpdateDetails}
                                        disabled={isUpdatingDetails}
                                        className="w-full gap-2"
                                    >
                                        {isUpdatingDetails ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                Save All Changes
                                            </>
                                        )}
                                    </Button>
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

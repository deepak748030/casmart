import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface EditUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (userId: string, data: {
        name?: string;
        email?: string;
        role?: 'user' | 'admin' | 'vendor';
        phoneNumber?: string;
        isEmailVerified?: boolean;
    }) => Promise<void>;
}

export function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<'user' | 'admin' | 'vendor'>("user");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setRole(user.role || "user");
            setPhoneNumber(user.phoneNumber || "");
            setIsEmailVerified(user.isEmailVerified || false);
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        try {
            await onSave(user._id, {
                name,
                email,
                role,
                phoneNumber: phoneNumber || undefined,
                isEmailVerified,
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information and permissions
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                            id="phone"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={(value: any) => setRole(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="verified">Email Verified</Label>
                        <Switch
                            id="verified"
                            checked={isEmailVerified}
                            onCheckedChange={setIsEmailVerified}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

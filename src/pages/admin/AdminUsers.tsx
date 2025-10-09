import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit, Trash2, Mail, Calendar } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MockUser {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'vendor';
    isEmailVerified: boolean;
    createdAt: string;
}

export default function AdminUsers() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data
    const mockUsers: MockUser[] = [
        {
            _id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            isEmailVerified: true,
            createdAt: "2024-01-15",
        },
        {
            _id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "vendor",
            isEmailVerified: true,
            createdAt: "2024-02-20",
        },
        {
            _id: "3",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            isEmailVerified: true,
            createdAt: "2024-01-01",
        },
        {
            _id: "4",
            name: "Bob Wilson",
            email: "bob@example.com",
            role: "user",
            isEmailVerified: false,
            createdAt: "2024-03-10",
        },
        {
            _id: "5",
            name: "Alice Brown",
            email: "alice@example.com",
            role: "user",
            isEmailVerified: true,
            createdAt: "2024-02-28",
        },
    ];

    const filteredUsers = mockUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "admin":
                return "destructive";
            case "vendor":
                return "default";
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Users Management</h2>
                    <p className="text-muted-foreground mt-1">Manage all registered users</p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">All Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Name</TableHead>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Joined</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user._id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                                                {user.isEmailVerified ? "Verified" : "Unverified"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="hover:text-primary">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

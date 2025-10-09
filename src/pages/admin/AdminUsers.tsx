import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit, Trash2, Mail, Calendar, Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/types/auth";
import { getUsers, updateUser, deleteUser, UpdateUserData } from "@/api/userApi";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import { useToast } from "@/hooks/use-toast";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminUsers() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const { toast } = useToast();

    const fetchUsers = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await getUsers({ page, limit: 10 });
            setUsers(response.data.users);
            setTotalPages(response.pagination.pages);
            setTotalUsers(response.pagination.total);
            setCurrentPage(page);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to load users",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpdateUser = async (userId: string, data: UpdateUserData) => {
        try {
            await updateUser(userId, data);
            toast({
                title: "Success",
                description: "User updated successfully",
            });
            fetchUsers(currentPage);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update user",
            });
            throw error;
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
            fetchUsers(currentPage);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to delete user",
            });
        }
    };

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
                    <CardTitle className="text-foreground">All Users ({totalUsers})</CardTitle>
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

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No users found
                        </div>
                    ) : (
                        <>
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
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-primary"
                                                            onClick={() => setEditingUser(user)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-destructive"
                                                            onClick={() => setDeletingUser(user)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-4 flex justify-center">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => currentPage > 1 && fetchUsers(currentPage - 1)}
                                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                />
                                            </PaginationItem>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <PaginationItem key={i + 1}>
                                                    <PaginationLink
                                                        onClick={() => fetchUsers(i + 1)}
                                                        isActive={currentPage === i + 1}
                                                        className="cursor-pointer"
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => currentPage < totalPages && fetchUsers(currentPage + 1)}
                                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <EditUserDialog
                user={editingUser}
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
                onSave={handleUpdateUser}
            />

            <DeleteUserDialog
                user={deletingUser}
                open={!!deletingUser}
                onOpenChange={(open) => !open && setDeletingUser(null)}
                onConfirm={handleDeleteUser}
            />
        </div>
    );
}

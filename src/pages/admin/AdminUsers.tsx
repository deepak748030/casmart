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
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Users Management</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage all registered users</p>
                </div>
                <Button className="gap-2" size="sm">
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg text-foreground">All Users ({totalUsers})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 text-xs sm:text-sm"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-sm text-muted-foreground">
                            No users found
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border border-border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-semibold text-xs sm:text-sm">Name</TableHead>
                                            <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                                            <TableHead className="font-semibold text-xs sm:text-sm">Role</TableHead>
                                            <TableHead className="font-semibold text-xs sm:text-sm hidden lg:table-cell">Status</TableHead>
                                            <TableHead className="font-semibold text-xs sm:text-sm hidden xl:table-cell">Joined</TableHead>
                                            <TableHead className="text-right font-semibold text-xs sm:text-sm">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user._id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground text-xs sm:text-sm">
                                                    <div>
                                                        <p className="truncate max-w-[120px] sm:max-w-none">{user.name}</p>
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground md:hidden truncate max-w-[120px]">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                                                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="truncate max-w-[200px]">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize text-[10px] sm:text-xs">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <Badge variant={user.isEmailVerified ? "default" : "secondary"} className="text-[10px] sm:text-xs">
                                                        {user.isEmailVerified ? "Verified" : "Unverified"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden xl:table-cell">
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-primary h-8 w-8"
                                                            onClick={() => setEditingUser(user)}
                                                        >
                                                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:text-destructive h-8 w-8"
                                                            onClick={() => setDeletingUser(user)}
                                                        >
                                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
                                        <PaginationContent className="flex-wrap gap-1">
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

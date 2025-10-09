import { User } from "@/types/auth";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (userId: string) => Promise<void>;
}

export function DeleteUserDialog({ user, open, onOpenChange, onConfirm }: DeleteUserDialogProps) {
    const handleConfirm = async () => {
        if (!user) return;
        await onConfirm(user._id);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>{user?.name}</strong> ({user?.email})?
                        This action cannot be undone and will permanently remove all user data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete User
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

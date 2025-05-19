import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../store/authSlice';
import { User } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, UserCircle } from "lucide-react";
import { formatDate } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';

export default function UserManagementPage() {
  const [location, setLocation] = useLocation();
  const isAdmin = useSelector(selectIsAdmin);
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (isAdmin === false) {
      setLocation('/');
    }
  }, [isAdmin, setLocation]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Use mock data for now since we don't have a users endpoint in the API
        // In a real implementation, we would fetch from the API
        // const response = await apiRequest('GET', '/api/admin/users');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockUsers: User[] = [
          {
            id: 1,
            username: 'johndoe',
            email: 'john@example.com',
            role: 'admin',
            createdAt: '2023-01-10T12:00:00.000Z',
          },
          {
            id: 2,
            username: 'janedoe',
            email: 'jane@example.com',
            role: 'dealer',
            createdAt: '2023-02-15T14:30:00.000Z',
          },
          {
            id: 3,
            username: 'robertsmith',
            email: 'robert@example.com',
            role: 'dealer',
            createdAt: '2023-03-22T09:15:00.000Z',
          },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, toast]);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // In a real application, we would call the API
      // await apiRequest('DELETE', `/api/admin/users/${userToDelete.id}`);
      
      // Mock implementation
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      toast({
        title: 'User deleted',
        description: `${userToDelete.username} has been removed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-neutral-100">
          User Management
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage dealer and admin accounts
        </p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary dark:text-blue-400 hover:text-primary-light dark:hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      disabled={user.id === 1} // Prevent deleting the first admin (demo purpose)
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          icon={UserCircle}
          title="No users found"
          description="There are no users in the system yet."
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user "{userToDelete?.username}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

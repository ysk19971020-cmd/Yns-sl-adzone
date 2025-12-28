'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  id: string;
  phoneNumber?: string;
  isAdmin?: boolean;
}

export default function UsersPage() {
  const firestore = useFirestore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!firestore) return;
      setIsLoading(true);
      try {
        const usersCollection = collection(firestore, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const usersList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch users.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [firestore, toast]);

  const handleAdminToggle = async (userId: string, newIsAdmin: boolean) => {
    if (!firestore) return;
    try {
      const userDocRef = doc(firestore, 'users', userId);
      // Use setDoc with merge to create the doc if it doesn't exist, or update it if it does.
      await setDoc(userDocRef, { isAdmin: newIsAdmin }, { merge: true });
      
      setUsers(currentUsers =>
        currentUsers.map(u => (u.id === userId ? { ...u, isAdmin: newIsAdmin } : u))
      );
      toast({
        title: 'Success',
        description: `User admin status updated.`,
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update admin status.',
      });
      // Revert UI change on failure
      setUsers(currentUsers =>
        currentUsers.map(u => (u.id === userId ? { ...u, isAdmin: !newIsAdmin } : u))
      );
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            Manage user roles and permissions. Toggle the switch to grant or revoke admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead className="text-right">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.phoneNumber || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{user.id}</TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={user.isAdmin}
                        onCheckedChange={(newIsAdmin) => handleAdminToggle(user.id, newIsAdmin)}
                        aria-label={`Toggle admin for user ${user.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

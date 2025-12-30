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
  email?: string;
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
          title: 'දෝෂයකි',
          description: 'පරිශීලකයින් ලබා ගැනීමට නොහැකි විය.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [firestore, toast]);

  const handleAdminToggle = async (userId: string, newIsAdmin: boolean) => {
    if (!firestore) return;
    
    // Optimistically update the UI
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === userId ? { ...u, isAdmin: newIsAdmin } : u))
    );

    try {
      const userDocRef = doc(firestore, 'users', userId);
      await setDoc(userDocRef, { isAdmin: newIsAdmin }, { merge: true });
      
      toast({
        title: 'සාර්ථකයි',
        description: `පරිශීලක පරිපාලක තත්ත්වය යාවත්කාලීන කරන ලදී.`,
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        variant: 'destructive',
        title: 'දෝෂයකි',
        description: 'පරිපාලක තත්ත්වය යාවත්කාලීන කිරීමට අසමත් විය.',
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
        <h1 className="text-lg font-semibold md:text-2xl">පරිශීලක කළමනාකරණය</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ලියාපදිංචි පරිශීලකයින්</CardTitle>
          <CardDescription>
            පරිශීලක භූමිකාවන් සහ අවසරයන් කළමනාකරණය කරන්න. පරිපාලක වරප්‍රසාද ලබා දීමට හෝ අවලංගු කිරීමට ස්විචය ටොගල් කරන්න.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ඊමේල්</TableHead>
                <TableHead>පරිශීලක ID</TableHead>
                <TableHead className="text-right">පරිපාලක</TableHead>
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
                    <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{user.id}</TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={!!user.isAdmin}
                        onCheckedChange={(newIsAdmin) => handleAdminToggle(user.id, newIsAdmin)}
                        aria-label={`Toggle admin for user ${user.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">පරිශීලකයින් හමු නොවීය.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

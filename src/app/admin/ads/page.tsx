'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import Image from 'next/image';

interface AdData {
  id: string;
  title: string;
  price: number;
  categoryId: string;
  district: string;
  userId: string;
  imageUrls: string[];
  createdAt: any;
}

export default function AdsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const adsQuery = useMemoFirebase(
    () => firestore ? collection(firestore, 'ads') : null,
    [firestore]
  );
  
  const { data: ads, isLoading: isLoadingAds } = useCollection<AdData>(adsQuery);

  const handleDeleteAd = async (adId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'ads', adId));
      toast({
        title: "Success",
        description: "Ad has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the ad.",
      });
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Ad Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Classified Ads</CardTitle>
          <CardDescription>
            View and manage all classified ads posted on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>District</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAds ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                  </TableRow>
                ))
              ) : ads && ads.length > 0 ? (
                ads.map(ad => (
                  <TableRow key={ad.id}>
                    <TableCell className="flex items-center gap-4">
                      <Image 
                        src={ad.imageUrls?.[0] || 'https://placehold.co/64x64?text=N/A'}
                        alt={ad.title}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                      <span className="font-medium">{ad.title}</span>
                    </TableCell>
                    <TableCell>LKR {ad.price.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{ad.categoryId}</Badge></TableCell>
                    <TableCell>{ad.district}</TableCell>
                    <TableCell className="font-mono text-xs">{ad.userId}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the ad
                                "{ad.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAd(ad.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No ads found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

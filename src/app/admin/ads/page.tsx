'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
import { Switch } from "@/components/ui/switch";

interface AdData {
  id: string;
  title: string;
  price: number;
  categoryId: string;
  district: string;
  userId: string;
  imageUrls: string[];
  createdAt: any;
  status: 'active' | 'suspended';
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
        title: "සාර්ථකයි",
        description: "දැන්වීම සාර්ථකව මකා දමන ලදී.",
      });
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast({
        variant: "destructive",
        title: "දෝෂයකි",
        description: "දැන්වීම මැකීමට නොහැකි විය.",
      });
    }
  };
  
  const handleStatusToggle = async (adId: string, currentStatus: 'active' | 'suspended') => {
      if (!firestore) return;
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      try {
        await updateDoc(doc(firestore, 'ads', adId), { status: newStatus });
        toast({
          title: "සාර්ථකයි",
          description: `දැන්වීමේ තත්ත්වය ${newStatus} ලෙස යාවත්කාලීන කරන ලදී.`,
        });
      } catch (error) {
        console.error("Error toggling ad status:", error);
        toast({
            variant: "destructive",
            title: "දෝෂයකි",
            description: "දැන්වීමේ තත්ත්වය යාවත්කාලීන කිරීමට නොහැකි විය.",
        });
      }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">දැන්වීම් කළමනාකරණය</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>සියලුම වර්ගීකෘත දැන්වීම්</CardTitle>
          <CardDescription>
            වේදිකාවේ පළ කර ඇති සියලුම වර්ගීකෘත දැන්වීම් බලන්න සහ කළමනාකරණය කරන්න.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>දැන්වීම</TableHead>
                <TableHead>මිල</TableHead>
                <TableHead>ප්‍රවර්ගය</TableHead>
                <TableHead>තත්ත්වය</TableHead>
                <TableHead>පරිශීලක ID</TableHead>
                <TableHead className="text-right">ක්‍රියා</TableHead>
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
                    <TableCell>රු. {ad.price.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline">{ad.categoryId}</Badge></TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                             <Switch
                                checked={ad.status === 'active'}
                                onCheckedChange={() => handleStatusToggle(ad.id, ad.status)}
                                aria-label="Toggle ad status"
                            />
                            <Badge variant={ad.status === 'active' ? 'default' : 'destructive'}>
                                {ad.status === 'active' ? 'සක්‍රියයි' : 'අක්‍රියයි'}
                            </Badge>
                        </div>
                    </TableCell>
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
                              <AlertDialogTitle>ඔබට සම්පූර්ණයෙන්ම විශ්වාසද?</AlertDialogTitle>
                              <AlertDialogDescription>
                                මෙම ක්‍රියාව ආපසු හැරවිය නොහැක. මෙය "{ad.title}" දැන්වීම ස්ථිරවම මකා දමනු ඇත.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>අවලංගු කරන්න</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAd(ad.id)}>මකන්න</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">දැන්වීම් හමු නොවීය.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
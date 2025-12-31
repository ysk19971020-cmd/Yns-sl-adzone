'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import Image from 'next/image';
import { add } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BannerData {
  id: string;
  userId: string;
  imageUrl: string;
  position: string;
  categoryId: string;
  status: 'Pending' | 'Active' | 'Rejected' | 'Expired';
  createdAt: any;
  targetId?: string; // from payment
  description: string;
}

export default function BannersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const bannersQuery = useMemoFirebase(
    () => firestore ? collection(firestore, 'banners') : null,
    [firestore]
  );
  
  const { data: banners, isLoading: isLoadingBanners } = useCollection<BannerData>(bannersQuery);
  
  const handleBannerAction = async (bannerId: string, newStatus: 'Active' | 'Rejected') => {
    if (!firestore || !banners) return;

    const bannerToUpdate = banners.find(b => b.id === bannerId);
    if (!bannerToUpdate) return;
    
    try {
      const bannerRef = doc(firestore, 'banners', bannerId);
      const updateData: any = { status: newStatus };

      if (newStatus === 'Active') {
          // This logic is simplified. A real app might need to fetch duration info associated with the payment.
          const startDate = new Date();
          // Assuming a default duration, e.g., 1 month, if not specified elsewhere.
          const expiryDate = add(startDate, { months: 1 });
          updateData.startDate = startDate;
          updateData.expiryDate = expiryDate;
      }
      
      await updateDoc(bannerRef, updateData);
      
      toast({
        title: "සාර්ථකයි",
        description: `බැනරය සාර්ථකව ${newStatus === 'Active' ? 'අනුමත කරන ලදී' : 'ප්‍රතික්ෂේප කරන ලදී'}.`,
      });
    } catch (error) {
      console.error("Error updating banner:", error);
      toast({
        variant: "destructive",
        title: "දෝෂයකි",
        description: "බැනරය යාවත්කාලීන කිරීමට නොහැකි විය.",
      });
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">බැනර් කළමනාකරණය</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>බැනර් දැන්වීම්</CardTitle>
          <CardDescription>
            බැනර් දැන්වීම් ස්ථානගත කිරීම් අනුමත කිරීම, ප්‍රතික්ෂේප කිරීම සහ කළමනාකරණය කිරීම.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>බැනරය</TableHead>
                <TableHead>තත්ත්වය</TableHead>
                <TableHead>ස්ථානය</TableHead>
                <TableHead>ප්‍රවර්ගය</TableHead>
                <TableHead>පරිශීලක ID</TableHead>
                <TableHead className="text-right">ක්‍රියා</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBanners ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 inline-block" /></TableCell>
                  </TableRow>
                ))
              ) : banners && banners.length > 0 ? (
                banners.map(banner => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Image 
                            src={banner.imageUrl || 'https://placehold.co/100x100?text=N/A'}
                            alt={banner.description}
                            width={80}
                            height={80}
                            className="rounded-md object-cover cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>බැනර් විස්තරය</DialogTitle>
                          </DialogHeader>
                          <div className="relative mt-4 aspect-video w-full">
                            <Image src={banner.imageUrl} alt={banner.description} layout="fill" objectFit="contain" />
                          </div>
                           <p className="text-sm text-muted-foreground mt-2">{banner.description}</p>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                        <Badge variant={banner.status === 'Active' ? 'default' : banner.status === 'Pending' ? 'secondary' : 'destructive'}>
                            {banner.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{banner.position}</TableCell>
                    <TableCell>{banner.categoryId}</TableCell>
                    <TableCell className="font-mono text-xs">{banner.userId}</TableCell>
                    <TableCell className="text-right">
                       {banner.status === 'Pending' && (
                         <div className="space-x-2">
                           <Button variant="ghost" size="icon" onClick={() => handleBannerAction(banner.id, 'Active')}>
                             <Check className="h-4 w-4 text-green-500" />
                           </Button>
                           <Button variant="ghost" size="icon" onClick={() => handleBannerAction(banner.id, 'Rejected')}>
                             <X className="h-4 w-4 text-destructive" />
                           </Button>
                         </div>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">බැනර් හමු නොවීය.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

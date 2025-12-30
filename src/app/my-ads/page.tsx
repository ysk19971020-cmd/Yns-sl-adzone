'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { AdCard } from '@/components/ad-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

export default function MyAdsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const adsQuery = useMemoFirebase(
    () => {
      if (!firestore || !user) return null;
      return query(collection(firestore, 'ads'), where('userId', '==', user.uid));
    },
    [firestore, user]
  );

  const { data: userAds, isLoading: isLoadingAds } = useCollection<any>(adsQuery);

  const handleDelete = async (adId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'ads', adId));
      toast({
        title: 'දැන්වීම මකා දමන ලදී',
        description: 'ඔබගේ දැන්වීම සාර්ථකව මකා දමන ලදී.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'දෝෂයකි',
        description: 'දැන්වීම මැකීමට අසමත් විය: ' + error.message,
      });
    }
  };


  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">මගේ දැන්වීම්</CardTitle>
          <CardDescription>ඔබ පළ කර ඇති සියලුම දැන්වීම් බලන්න සහ කළමනාකරණය කරන්න.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAds && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            ))}
            </div>
          )}
          {!isLoadingAds && userAds && userAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userAds.map((ad: any) => (
                <div key={ad.id} className="relative group">
                  <AdCard ad={ad} />
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ඔබට මෙම දැන්වීම මැකීමට අවශ්‍ය බව විශ්වාසද?</AlertDialogTitle>
                          <AlertDialogDescription>
                            මෙම ක්‍රියාව ආපසු හැරවිය නොහැක. මෙය ඔබගේ "{ad.title}" දැන්වීම ස්ථිරවම මකා දමනු ඇත.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>අවලංගු කරන්න</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(ad.id)}>මකන්න</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              ))}
            </div>
          ) : (
            !isLoadingAds && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-12 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">ඔබ තවමත් කිසිදු දැන්වීමක් පළ කර නැත.</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        යමක් විකිණීමට සූදානම්ද? දැන් ඔබේ පළමු දැන්වීම පළ කරන්න!
                    </p>
                    <Button asChild className="mt-6">
                        <a href="/post-ad">දැන්වීමක් පළ කරන්න</a>
                    </Button>
                </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

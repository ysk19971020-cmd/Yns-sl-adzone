
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { collection, query, where } from 'firebase/firestore';
import { AdCard } from '@/components/ad-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyAdsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

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
          <CardTitle className="text-3xl font-headline">My Ads</CardTitle>
          <CardDescription>View and manage all the ads you have posted.</CardDescription>
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
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            !isLoadingAds && (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-12 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">You haven't posted any ads yet.</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Ready to sell something? Post your first ad now!
                    </p>
                    <Button asChild className="mt-6">
                        <a href="/post-ad">Post an Ad</a>
                    </Button>
                </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}


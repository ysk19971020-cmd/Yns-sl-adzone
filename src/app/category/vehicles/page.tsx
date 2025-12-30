
'use client';

import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';


export default function VehiclesPage() {
  const firestore = useFirestore();

  const adsQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      return query(collection(firestore, 'ads'), where('categoryId', '==', 'vehicles'));
    },
    [firestore]
  );
  
  const { data: vehicleAds, isLoading: isLoadingAds } = useCollection<any>(adsQuery);


  return (
    <>
      {/* Vehicle Page Banners */}
      <div className="banner banner-top">
        <Link href="/post-ad"><span className="add-your-ad">Post Your Vehicle Ad Here!</span></Link>
      </div>
      <div className="banner banner-left">
        <Link href="/post-ad"><span className="add-your-ad">Vehicle Ads</span></Link>
      </div>
      <div className="banner banner-right">
        <Link href="/post-ad"><span className="add-your-ad">Vehicle Ads</span></Link>
      </div>
      <div className="banner banner-bottom">
        <Link href="/post-ad"><span className="add-your-ad">Post Your Vehicle Ad Here!</span></Link>
      </div>

      <div className="container mx-auto px-4 py-12 main-with-banners">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Vehicle Ads</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find cars, bikes, vans, and more.
          </p>
        </div>

        {/* Mid-page banner */}
        <div className="my-8 p-6 bg-accent/20 rounded-lg text-center">
            <h3 className="font-bold text-accent-foreground text-2xl add-your-ad"><Link href="/post-ad">ඔබේ වාහන දැන්වීම මෙහි පල කරන්න!</Link></h3>
        </div>
        
        {isLoadingAds && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            ))}
          </div>
        )}

        {!isLoadingAds && vehicleAds && vehicleAds.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {vehicleAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" disabled>Load More</Button>
            </div>
          </>
        ) : (
          !isLoadingAds && (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>No Ads Found</CardTitle>
                    <CardDescription>
                        There are currently no ads in the vehicles category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
                        <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Vehicle ads will be displayed here
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Check back later to find the best deals on vehicles.
                        </p>
                        <Button asChild className="mt-4">
                            <a href="/post-ad">Post an Ad</a>
                        </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          )
        )}
      </div>
    </>
  );
}

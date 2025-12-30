'use client';

import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesPage() {
    const firestore = useFirestore();

    const adsQuery = useMemoFirebase(
      () => {
        if (!firestore) return null;
        return query(collection(firestore, 'ads'), where('categoryId', '==', 'properties'));
      },
      [firestore]
    );

    const { data: propertyAds, isLoading: isLoadingAds } = useCollection<any>(adsQuery);

  return (
    <>
      {/* Property Page Banners */}
      <div className="banner banner-top">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ දේපළ දැන්වීම මෙහි පළ කරන්න!</span></Link>
      </div>
      <div className="banner banner-left">
        <Link href="/post-ad"><span className="add-your-ad">දේපළ දැන්වීම්</span></Link>
      </div>
      <div className="banner banner-right">
        <Link href="/post-ad"><span className="add-your-ad">දේපළ දැන්වීම්</span></Link>
      </div>
      <div className="banner banner-bottom">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ දේපළ දැන්වීම මෙහි පළ කරන්න!</span></Link>
      </div>

      <div className="container mx-auto px-4 py-12 main-with-banners">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">දේපළ දැන්වීම්</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            ඉඩම්, නිවාස, සහ මහල් නිවාස සොයා ගන්න.
          </p>
        </div>

        {/* Mid-page banner */}
        <div className="my-8 p-6 bg-accent/20 rounded-lg text-center">
            <h3 className="font-bold text-accent-foreground text-2xl add-your-ad"><Link href="/post-ad">ඔබේ ඉඩම් හා නිවාස දැන්වීම මෙහි පළ කරන්න!</Link></h3>
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

        {!isLoadingAds && propertyAds && propertyAds.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {propertyAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" disabled>තවත් පූරණය කරන්න</Button>
            </div>
          </>
        ) : (
          !isLoadingAds && (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>දැන්වීම් හමු නොවීය</CardTitle>
                    <CardDescription>
                        දේපළ ප්‍රවර්ගයේ දැනට දැන්වීම් නොමැත.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
                        <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            දේපළ දැන්වීම් මෙහි දර්ශනය වනු ඇත
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            දේපළ පිළිබඳ හොඳම ගනුදෙනු සොයා ගැනීමට පසුව නැවත පරීක්ෂා කරන්න.
                        </p>
                        <Button asChild className="mt-4">
                            <a href="/post-ad">දැන්වීමක් පළ කරන්න</a>
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

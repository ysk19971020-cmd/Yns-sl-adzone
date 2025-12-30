'use client';

import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { subCategories18Plus } from '@/lib/18-plus-categories';

export default function EighteenPlusSubCategoryPage() {
  const firestore = useFirestore();
  const params = useParams();
  const slug = params.slug as string;

  const currentCategory = subCategories18Plus.find(cat => cat.slug === slug);

  const adsQuery = useMemoFirebase(
    () => {
      if (!firestore || !slug) return null;
      // We are querying the main categoryId as '18-plus' and then the subcategory slug
      // The schema needs to support a sub-category field on the ad document for this to work perfectly.
      // For now, let's assume `categoryId` can hold values like `18-plus-girls-personal`.
      // We'll query for `categoryId` == '18-plus' and then filter client side, as a workaround.
      return query(collection(firestore, 'ads'), where('categoryId', '==', '18-plus'));
    },
    [firestore, slug]
  );
  
  // NOTE: This is a client-side filter. For production, you'd add a `subCategoryId` field
  // to your Firestore documents and query on that directly for better performance.
  const { data: ads, isLoading: isLoadingAds } = useCollection<any>(adsQuery, (data) =>
    data.filter(ad => ad.subCategoryId === slug)
  );

  return (
    <>
      {/* 18+ Sub-Category Page Banners */}
      <div className="banner banner-top">
        <Link href="/post-ad"><span className="add-your-ad">Post Your 18+ Ad Here!</span></Link>
      </div>
      <div className="banner banner-left">
        <Link href="/post-ad"><span className="add-your-ad">18+ Ads</span></Link>
      </div>
      <div className="banner banner-right">
        <Link href="/post-ad"><span className="add-your-ad">18+ Ads</span></Link>
      </div>
      <div className="banner banner-bottom">
        <Link href="/post-ad"><span className="add-your-ad">Post Your 18+ Ad Here!</span></Link>
      </div>

      <div className="container mx-auto px-4 py-12 main-with-banners">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">{currentCategory?.name || '18+ Ads'}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse ads in the {currentCategory?.name.toLowerCase()} category.
          </p>
        </div>

        <div className="my-8 p-6 bg-accent/20 rounded-lg text-center">
            <h3 className="font-bold text-accent-foreground text-2xl add-your-ad"><Link href="/post-ad">Post Your Ad in this Category!</Link></h3>
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

        {!isLoadingAds && ads && ads.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ads.map((ad) => (
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
                        There are currently no ads in this sub-category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
                        <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Be the first to post!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                           Your ad could be the first one here.
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

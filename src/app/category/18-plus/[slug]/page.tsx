'use client';

import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { subCategories18Plus } from '@/lib/18-plus-categories';
import { useState, useEffect } from 'react';

export default function EighteenPlusSubCategoryPage() {
  const firestore = useFirestore();
  const params = useParams();
  const slug = params.slug as string;

  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const currentCategory = subCategories18Plus.find(cat => cat.slug === slug);

  useEffect(() => {
    const fetchInitialAds = async () => {
      if (!firestore || !slug) return;
      setIsLoading(true);
      const first = query(
        collection(firestore, "ads"), 
        where('categoryId', '==', '18-plus'), 
        where('subCategoryId', '==', slug),
        orderBy("createdAt", "desc"), 
        limit(8)
      );
      const documentSnapshots = await getDocs(first);

      const newAds = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(newAds);

      const last = documentSnapshots.docs[documentSnapshots.docs.length-1];
      setLastVisible(last);

      setHasMore(documentSnapshots.docs.length === 8);
      setIsLoading(false);
    };

    fetchInitialAds();
  }, [firestore, slug]);
  
  const handleLoadMore = async () => {
    if (!firestore || !lastVisible || !hasMore) return;
    setIsLoading(true);

    const next = query(
        collection(firestore, "ads"), 
        where('categoryId', '==', '18-plus'), 
        where('subCategoryId', '==', slug),
        orderBy("createdAt", "desc"), 
        startAfter(lastVisible), 
        limit(8)
    );

    const documentSnapshots = await getDocs(next);
    const newAds = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAds(prevAds => [...prevAds, ...newAds]);
    
    const last = documentSnapshots.docs[documentSnapshots.docs.length-1];
    setLastVisible(last);
    
    setHasMore(documentSnapshots.docs.length === 8);
    setIsLoading(false);
  };

  return (
    <>
      {/* 18+ Sub-Category Page Banners */}
      <div className="banner banner-top">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ 18+ දැන්වීම මෙහි පළ කරන්න!</span></Link>
      </div>
      <div className="banner banner-left">
        <Link href="/post-ad"><span className="add-your-ad">18+ දැන්වීම්</span></Link>
      </div>
      <div className="banner banner-right">
        <Link href="/post-ad"><span className="add-your-ad">18+ දැන්වීම්</span></Link>
      </div>
      <div className="banner banner-bottom">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ 18+ දැන්වීම මෙහි පළ කරන්න!</span></Link>
      </div>

      <div className="container mx-auto px-4 py-12 main-with-banners">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">{currentCategory?.name || '18+ දැන්වීම්'}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {currentCategory?.name.toLowerCase()} ප්‍රවර්ගයේ දැන්වීම් බලන්න.
          </p>
        </div>

        <div className="my-8 p-6 bg-accent/20 rounded-lg text-center">
            <h3 className="font-bold text-accent-foreground text-2xl add-your-ad"><Link href="/post-ad">මෙම ප්‍රවර්ගයේ ඔබේ දැන්වීම පළ කරන්න!</Link></h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
            ))}
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            ))}
        </div>

        {!isLoading && ads.length === 0 && (
           <Card className="mt-8 col-span-full">
                <CardHeader>
                    <CardTitle>දැන්වීම් හමු නොවීය</CardTitle>
                    <CardDescription>
                        මෙම උප-ප්‍රවර්ගයේ දැනට දැන්වීම් නොමැත.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
                        <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            පළමුවැන්නා වන්න!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                           ඔබගේ දැන්වීම මෙහි පළමු දැන්වීම විය හැක.
                        </p>
                        <Button asChild className="mt-4">
                            <a href="/post-ad">දැන්වීමක් පළ කරන්න</a>
                        </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {hasMore && !isLoading && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={isLoading}>
                {isLoading ? 'පූරණය වෙමින්...' : 'තවත් පූරණය කරන්න'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

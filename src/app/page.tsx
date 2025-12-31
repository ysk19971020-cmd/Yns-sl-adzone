'use client';

import { useState, useMemo, useCallback } from 'react';
import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories } from '@/lib/data';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Icon as LucideIcon } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, limit, query, where, getDocs, startAfter, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchInitialAds = useCallback(async () => {
    if (!firestore) return;
    setIsLoading(true);

    let adsQuery: any = query(collection(firestore, 'ads'), orderBy('createdAt', 'desc'), limit(8));
    
    // Apply search filters if they exist
    if (searchTerm) {
        // Note: Firestore does not support full-text search natively on multiple fields like this.
        // For a production app, a dedicated search service like Algolia or Typesense is recommended.
        // This is a simplified client-side filter for demonstration.
    }
    if (locationTerm) {
       adsQuery = query(adsQuery, where('district', '>=', locationTerm), where('district', '<=', locationTerm + '\uf8ff'));
    }

    try {
        const documentSnapshots = await getDocs(adsQuery);
        const newAds = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let filteredAds = newAds;
        if(searchTerm){
             filteredAds = newAds.filter(ad => ad.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setAds(filteredAds);
        const last = documentSnapshots.docs[documentSnapshots.docs.length-1];
        setLastVisible(last);
        setHasMore(documentSnapshots.docs.length === 8);
    } catch (error) {
        console.error("Error fetching initial ads: ", error);
    } finally {
        setIsLoading(false);
    }
  }, [firestore, searchTerm, locationTerm]);

  // Fetch initial ads on component mount and when filters change
  useState(() => {
    fetchInitialAds();
  });
  
  const handleSearch = () => {
      fetchInitialAds();
  }
  
  const handleLoadMore = async () => {
    if (!firestore || !lastVisible || !hasMore) return;
    setIsLoading(true);

    let adsQuery = query(collection(firestore, "ads"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(8));
    
    if (locationTerm) {
       adsQuery = query(adsQuery, where('district', '>=', locationTerm), where('district', '<=', locationTerm + '\uf8ff'));
    }

    const documentSnapshots = await getDocs(adsQuery);
    const newAds = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    let filteredAds = newAds;
    if(searchTerm){
         filteredAds = newAds.filter(ad => ad.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setAds(prevAds => [...prevAds, ...filteredAds]);
    const last = documentSnapshots.docs[documentSnapshots.docs.length-1];
    setLastVisible(last);
    setHasMore(documentSnapshots.docs.length === 8);
    setIsLoading(false);
  };


  return (
    <>
      {/* Homepage Banners */}
      <div className="banner banner-top">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span></Link>
      </div>
      <div className="banner banner-left">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span></Link>
      </div>
      <div className="banner banner-right">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span></Link>
      </div>
      <div className="banner banner-bottom">
        <Link href="/post-ad"><span className="add-your-ad">ඔබේ දැන්වීම එක් කරන්න</span></Link>
      </div>
      
      <div className="flex flex-col items-center main-with-banners">
        <section className="w-full bg-card py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground">
              ශ්‍රී ලංකාවේ ඕනෑම දෙයක් සොයන්න
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              වාහන, දේපළ, ඉලෙක්ට්‍රොනික උපකරණ සහ තවත් දේ සඳහා ඔබේ එකම වෙළඳපොළ.
            </p>
            <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 p-4 bg-background rounded-lg shadow-inner">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ඔබ සොයන්නේ කුමක්ද?"
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-grow w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ස්ථානය (උදා: කොළඹ)"
                  className="pl-10 w-full"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90" onClick={handleSearch}>
                <Search className="mr-2" />
                සොයන්න
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center font-headline mb-8">
              ප්‍රවර්ග පිරික්සන්න
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link href={`/category/${category.slug}`} key={category.slug}>
                    <div className="group flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                      <div className="p-4 bg-primary/20 rounded-full mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
             <div className="my-8 p-6 bg-accent/20 rounded-lg text-center mt-12">
               <h3 className="font-bold text-accent-foreground text-2xl add-your-ad"><Link href="/post-ad">ඔබේ දැන්වීම මෙහි පළ කරන්න!</Link></h3>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center font-headline mb-8 add-your-ad text-foreground">
              නවතම දැන්වීම්
            </h2>
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
            
            {!isLoading && ads && ads.length === 0 && (
              <div className="text-center text-muted-foreground py-16">
                <p>ඔබගේ සෙවුමට ගැලපෙන දැන්වීම් හමු නොවීය.</p>
              </div>
            )}
            
            {hasMore && !isLoading && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" onClick={handleLoadMore}>තවත් දැන්වීම් බලන්න</Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

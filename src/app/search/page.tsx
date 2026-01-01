'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { AdCard } from '@/components/ad-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';
import { districts } from '@/lib/districts';

function SearchComponent() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Search filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt-desc');

  const buildQuery = (forLoadMore = false) => {
    let q: any = collection(firestore, 'ads');
    
    if (district) {
      q = query(q, where('district', '==', district));
    }
    if (category) {
      q = query(q, where('categoryId', '==', category));
    }

    const [sortField, sortDirection] = sortBy.split('-') as ['price' | 'createdAt', 'asc' | 'desc'];
    q = query(q, orderBy(sortField, sortDirection));

    if (forLoadMore && lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    return query(q, limit(12));
  };
  
  const fetchAds = async (loadMore = false) => {
      if (!firestore) return;
      setIsLoading(true);

      try {
        let adsQuery = buildQuery(loadMore);
        const documentSnapshots = await getDocs(adsQuery);
        let fetchedAds = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Manual filtering for status and text search after fetching
        let filteredAds = fetchedAds.filter(ad => ad.status === 'active');
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filteredAds = filteredAds.filter(ad => 
                ad.title.toLowerCase().includes(lowercasedTerm) || 
                ad.description.toLowerCase().includes(lowercasedTerm)
            );
        }

        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
        setHasMore(documentSnapshots.docs.length === 12);
        
        if (loadMore) {
          setAds(prev => [...prev, ...filteredAds]);
        } else {
          setAds(filteredAds);
        }

      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchAds(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, district, category, sortBy]); // Rerun search if filters change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAds(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>සවිස්තරාත්මක සෙවීම</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search-term" className="text-sm font-medium">සොයන්න</label>
              <Input
                id="search-term"
                placeholder="දැන්වීමේ මාතෘකාව, විස්තරය..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="district-filter" className="text-sm font-medium">දිස්ත්‍රික්කය</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger id="district-filter"><SelectValue placeholder="සියලුම දිස්ත්‍රික්ක" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">සියලුම දිස්ත්‍රික්ක</SelectItem>
                  {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="category-filter" className="text-sm font-medium">ප්‍රවර්ගය</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category-filter"><SelectValue placeholder="සියලුම ප්‍රවර්ග" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">සියලුම ප්‍රවර්ග</SelectItem>
                  {categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <label htmlFor="sort-by" className="text-sm font-medium">වර්ග කරන්න</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">නවතම ඒවා පළමුව</SelectItem>
                  <SelectItem value="price-asc">මිල: අඩු සිට වැඩි</SelectItem>
                  <SelectItem value="price-desc">මිල: වැඩි සිට අඩු</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">සොයන්න</Button>
          </form>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-6">සෙවුම් ප්‍රතිඵල</h2>

      {isLoading && ads.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : ads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
          </div>
          {hasMore && (
            <div className="text-center mt-12">
              <Button onClick={() => fetchAds(true)} disabled={isLoading}>
                {isLoading ? 'පූරණය වෙමින්...' : 'තවත් පූරණය කරන්න'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">ඔබගේ සෙවුමට ගැලපෙන දැන්වීම් හමු නොවීය.</p>
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>ප්‍රතිඵල පූරණය වෙමින්...</div>}>
            <SearchComponent />
        </Suspense>
    )
}

'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Tag, Phone, User, Calendar, Text } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

function AdDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="flex gap-2 mt-2">
                        <Skeleton className="w-20 h-20 rounded" />
                        <Skeleton className="w-20 h-20 rounded" />
                        <Skeleton className="w-20 h-20 rounded" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-12 w-1/2" />
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                         <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                         <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </div>
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        </div>
    );
}

export default function AdDetailPage() {
    const { id } = useParams();
    const firestore = useFirestore();

    const adId = Array.isArray(id) ? id[0] : id;

    const adRef = useMemoFirebase(() => {
        if (!firestore || !adId) return null;
        return doc(firestore, 'ads', adId);
    }, [firestore, adId]);

    const { data: ad, isLoading, error } = useDoc<any>(adRef);

    if (isLoading) {
        return <AdDetailSkeleton />;
    }

    if (error) {
        return <div className="text-center py-12 text-destructive">Error loading ad: {error.message}</div>;
    }

    if (!ad) {
        return <div className="text-center py-12 text-muted-foreground">Ad not found.</div>;
    }
    
    const postedAt = ad.createdAt?.toDate() 
        ? formatDistanceToNow(ad.createdAt.toDate(), { addSuffix: true }) 
        : 'N/A';

    return (
        <div className="container mx-auto max-w-4xl py-12 px-4">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{ad.district}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {postedAt}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {ad.imageUrls.map((url: string, index: number) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                        <Image src={url} alt={`${ad.title} - image ${index + 1}`} fill className="object-cover" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-3xl text-primary">
                                <Tag className="w-8 h-8" />
                                <span>LKR {ad.price.toLocaleString()}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h3 className="font-semibold flex items-center gap-2"><Phone className="w-5 h-5 text-muted-foreground"/>Contact</h3>
                                <p className="text-lg text-foreground">{ad.phoneNumber}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground"/>Seller Information</h3>
                                <p className="text-muted-foreground">User ID: {ad.userId.substring(0,8)}...</p>
                            </div>
                             <div>
                                <h3 className="font-semibold flex items-center gap-2"><Text className="w-5 h-5 text-muted-foreground"/>Category</h3>
                                <Badge variant="secondary">{ad.categoryId}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{ad.description}</p>
            </div>
        </div>
    );
}

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Ad } from '@/lib/data';
import { MapPin, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


interface AdCardProps {
  ad: any; // Using any for now as data comes directly from firestore
}

export function AdCard({ ad }: AdCardProps) {
  const adId = ad.id;
  const postedAt = ad.createdAt?.toDate() 
    ? formatDistanceToNow(ad.createdAt.toDate(), { addSuffix: true }) 
    : 'මෑතකදී';
  
  return (
    <Link href={`/ad/${adId}`}>
      <Card className="overflow-hidden h-full flex flex-col group transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={ad.imageUrls?.[0] || 'https://placehold.co/400x300?text=No+Image'}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge variant="secondary" className="absolute top-2 right-2 capitalize">{ad.categoryId}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-headline font-semibold text-lg leading-snug truncate group-hover:text-primary">
            {ad.title}
          </h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span>{ad.district}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-lg font-semibold text-primary">
              <Tag className="h-5 w-5 mr-1.5" />
              <span>රු. {ad.price.toLocaleString()}</span>
            </div>
            <span className="text-xs text-muted-foreground">{postedAt}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

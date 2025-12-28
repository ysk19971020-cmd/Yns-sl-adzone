import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Ad } from '@/lib/data';
import { MapPin, Tag } from 'lucide-react';

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <Link href={`/ad/${ad.id}`}>
      <Card className="overflow-hidden h-full flex flex-col group transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge variant="secondary" className="absolute top-2 right-2">{ad.categoryName}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-headline font-semibold text-lg leading-snug truncate group-hover:text-primary">
            {ad.title}
          </h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span>{ad.location}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-lg font-semibold text-primary">
              <Tag className="h-5 w-5 mr-1.5" />
              <span>LKR {ad.price.toLocaleString()}</span>
            </div>
            <span className="text-xs text-muted-foreground">{ad.postedAt}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

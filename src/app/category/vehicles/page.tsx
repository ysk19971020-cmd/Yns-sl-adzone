
'use client';

import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ads } from '@/lib/data';

export default function VehiclesPage() {
  const vehicleAds = ads.filter(ad => ad.category === 'vehicles');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Vehicle Ads</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find cars, bikes, vans, and more.
        </p>
      </div>

      {vehicleAds.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vehicleAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">Load More</Button>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
}

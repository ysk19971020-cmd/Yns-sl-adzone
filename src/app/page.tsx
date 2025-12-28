import { AdCard } from '@/components/ad-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories, ads } from '@/lib/data';
import { Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Icon as LucideIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full bg-card py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground">
            Find Anything in Sri Lanka
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your one-stop marketplace for vehicles, properties, electronics, and more.
          </p>
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 p-4 bg-background rounded-lg shadow-inner">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="What are you looking for?"
                className="pl-10 w-full"
              />
            </div>
            <div className="relative flex-grow w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Location (e.g., Colombo)"
                className="pl-10 w-full"
              />
            </div>
            <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              <Search className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">
            Browse Categories
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
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-8">
            Latest Ads
          </h2>
          {ads.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">View More Ads</Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>No ads posted yet. Be the first!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';

import { subCategories18Plus } from '@/lib/18-plus-categories';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function EighteenPlusCategoryPage() {
  return (
    <>
      {/* 18+ Page Banners */}
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
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">18+ Ads</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse through our 18+ categories.
          </p>
        </div>
        
        {/* Mid-page banner */}
        <div className="my-8 p-6 bg-accent/20 rounded-lg text-center">
            <h3 className="font-bold text-accent-foreground text-2xl add-your-ad"><Link href="/post-ad">Post Your 18+ Ads Here!</Link></h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {subCategories18Plus.map((category) => {
            const Icon = category.icon;
            return (
              <Link href={`/category/18-plus/${category.slug}`} key={category.slug}>
                <Card className="group flex flex-col items-center justify-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow text-center h-full">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{category.name}</h3>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
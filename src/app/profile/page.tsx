'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Star, Edit, ShoppingBag, BadgeCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const userMembershipsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'memberships'),
      where('userId', '==', user.uid),
      where('status', '==', 'Active'),
      orderBy('expiryDate', 'desc'),
      limit(1)
    );
  }, [user, firestore]);
  
  const { data: activeMemberships, isLoading: isLoadingMemberships } = useCollection<any>(userMembershipsQuery);
  const activePlan = activeMemberships?.[0];

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Skeleton className="h-32 w-full" />
               <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">මගේ පැතිකඩ</CardTitle>
          <CardDescription>ඔබගේ ගිණුමේ විස්තර සහ සැකසුම් කළමනාකරණය කරන්න.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card-foreground/5">
            <div className="p-3 bg-primary/10 rounded-full">
                <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-foreground">{user.email}</h3>
              <p className="text-sm text-muted-foreground">පරිශීලක ID: {user.uid}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                {isLoadingMemberships ? (
                  <Skeleton className="h-24 w-full" />
                ) : activePlan ? (
                  <>
                    <BadgeCheck className="w-10 h-10 text-green-500 mb-2" />
                    <h4 className="font-semibold capitalize">{activePlan.planId} සැලැස්ම</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      කල් ඉකුත් වේ: {format(activePlan.expiryDate.toDate(), 'PPP')}
                    </p>
                    <Button variant="outline" size="sm" asChild><a href="/pricing">සැලැස්ම කළමනාකරණය කරන්න</a></Button>
                  </>
                ) : (
                  <>
                    <Star className="w-10 h-10 text-accent mb-2" />
                    <h4 className="font-semibold">සාමාජිකත්වය</h4>
                    <p className="text-sm text-muted-foreground mb-3">සක්‍රිය සැලැස්මක් නොමැත</p>
                    <Button variant="outline" size="sm" asChild><a href="/pricing">සැලසුම් බලන්න</a></Button>
                  </>
                )}
            </Card>
             <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <ShoppingBag className="w-10 h-10 text-accent mb-2" />
                <h4 className="font-semibold">මගේ දැන්වීම්</h4>
                <p className="text-sm text-muted-foreground mb-3">ඔබගේ දැන්වීම් කළමනාකරණය කරන්න</p>
                <Button variant="outline" size="sm" asChild><a href="/my-ads">දැන්වීම් කළමනාකරණය කරන්න</a></Button>
            </Card>
          </div>

          <div>
            <Button className="w-full" disabled>
                <Edit className="mr-2 h-4 w-4" /> පැතිකඩ සංස්කරණය කරන්න (ළඟදීම)
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

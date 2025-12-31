'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Star, Edit, ShoppingBag, BadgeCheck, Mail, KeyRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { updateEmail, updatePassword } from 'firebase/auth';

const profileSchema = z.object({
  email: z.string().email('කරුණාකර වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න.'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය.'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'මුරපද නොගැලපේ',
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const emailForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user?.email || '' },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user) {
      emailForm.setValue('email', user.email || '');
    }
  }, [user, isUserLoading, router, emailForm]);

  const onEmailSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updateEmail(user, data.email);
      toast({ title: 'සාර්ථකයි', description: 'ඔබගේ ඊමේල් ලිපිනය යාවත්කාලීන කරන ලදී. කරුණාකර නැවත පිවිසෙන්න.' });
       router.push('/login');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'ඊමේල් ලිපිනය යාවත්කාලීන කිරීමට නොහැකි විය: ' + error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await updatePassword(user, data.newPassword);
      toast({ title: 'සාර්ථකයි', description: 'ඔබගේ මුරපදය සාර්ථකව වෙනස් කරන ලදී.' });
      passwordForm.reset();
    } catch (error: any)
    {
      toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'මුරපදය වෙනස් කිරීමට නොහැකි විය: ' + error.message });
    } finally {
      setIsUpdating(false);
    }
  };

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

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5"/>ඊමේල් ලිපිනය වෙනස් කරන්න</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField control={emailForm.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>නව ඊමේල්</FormLabel>
                                <FormControl><Input placeholder="නව ඊමේල් ලිපිනය" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isUpdating}>{isUpdating ? 'යාවත්කාලීන කරමින්...' : 'ඊමේල් යාවත්කාලීන කරන්න'}</Button>
                    </form>
                </Form>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5"/>මුරපදය වෙනස් කරන්න</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>නව මුරපදය</FormLabel>
                                <FormControl><Input type="password" placeholder="නව මුරපදය" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel>නව මුරපදය තහවුරු කරන්න</FormLabel>
                                <FormControl><Input type="password" placeholder="මුරපදය තහවුරු කරන්න" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isUpdating}>{isUpdating ? 'වෙනස් කරමින්...' : 'මුරපදය වෙනස් කරන්න'}</Button>
                    </form>
                </Form>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
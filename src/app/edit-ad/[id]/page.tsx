'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { categories } from '@/lib/data';
import { districts } from '@/lib/districts';
import { subCategories18Plus } from '@/lib/18-plus-categories';
import { doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


// Classified Ad Schema
const classifiedAdSchema = z.object({
  title: z.string().min(5, 'මාතෘකාව අවම වශයෙන් අක්ෂර 5ක් විය යුතුය'),
  description: z.string().min(20, 'විස්තරය අවම වශයෙන් අක්ෂර 20ක් විය යුතුය'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), 
    z.number().positive('මිල ධන සංඛ්‍යාවක් විය යුතුය')),
  categoryId: z.string({ required_error: 'කරුණාකර ප්‍රවර්ගයක් තෝරන්න' }),
  subCategoryId: z.string().optional(),
  district: z.string({ required_error: 'කරුණාකර දිස්ත්‍රික්කයක් තෝරන්න' }),
  phoneNumber: z.string().min(10, 'කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න'),
});
type ClassifiedAdFormValues = z.infer<typeof classifiedAdSchema>;


export default function EditAdPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const params = useParams();
  const adId = params.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const adRef = useMemoFirebase(() => firestore && adId ? doc(firestore, 'ads', adId) : null, [firestore, adId]);
  const { data: adData, isLoading: isLoadingAd } = useDoc<any>(adRef);

  const form = useForm<ClassifiedAdFormValues>({
    resolver: zodResolver(classifiedAdSchema),
    defaultValues: { 
        title: '',
        description: '',
        price: 0,
        categoryId: '',
        subCategoryId: '',
        district: '',
        phoneNumber: ''
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
      if(adData) {
          if(adData.userId !== user?.uid) {
              toast({ variant: 'destructive', title: 'අනවසර ප්‍රවේශය', description: 'ඔබට මෙම දැන්වීම සංස්කරණය කිරීමට අවසර නැත.' });
              router.push('/my-ads');
              return;
          }
          form.reset({
              title: adData.title,
              description: adData.description,
              price: adData.price,
              categoryId: adData.categoryId,
              subCategoryId: adData.subCategoryId || '',
              district: adData.district,
              phoneNumber: adData.phoneNumber
          });
      }
  }, [adData, form, router, toast, user]);

  const selectedMainCategory = form.watch('categoryId');

  const onSubmit = async (data: ClassifiedAdFormValues) => {
     setIsLoading(true);
     if (!firestore || !adId) {
         toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'දත්ත සමුදාය සූදානම් නැත.' });
         setIsLoading(false);
         return;
     }

     try {
        const adDocRef = doc(firestore, 'ads', adId);
        await updateDoc(adDocRef, {
            ...data,
            subCategoryId: data.subCategoryId || null,
        });
        
        toast({ title: 'සාර්ථකයි!', description: 'ඔබගේ දැන්වීම සාර්ථකව යාවත්කාලීන කරන ලදී.' });
        router.push('/my-ads');

     } catch(error: any) {
        console.error("Ad update error:", error);
        toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'දැන්වීම යාවත්කාලීන කිරීමට අසමත් විය. ' + error.message });
     } finally {
        setIsLoading(false);
     }
  };

  if (isUserLoading || isLoadingAd) {
    return (
        <div className="container mx-auto max-w-3xl py-12">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-8">
                   <Skeleton className="h-10 w-full" />
                   <div className="grid grid-cols-2 gap-8"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                   <Skeleton className="h-24 w-full" />
                   <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }
  
  if (!user) {
      return null;
  }
  
  if (!adData) {
      return (
        <div className="container mx-auto max-w-3xl py-12 text-center">
            <h1 className="text-2xl font-bold">දැන්වීම හමු නොවීය</h1>
            <p className="text-muted-foreground">මෙම දැන්වීම සොයාගත නොහැක.</p>
        </div>
      )
  }

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>දැන්වීම සංස්කරණය කරන්න</CardTitle>
          <CardDescription>ඔබගේ දැන්වීමේ විස්තර පහතින් යාවත්කාලීන කරන්න.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                        <FormLabel>දැන්වීමේ මාතෘකාව</FormLabel>
                        <FormControl><Input placeholder="උදා: Toyota Aqua for Sale" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>ප්‍රවර්ගය</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="ප්‍රවර්ගයක් තෝරන්න" /></SelectTrigger></FormControl>
                            <SelectContent>{categories.map(cat => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )} />
                        {selectedMainCategory === '18-plus' && (
                            <FormField control={form.control} name="subCategoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>18+ උප-ප්‍රවර්ගය</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="උප-ප්‍රවර්ගයක් තෝරන්න" /></SelectTrigger></FormControl>
                                <SelectContent>{subCategories18Plus.map(cat => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )} />
                        )}
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="district" render={({ field }) => (
                        <FormItem>
                            <FormLabel>දිස්ත්‍රික්කය</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="දිස්ත්‍රික්කයක් තෝරන්න" /></SelectTrigger></FormControl>
                            <SelectContent>{districts.map(dist => (<SelectItem key={dist} value={dist}>{dist}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}/>
                         <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                            <FormLabel>මිල (රු.)</FormLabel>
                            <FormControl><Input type="number" placeholder="මිල ඇතුළත් කරන්න" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                        <FormLabel>දුරකථන අංකය</FormLabel>
                        <FormControl><Input type="tel" placeholder="උදා: 0771234567" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                        <FormLabel>විස්තරය</FormLabel>
                        <FormControl><Textarea placeholder="සවිස්තරාත්මක විස්තරයක් ලබා දෙන්න..." rows={6} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />

                    <p className="text-sm text-muted-foreground">සටහන: දැනට පවතින ඡායාරූප වෙනස් කළ නොහැක. ඡායාරූප වෙනස් කිරීමට, කරුණාකර මෙම දැන්වීම මකා දමා නව දැන්වීමක් පළ කරන්න.</p>

                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? 'යාවත්කාලීන කරමින්...' : 'වෙනස්කම් සුරකින්න'}
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}

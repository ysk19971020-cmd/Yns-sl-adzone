'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { categories } from '@/lib/data';
import { districts } from '@/lib/districts';
import { subCategories18Plus } from '@/lib/18-plus-categories';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


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
  images: z.array(z.instanceof(File)).min(1, 'කරුණාකර අවම වශයෙන් එක් ඡායාරූපයක් උඩුගත කරන්න').max(5, 'ඔබට උපරිම වශයෙන් ඡායාරූප 5ක් උඩුගත කළ හැක'),
}).refine(data => {
    if (data.categoryId === '18-plus') {
        return !!data.subCategoryId;
    }
    return true;
}, {
    message: 'කරුණාකර 18+ උප-ප්‍රවර්ගයක් තෝරන්න',
    path: ['subCategoryId'],
});
type ClassifiedAdFormValues = z.infer<typeof classifiedAdSchema>;

// Banner Ad Schema
const bannerDurations = [
    { id: '1-week', name: 'සතියක්', price: 700 },
    { id: '2-weeks', name: 'සති 2ක්', price: 1400 },
    { id: '1-month', name: 'මාසයක්', price: 2800 },
];
const bannerPositions = ['ඉහළ', 'පහළ', 'වම', 'දකුණ'];
const bannerAdSchema = z.object({
  description: z.string().min(10, 'විස්තරය අවම වශයෙන් අක්ෂර 10ක් විය යුතුය'),
  categoryId: z.string({ required_error: 'කරුණාකර ප්‍රවර්ගයක් තෝරන්න' }),
  position: z.string({ required_error: 'කරුණාකර බැනර් ස්ථානයක් තෝරන්න' }),
  duration: z.string({ required_error: 'කරුණාකර කාල සීමාවක් තෝරන්න' }),
  whatsappNumber: z.string().min(10, 'කරුණාකර වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න'),
  image: z.instanceof(File).refine(file => file.size > 0, 'කරුණාකර ඡායාරූපයක් උඩුගත කරන්න'),
});
type BannerAdFormValues = z.infer<typeof bannerAdSchema>;


export default function PostAdPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("classified");

  const classifiedForm = useForm<ClassifiedAdFormValues>({
    resolver: zodResolver(classifiedAdSchema),
    defaultValues: { images: [] },
  });

  const bannerForm = useForm<BannerAdFormValues>({
    resolver: zodResolver(bannerAdSchema),
  });
  
  const selectedMainCategory = classifiedForm.watch('categoryId');
  const bannerDuration = bannerForm.watch('duration');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

   useEffect(() => {
    const selectedDuration = bannerDurations.find(d => d.id === bannerDuration);
    setCalculatedPrice(selectedDuration ? selectedDuration.price : 0);
  }, [bannerDuration]);


  if (isUserLoading) {
    return <div className="flex justify-center items-center h-screen">පූරණය වෙමින්...</div>;
  }
  
  if (!user) {
      return <div className="flex justify-center items-center h-screen">පිවිසුම් පිටුවට යොමු කරමින්...</div>;
  }
  
  // Handlers for Classified Ad Form
  const handleClassifiedImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = Array.from(e.target.files || []);
    const currentImages = field.value || [];
    if (currentImages.length + files.length > 5) {
      toast({ variant: 'destructive', title: 'ඡායාරූප ඕනෑවට වඩා', description: 'ඔබට උඩුගත කළ හැක්කේ උපරිම වශයෙන් ඡායාරූප 5ක් පමණි.' });
      return;
    }
    const newImages = [...currentImages, ...files];
    field.onChange(newImages);
    setImagePreviews(newImages.map(file => URL.createObjectURL(file)));
  };
  
  const removeClassifiedImage = (index: number, field: any) => {
    const newImages = [...field.value];
    newImages.splice(index, 1);
    field.onChange(newImages);
    setImagePreviews(newImages.map(file => URL.createObjectURL(file)));
  };

  const onClassifiedSubmit = async (data: ClassifiedAdFormValues) => {
     setIsLoading(true);
     if (!firestore || !user) {
         toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'පරිශීලක හෝ දත්ත සමුදාය සූදානම් නැත.' });
         setIsLoading(false);
         return;
     }

     try {
        const storage = getStorage();
        const imageUrls: string[] = [];

        for (const image of data.images) {
             const fileExtension = image.name.split('.').pop();
             const fileName = `ad_images/${user.uid}/${uuidv4()}.${fileExtension}`;
             const storageRef = ref(storage, fileName);
             
             const reader = new FileReader();
             const uploadPromise = new Promise<string>((resolve, reject) => {
                 reader.onload = async (e) => {
                     try {
                         const dataUrl = e.target?.result as string;
                         await uploadString(storageRef, dataUrl, 'data_url');
                         const downloadUrl = await getDownloadURL(storageRef);
                         resolve(downloadUrl);
                     } catch(err) {
                         reject(err);
                     }
                 };
                 reader.readAsDataURL(image);
             });
             imageUrls.push(await uploadPromise);
        }
        
        await addDoc(collection(firestore, 'ads'), {
            id: uuidv4(),
            userId: user.uid,
            title: data.title,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId || null,
            district: data.district,
            phoneNumber: data.phoneNumber,
            imageUrls: imageUrls,
            createdAt: serverTimestamp(),
            status: 'active' // Or 'pending' if you want admin approval for ads
        });
        
        toast({ title: 'සාර්ථකයි!', description: 'ඔබගේ දැන්වීම සාර්ථකව පළ කරන ලදී.' });
        router.push('/');

     } catch(error: any) {
        console.error("Ad posting error:", error);
        toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'දැන්වීම පළ කිරීමට අසමත් විය. ' + error.message });
     } finally {
        setIsLoading(false);
     }
  };

  // Handlers for Banner Ad Form
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const removeBannerImage = (field: any) => {
    field.onChange(null);
    setBannerImagePreview(null);
  };

  const onBannerSubmit = (data: BannerAdFormValues) => {
    const params = new URLSearchParams({
        description: data.description,
        position: data.position,
        duration: data.duration,
        price: calculatedPrice.toString(),
        whatsappNumber: data.whatsappNumber,
        categoryId: data.categoryId,
    });
    
    if(data.image) {
        const reader = new FileReader();
        reader.onload = (e) => {
            sessionStorage.setItem('bannerImage', e.target?.result as string);
            router.push(`/payment/banner?${params.toString()}`);
        };
        reader.readAsDataURL(data.image);
    }
  };


  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>ඔබේ දැන්වීම පළ කරන්න</CardTitle>
          <CardDescription>ඔබේ දැන්වීම් වර්ගය තෝරා පහත විස්තර පුරවන්න.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="classified">වර්ගීකෘත දැන්වීම</TabsTrigger>
                    <TabsTrigger value="banner">බැනර් දැන්වීම</TabsTrigger>
                </TabsList>
                <TabsContent value="classified">
                   <p className="text-sm text-muted-foreground my-4">භාණ්ඩ, දේපළ, හෝ සේවා පළ කරන්න. දෘශ්‍යමාන වීම සඳහා සක්‍රිය සාමාජික සැලැස්මක් අවශ්‍ය වේ.</p>
                   <Form {...classifiedForm}>
                        <form onSubmit={classifiedForm.handleSubmit(onClassifiedSubmit)} className="space-y-8">
                            <FormField control={classifiedForm.control} name="title" render={({ field }) => (
                                <FormItem>
                                <FormLabel>දැන්වීමේ මාතෘකාව</FormLabel>
                                <FormControl><Input placeholder="උදා: Toyota Aqua for Sale" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={classifiedForm.control} name="categoryId" render={({ field }) => (
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
                                    <FormField control={classifiedForm.control} name="subCategoryId" render={({ field }) => (
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
                                <FormField control={classifiedForm.control} name="district" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>දිස්ත්‍රික්කය</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="දිස්ත්‍රික්කයක් තෝරන්න" /></SelectTrigger></FormControl>
                                    <SelectContent>{districts.map(dist => (<SelectItem key={dist} value={dist}>{dist}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                                 <FormField control={classifiedForm.control} name="price" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>මිල (රු.)</FormLabel>
                                    <FormControl><Input type="number" placeholder="මිල ඇතුළත් කරන්න" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            
                            <FormField control={classifiedForm.control} name="phoneNumber" render={({ field }) => (
                                <FormItem>
                                <FormLabel>දුරකථන අංකය</FormLabel>
                                <FormControl><Input type="tel" placeholder="උදා: 0771234567" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={classifiedForm.control} name="description" render={({ field }) => (
                                <FormItem>
                                <FormLabel>විස්තරය</FormLabel>
                                <FormControl><Textarea placeholder="සවිස්තරාත්මක විස්තරයක් ලබා දෙන්න..." rows={6} {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={classifiedForm.control} name="images" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ඡායාරූප උඩුගත කරන්න (උපරිම 5)</FormLabel>
                                    <FormControl>
                                        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">මෙහි ක්ලික් කරන්න හෝ ගොනු ඇද දමන්න</p>
                                            <Input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" multiple onChange={(e) => handleClassifiedImageChange(e, field)} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                                        {imagePreviews.map((src, index) => (
                                        <div key={index} className="relative group">
                                            <Image src={src} alt={`Preview ${index + 1}`} width={100} height={100} className="w-full h-auto object-cover rounded-md aspect-square" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeClassifiedImage(index, field)}>
                                            <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </FormItem>
                            )} />

                            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                {isLoading ? 'දැන්වීම පළ කරමින්...' : 'දැන්වීම පළ කරන්න'}
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="banner">
                    <p className="text-sm text-muted-foreground my-4">අපගේ ප්‍රධාන වෙළඳ දැන්වීම් අවකාශයන්හි ඔබේ ව්‍යාපාරය ප්‍රවර්ධනය කරන්න. එක් බැනරයකට ගෙවීම අවශ්‍ය වේ.</p>
                    <Form {...bannerForm}>
                        <form onSubmit={bannerForm.handleSubmit(onBannerSubmit)} className="space-y-8">
                             <FormField control={bannerForm.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ප්‍රවර්ගය</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="බැනරය සඳහා ප්‍රවර්ගයක් තෝරන්න" /></SelectTrigger></FormControl>
                                    <SelectContent>{categories.map(cat => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={bannerForm.control} name="position" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>බැනර් ස්ථානය</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="ස්ථානයක් තෝරන්න" /></SelectTrigger></FormControl>
                                        <SelectContent>{bannerPositions.map(pos => (<SelectItem key={pos} value={pos}>{pos}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={bannerForm.control} name="duration" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>දැන්වීමේ කාල සීමාව</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="කාල සීමාවක් තෝරන්න" /></SelectTrigger></FormControl>
                                        <SelectContent>{bannerDurations.map(dur => (<SelectItem key={dur.id} value={dur.id}>{dur.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                            
                            <FormField control={bannerForm.control} name="whatsappNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>WhatsApp අංකය</FormLabel>
                                    <FormControl><Input placeholder="උදා: 0771234567" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={bannerForm.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>සම්පූර්ණ විස්තරය</FormLabel>
                                    <FormControl><Textarea placeholder="ඔබගේ බැනර් දැන්වීම සඳහා සවිස්තරාත්මක විස්තරයක් ලබා දෙන්න..." rows={4} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                             <FormField control={bannerForm.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>බැනර් රූපය උඩුගත කරන්න</FormLabel>
                                    {!bannerImagePreview ? (
                                    <FormControl>
                                        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">උඩුගත කිරීමට මෙහි ක්ලික් කරන්න හෝ ගොනුව ඇද දමන්න</p>
                                            <Input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleBannerImageChange(e, field)} />
                                        </div>
                                    </FormControl>
                                    ) : (
                                        <div className="relative group w-full aspect-video">
                                            <Image src={bannerImagePreview} alt="Banner Preview" layout="fill" className="object-contain rounded-md border" />
                                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => removeBannerImage(field)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <h3 className="font-semibold text-lg">ගෙවිය යුතු මුළු මුදල</h3>
                                <p className="text-3xl font-bold text-primary mt-1">රු. {calculatedPrice.toLocaleString()}</p>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={isLoading || calculatedPrice <= 0}>
                                {isLoading ? 'සකසමින්...' : 'ගෙවීම් පිටුවට යන්න'}
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { categories, pricingPlans } from '@/lib/data';
import { districts } from '@/lib/districts';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


// Classified Ad Schema
const classifiedAdSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), 
    z.number().positive('Price must be a positive number')),
  categoryId: z.string({ required_error: 'Please select a category' }),
  district: z.string({ required_error: 'Please select a district' }),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  images: z.array(z.instanceof(File)).min(1, 'Please upload at least one image').max(5, 'You can upload a maximum of 5 images'),
});
type ClassifiedAdFormValues = z.infer<typeof classifiedAdSchema>;

// Banner Ad Schema
const bannerDurations = [
    { id: '1-week', name: '1 Week', price: 700 },
    { id: '2-weeks', name: '2 Weeks', price: 1400 },
    { id: '1-month', name: '1 Month', price: 2800 },
];
const bannerPositions = ['Top', 'Bottom', 'Left', 'Right'];
const bannerAdSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  categoryId: z.string({ required_error: 'Please select a category' }),
  position: z.string({ required_error: 'Please select a banner position' }),
  duration: z.string({ required_error: 'Please select a duration' }),
  whatsappNumber: z.string().min(10, 'Please enter a valid phone number'),
  image: z.instanceof(File).refine(file => file.size > 0, 'Please upload an image'),
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
      return <div className="flex justify-center items-center h-screen">Redirecting to login...</div>;
  }
  
  // Handlers for Classified Ad Form
  const handleClassifiedImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = Array.from(e.target.files || []);
    const currentImages = field.value || [];
    if (currentImages.length + files.length > 5) {
      toast({ variant: 'destructive', title: 'Too many images', description: 'You can only upload a maximum of 5 images.' });
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
         toast({ variant: 'destructive', title: 'Error', description: 'User or database not ready.' });
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
            district: data.district,
            phoneNumber: data.phoneNumber,
            imageUrls: imageUrls,
            createdAt: serverTimestamp(),
            status: 'active' // Or 'pending' if you want admin approval for ads
        });
        
        toast({ title: 'Success!', description: 'Your ad has been posted successfully.' });
        router.push('/');

     } catch(error: any) {
        console.error("Ad posting error:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to post ad. ' + error.message });
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
          <CardTitle>Post Your Ad</CardTitle>
          <CardDescription>Choose your ad type and fill in the details below.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="classified">Classified Ad</TabsTrigger>
                    <TabsTrigger value="banner">Banner Ad</TabsTrigger>
                </TabsList>
                <TabsContent value="classified">
                   <p className="text-sm text-muted-foreground my-4">Post items, properties, or services. Requires an active membership plan to be visible.</p>
                   <Form {...classifiedForm}>
                        <form onSubmit={classifiedForm.handleSubmit(onClassifiedSubmit)} className="space-y-8">
                            <FormField control={classifiedForm.control} name="title" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Ad Title</FormLabel>
                                <FormControl><Input placeholder="e.g., Toyota Aqua for Sale" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={classifiedForm.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>{categories.map(cat => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )} />
                                <FormField control={classifiedForm.control} name="district" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>District</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger></FormControl>
                                    <SelectContent>{districts.map(dist => (<SelectItem key={dist} value={dist}>{dist}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}/>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={classifiedForm.control} name="price" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Price (LKR)</FormLabel>
                                    <FormControl><Input type="number" placeholder="Enter price" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={classifiedForm.control} name="phoneNumber" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl><Input type="tel" placeholder="e.g., 0771234567" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={classifiedForm.control} name="description" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Provide a detailed description..." rows={6} {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={classifiedForm.control} name="images" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Images (up to 5)</FormLabel>
                                    <FormControl>
                                        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">Click or drag files here</p>
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
                                {isLoading ? 'Posting Ad...' : 'Post Ad'}
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="banner">
                    <p className="text-sm text-muted-foreground my-4">Promote your business on our prime advertising spaces. Payment is required per banner.</p>
                    <Form {...bannerForm}>
                        <form onSubmit={bannerForm.handleSubmit(onBannerSubmit)} className="space-y-8">
                             <FormField control={bannerForm.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category for the banner" /></SelectTrigger></FormControl>
                                    <SelectContent>{categories.map(cat => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField control={bannerForm.control} name="position" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Banner Position</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a position" /></SelectTrigger></FormControl>
                                        <SelectContent>{bannerPositions.map(pos => (<SelectItem key={pos} value={pos}>{pos}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={bannerForm.control} name="duration" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Ad Duration</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a duration" /></SelectTrigger></FormControl>
                                        <SelectContent>{bannerDurations.map(dur => (<SelectItem key={dur.id} value={dur.id}>{dur.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                            
                            <FormField control={bannerForm.control} name="whatsappNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>WhatsApp Number</FormLabel>
                                    <FormControl><Input placeholder="e.g., 0771234567" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={bannerForm.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Description</FormLabel>
                                    <FormControl><Textarea placeholder="Provide a detailed description for your banner ad..." rows={4} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                             <FormField control={bannerForm.control} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upload Banner Image</FormLabel>
                                    {!bannerImagePreview ? (
                                    <FormControl>
                                        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">Click or drag file here to upload</p>
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
                                <h3 className="font-semibold text-lg">Total Amount Due</h3>
                                <p className="text-3xl font-bold text-primary mt-1">LKR {calculatedPrice.toLocaleString()}</p>
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={isLoading || calculatedPrice <= 0}>
                                {isLoading ? 'Processing...' : 'Proceed to Payment'}
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

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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '@/lib/data';
import { districts } from '@/lib/districts';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

const adSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), 
    z.number().positive('Price must be a positive number')),
  categoryId: z.string({ required_error: 'Please select a category' }),
  district: z.string({ required_error: 'Please select a district' }),
  images: z.array(z.instanceof(File)).min(1, 'Please upload at least one image').max(5, 'You can upload a maximum of 5 images'),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function PostAdPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      images: [],
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = Array.from(e.target.files || []);
    const currentImages = field.value || [];
    const totalImages = currentImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: 'You can only upload a maximum of 5 images.',
      });
      return;
    }

    const newImages = [...currentImages, ...files];
    field.onChange(newImages);

    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };
  
  const removeImage = (index: number, field: any) => {
    const newImages = [...field.value];
    newImages.splice(index, 1);
    field.onChange(newImages);

    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };


  const onSubmit = async (data: AdFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to the database.' });
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Upload images to Firebase Storage
      const storage = getStorage();
      const imageUrls: string[] = [];
      for (const image of data.images) {
        const fileExtension = image.name.split('.').pop();
        const fileName = `ad_images/${user.uid}/${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, image);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUrls.push(downloadUrl);
      }
      
      // 2. Create ad document in Firestore
      const adsCollection = collection(firestore, 'ads');
      await addDoc(adsCollection, {
        userId: user.uid,
        title: data.title,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        district: data.district,
        imageUrls: imageUrls,
        phoneNumber: user.phoneNumber, // Automatically add user's phone number
        createdAt: serverTimestamp(),
        status: 'active', // or 'pending_review'
      });

      toast({
        title: 'Ad Posted!',
        description: 'Your ad has been successfully posted and is now live.',
      });

      router.push('/');

    } catch (error: any) {
      console.error('Error posting ad:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error.message || 'There was a problem posting your ad. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Post Your Ad</CardTitle>
          <CardDescription>Fill in the details below to post your advertisement.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Toyota Aqua for Sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {districts.map(dist => (
                            <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (LKR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a detailed description of your item..." rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Upload Images (up to 5)</FormLabel>
                          <FormControl>
                              <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary cursor-pointer">
                                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <p className="mt-2 text-sm text-muted-foreground">Click or drag files here to upload</p>
                                  <Input
                                      type="file"
                                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => handleImageChange(e, field)}
                                  />
                              </div>
                          </FormControl>
                          <FormMessage />
                          {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                              {imagePreviews.map((src, index) => (
                                <div key={index} className="relative group">
                                  <Image src={src} alt={`Preview ${index + 1}`} width={100} height={100} className="w-full h-auto object-cover rounded-md aspect-square" />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                    onClick={() => removeImage(index, field)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                      </FormItem>
                  )}
              />


              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? 'Posting Ad...' : 'Post My Ad'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

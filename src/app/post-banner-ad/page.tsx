
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
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

const bannerDurations = [
    { id: '1-week', name: '1 Week', price: 700 },
    { id: '2-weeks', name: '2 Weeks', price: 1400 },
    { id: '1-month', name: '1 Month', price: 2800 },
];

const bannerPositions = ['Top', 'Bottom', 'Left', 'Right'];

const bannerAdSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  position: z.string({ required_error: 'Please select a banner position' }),
  duration: z.string({ required_error: 'Please select a duration' }),
  whatsappNumber: z.string().regex(/^[0-9]{9,10}$/, 'Please enter a valid 9 or 10-digit phone number'),
  image: z.instanceof(File).refine(file => file.size > 0, 'Please upload an image'),
});

type BannerAdFormValues = z.infer<typeof bannerAdSchema>;

export default function PostBannerAdPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const form = useForm<BannerAdFormValues>({
    resolver: zodResolver(bannerAdSchema),
  });

  const duration = form.watch('duration');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const selectedDuration = bannerDurations.find(d => d.id === duration);
    setCalculatedPrice(selectedDuration ? selectedDuration.price : 0);
  }, [duration]);


  if (isUserLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (field: any) => {
    field.onChange(null);
    setImagePreview(null);
  };

  const onSubmit = (data: BannerAdFormValues) => {
    // Navigate to a new payment confirmation page, passing data along
    const whatsappLink = `https://wa.me/94${data.whatsappNumber}`;
    const params = new URLSearchParams({
        description: data.description,
        position: data.position,
        duration: data.duration,
        price: calculatedPrice.toString(),
        whatsappLink: whatsappLink,
    });
    
    // Store the file in a way that can be retrieved on the next page.
    // For simplicity, we'll use session storage for the file and redirect.
    // A more robust solution might involve a multi-step form state manager.
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
          <CardTitle>Post Your Banner Ad</CardTitle>
          <CardDescription>Fill in the details below to create your banner advertisement.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Banner Position</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {bannerPositions.map(pos => (
                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ad Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a duration" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {bannerDurations.map(dur => (
                                <SelectItem key={dur.id} value={dur.id}>{dur.name}</SelectItem>
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
                    name="whatsappNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                         <div className="flex items-center">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-muted-foreground text-sm">+94</span>
                            <Input placeholder="e.g., 771234567" {...field} className="rounded-l-none" />
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Provide a detailed description for your banner ad..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Banner Image</FormLabel>
                            {!imagePreview ? (
                               <FormControl>
                                  <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary cursor-pointer">
                                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                      <p className="mt-2 text-sm text-muted-foreground">Click or drag file here to upload</p>
                                      <Input
                                          type="file"
                                          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => handleImageChange(e, field)}
                                      />
                                  </div>
                              </FormControl>
                            ) : (
                                <div className="relative group w-full aspect-video">
                                    <Image src={imagePreview} alt="Banner Preview" layout="fill" className="object-contain rounded-md border" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                                        onClick={() => removeImage(field)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <h3 className="font-semibold text-lg">Total Amount Due</h3>
                    <p className="text-3xl font-bold text-primary mt-1">LKR {calculatedPrice.toLocaleString()}</p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading || calculatedPrice <= 0}>
                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


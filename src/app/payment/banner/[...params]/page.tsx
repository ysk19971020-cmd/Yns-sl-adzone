
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; 

function PaymentBannerComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Read banner details from URL
    const description = searchParams.get('description');
    const position = searchParams.get('position');
    const duration = searchParams.get('duration');
    const price = searchParams.get('price');
    const whatsappNumber = searchParams.get('whatsappNumber');
    const categoryId = searchParams.get('categoryId');


    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    // This effect should run only once on mount to check for required params
    useEffect(() => {
        if (!price || !description || !position || !duration || !whatsappNumber || !categoryId) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Banner details are missing. Please start again.',
            });
            router.push('/post-ad');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (isUserLoading || !user) {
        return <div>Loading...</div>;
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPaymentSlip(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!paymentSlip) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please upload your payment slip.' });
            return;
        }

        const bannerImageDataUri = sessionStorage.getItem('bannerImage');
        if (!bannerImageDataUri) {
            toast({ variant: 'destructive', title: 'Error', description: 'Banner image not found. Please go back and re-upload.' });
            return;
        }

        if (!firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Database not available.' });
            return;
        }

        setIsLoading(true);

        try {
            const storage = getStorage();

            // 1. Upload banner image to Storage
            const bannerImageExt = bannerImageDataUri.split(';')[0].split('/')[1];
            const bannerImageName = `banner_images/${user.uid}/${uuidv4()}.${bannerImageExt}`;
            const bannerStorageRef = ref(storage, bannerImageName);
            await uploadString(bannerStorageRef, bannerImageDataUri, 'data_url');
            const bannerImageUrl = await getDownloadURL(bannerStorageRef);

            // 2. Upload payment slip to Storage
            const slipExt = paymentSlip.name.split('.').pop();
            const slipName = `payment_slips/${user.uid}/${uuidv4()}.${slipExt}`;
            const slipStorageRef = ref(storage, slipName);
            
            const slipReader = new FileReader();
            slipReader.readAsDataURL(paymentSlip);
            slipReader.onload = async (e) => {
                try {
                    const slipDataUrl = e.target?.result as string;
                    await uploadString(slipStorageRef, slipDataUrl, 'data_url');
                    const paymentSlipUrl = await getDownloadURL(slipStorageRef);
                    
                    // Create WhatsApp link from number
                    const cleanedNumber = whatsappNumber?.replace(/[^0-9]/g, '');
                    const finalNumber = cleanedNumber?.startsWith('0') ? '94' + cleanedNumber.substring(1) : cleanedNumber;
                    const whatsappLink = `https://wa.me/${finalNumber}`;

                    // 3. Create Banner document
                    const bannerRef = await addDoc(collection(firestore, 'banners'), {
                        userId: user.uid,
                        imageUrl: bannerImageUrl,
                        description: description,
                        whatsappLink: whatsappLink,
                        position: position,
                        categoryId: categoryId,
                        startDate: null, // To be set by admin on approval
                        expiryDate: null, // To be set by admin on approval
                        status: 'Pending',
                        createdAt: serverTimestamp(),
                    });
        
                    // 4. Create Payment document
                    await addDoc(collection(firestore, 'payments'), {
                        userId: user.uid,
                        paymentMethod: paymentMethod,
                        amount: Number(price),
                        paymentSlipUrl: paymentSlipUrl,
                        status: 'Pending',
                        targetId: bannerRef.id, // Link payment to the banner document
                        paymentFor: 'Banner',
                        createdAt: serverTimestamp(),
                    });
        
                    toast({
                        title: 'Payment Submitted',
                        description: 'Your banner ad payment is being reviewed and will be activated upon approval.',
                    });
                    
                    sessionStorage.removeItem('bannerImage');
                    router.push('/');
                } catch (error: any) {
                    console.error("Inner Banner Payment submission error: ", error);
                    toast({
                        variant: 'destructive',
                        title: 'Submission Failed',
                        description: error.message || 'There was an error saving your payment details.',
                    });
                    setIsLoading(false);
                }
            }
            slipReader.onerror = (error) => {
                 console.error("File Reader error: ", error);
                 toast({ variant: 'destructive', title: 'File Error', description: 'Could not read the payment slip file.'});
                 setIsLoading(false);
            }

        } catch (error: any) {
            console.error("Outer Banner Payment submission error: ", error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: error.message || 'There was an error submitting your payment.',
            });
             setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Complete Banner Payment</CardTitle>
                    <CardDescription>Review the details and submit your payment for the banner ad.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">Category:</span> <span className="font-semibold">{categoryId}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Position:</span> <span className="font-semibold">{position}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Duration:</span> <span className="font-semibold">{duration?.replace('-', ' ')}</span></div>
                        <div className="flex justify-between text-lg"><span className="text-muted-foreground">Total:</span> <span className="font-bold text-primary">LKR {Number(price).toLocaleString()}</span></div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold">Bank Transfer Details</h3>
                        <p className="text-sm text-muted-foreground">Please make a payment of LKR {Number(price).toLocaleString()} to the following account:</p>
                        <ul className="mt-2 text-sm space-y-1">
                            <li><strong>Bank:</strong> Commercial Bank</li>
                            <li><strong>Account Name:</strong> AdZone Lanka (Pvt) Ltd</li>
                            <li><strong>Account Number:</strong> 1234567890</li>
                            <li><strong>Branch:</strong> Colombo</li>
                        </ul>
                         <p className="text-xs text-muted-foreground mt-2">Use your phone number as the reference.</p>
                    </div>

                    <div className="space-y-4">
                        <Label>Select Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Bank Transfer" id="bank" />
                                <Label htmlFor="bank">Bank Transfer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="eZ Cash" id="ezcash" />
                                <Label htmlFor="ezcash">eZ Cash</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Dialog Genie" id="genie" />
                                <Label htmlFor="genie">Dialog Genie</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment-slip">Upload Payment Slip</Label>
                        <Input id="payment-slip" type="file" accept="image/*" onChange={handleFileChange} />
                        <p className="text-xs text-muted-foreground">Please upload a clear image of your bank slip or transaction receipt.</p>
                    </div>

                    <Button onClick={handleSubmit} disabled={isLoading || !paymentSlip} className="w-full" size="lg">
                        {isLoading ? 'Submitting...' : `Submit Payment of LKR ${Number(price).toLocaleString()}`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}


export default function PaymentBannerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentBannerComponent />
        </Suspense>
    )
}

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
import { addDoc, collection, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; 
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


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
                title: 'දෝෂයකි',
                description: 'බැනර් විස්තර නොමැත. කරුණාකර නැවත ආරම්භ කරන්න.',
            });
            router.push('/post-ad');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (isUserLoading || !user) {
        return <div>පූරණය වෙමින්...</div>;
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPaymentSlip(event.target.files[0]);
        }
    };

    const handleManualSubmit = async () => {
        if (!paymentSlip) {
            toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'කරුණාකර ඔබගේ ගෙවීම් පත්‍රිකාව උඩුගත කරන්න.' });
            return;
        }

        const bannerImageDataUri = sessionStorage.getItem('bannerImage');
        if (!bannerImageDataUri) {
            toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'බැනර් රූපය හමු නොවීය. කරුණාකර ආපසු ගොස් නැවත උඩුගත කරන්න.' });
            return;
        }

        if (!firestore) {
            toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'දත්ත සමුදාය නොමැත.' });
            return;
        }

        setIsLoading(true);

        try {
            const storage = getStorage();
            const bannerId = uuidv4();

            // 1. Upload banner image to Storage
            const bannerImageExt = bannerImageDataUri.split(';')[0].split('/')[1];
            const bannerImageName = `banner_images/${user.uid}/${bannerId}.${bannerImageExt}`;
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
                    
                    // 3. Create Banner document
                    await setDoc(doc(firestore, 'banners', bannerId), {
                        id: bannerId,
                        userId: user.uid,
                        imageUrl: bannerImageUrl,
                        description: description,
                        whatsappNumber: whatsappNumber,
                        position: position,
                        categoryId: categoryId,
                        startDate: null, // To be set by admin on approval
                        expiryDate: null, // To be set by admin on approval
                        status: 'Pending',
                        createdAt: serverTimestamp(),
                    });
        
                    // 4. Create Payment document
                    await addDoc(collection(firestore, 'payments'), {
                        id: uuidv4(),
                        userId: user.uid,
                        paymentMethod: paymentMethod,
                        amount: Number(price),
                        paymentSlipUrl: paymentSlipUrl,
                        status: 'Pending',
                        targetId: bannerId, // Link payment to the banner
                        paymentFor: 'Banner',
                        createdAt: serverTimestamp(),
                    });
        
                    toast({
                        title: 'ගෙවීම ඉදිරිපත් කරන ලදී',
                        description: 'ඔබගේ බැනර් දැන්වීම් ගෙවීම සමාලෝචනය වෙමින් පවතින අතර අනුමත කිරීමෙන් පසු සක්‍රිය වනු ඇත.',
                    });
                    
                    sessionStorage.removeItem('bannerImage');
                    router.push('/');
                } catch (error: any) {
                    console.error("Inner Banner Payment submission error: ", error);
                    toast({
                        variant: 'destructive',
                        title: 'ඉදිරිපත් කිරීම අසාර්ථක විය',
                        description: error.message || 'ඔබගේ ගෙවීම් විස්තර සුරැකීමේදී දෝෂයක් ඇතිවිය.',
                    });
                    setIsLoading(false);
                }
            }
            slipReader.onerror = (error) => {
                 console.error("File Reader error: ", error);
                 toast({ variant: 'destructive', title: 'ගොනු දෝෂයකි', description: 'ගෙවීම් පත්‍රිකා ගොනුව කියවීමට නොහැකි විය.'});
                 setIsLoading(false);
            }

        } catch (error: any) {
            console.error("Outer Banner Payment submission error: ", error);
            toast({
                variant: 'destructive',
                title: 'ඉදිරිපත් කිරීම අසාර්ථක විය',
                description: error.message || 'ඔබගේ ගෙවීම ඉදිරිපත් කිරීමේදී දෝෂයක් ඇතිවිය.',
            });
             setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">බැනර් ගෙවීම සම්පූර්ණ කරන්න</CardTitle>
                    <CardDescription>විස්තර සමාලෝචනය කර බැනර් දැන්වීම සඳහා ඔබගේ ගෙවීම ඉදිරිපත් කරන්න.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
                        <div className="flex justify-between"><span className="text-muted-foreground">ප්‍රවර්ගය:</span> <span className="font-semibold">{categoryId}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">ස්ථානය:</span> <span className="font-semibold">{position}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">කාල සීමාව:</span> <span className="font-semibold">{duration?.replace('-', ' ')}</span></div>
                        <div className="flex justify-between text-lg"><span className="text-muted-foreground">සම්පූර්ණ:</span> <span className="font-bold text-primary">රු. {Number(price).toLocaleString()}</span></div>
                    </div>

                     <div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3">ගෙවීම් උපදෙස්</h3>
                            <p className="text-sm text-muted-foreground mb-4">කරුණාකර පහත ක්‍රම වලින් එකක් භාවිතා කර රු. {Number(price).toLocaleString()} ක ගෙවීමක් කරන්න.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold">1. බැංකු මාරු කිරීම</h4>
                                    <ul className="mt-1 text-sm space-y-1 pl-4 list-disc list-inside">
                                        <li><strong>බැංකුව:</strong> සම්පත් බැංකුව</li>
                                        <li><strong>ගිණුමේ නම:</strong> J A Y S Kavinada</li>
                                        <li><strong>ගිණුම් අංකය:</strong> 121212121212</li>
                                        <li><strong>ශාඛාව:</strong> කළුතර</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold">2. eZ Cash</h4>
                                    <p className="mt-1 text-sm">අංකයට යවන්න: <strong>0771248610</strong></p>
                                </div>

                                <div>
                                    <h4 className="font-semibold">3. Genie</h4>
                                    <p className="mt-1 text-sm">අංකයට යවන්න: <strong>0771248610</strong></p>
                                </div>
                            </div>

                             <p className="text-xs text-muted-foreground mt-4">බැංකු මාරු කිරීම් සඳහා, කරුණාකර ඔබගේ දුරකථන අංකය විමර්ශන අංකය ලෙස භාවිතා කරන්න. ගෙවීමෙන් පසු, පහතින් පත්‍රිකාව උඩුගත කරන්න.</p>
                        </div>

                         <Alert className="mt-6">
                            <Info className="h-4 w-4" />
                            <AlertTitle>වැදගත් සටහන</AlertTitle>
                            <AlertDescription>
                            මෙය අතින් තහවුරු කිරීමේ ක්‍රියාවලියකි. අපගේ පරිපාලක කණ්ඩායම ඔබගේ ගෙවීම සමාලෝචනය කර අනුමත කිරීමෙන් පසු ඔබගේ බැනර් දැන්වීම සක්‍රිය වනු ඇත.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4 mt-6">
                            <Label>භාවිතා කළ ගෙවීම් ක්‍රමය තෝරන්න</Label>
                            <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Bank Transfer" id="bank" />
                                    <Label htmlFor="bank">බැංකු මාරු කිරීම</Label>
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

                        <div className="space-y-2 mt-6">
                            <Label htmlFor="payment-slip">ගෙවීම් පත්‍රිකාව උඩුගත කරන්න</Label>
                            <Input id="payment-slip" type="file" accept="image/*" onChange={handleFileChange} />
                            <p className="text-xs text-muted-foreground">කරුණාකර ඔබගේ බැංකු පත්‍රිකාවේ හෝ ගනුදෙනු රිසිට්පතේ පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න.</p>
                        </div>

                        <Button onClick={handleManualSubmit} disabled={isLoading || !paymentSlip} className="w-full mt-6" size="lg">
                            {isLoading ? 'ඉදිරිපත් කරමින්...' : `රු. ${Number(price).toLocaleString()} ගෙවීම ඉදිරිපත් කරන්න`}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function PaymentBannerPage() {
    return (
        <Suspense fallback={<div>පූරණය වෙමින්...</div>}>
            <PaymentBannerComponent />
        </Suspense>
    )
}

    
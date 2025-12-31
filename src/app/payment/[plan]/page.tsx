'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { pricingPlans } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; 
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PaymentPage() {
    const { plan } = useParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const selectedPlan = pricingPlans.find(p => p.id === plan);

    if (isUserLoading) {
        return <div>පූරණය වෙමින්...</div>;
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    if (!selectedPlan) {
        return <div>තෝරාගත් සැලැස්ම වැරදියි.</div>;
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPaymentSlip(event.target.files[0]);
        }
    };

    const handleManualSubmit = async () => {
        if (!paymentSlip) {
            toast({
                variant: 'destructive',
                title: 'දෝෂයකි',
                description: 'කරුණාකර ඔබගේ ගෙවීම් පත්‍රිකාව උඩුගත කරන්න.',
            });
            return;
        }

        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'දෝෂයකි',
                description: 'දත්ත සමුදාය නොමැත. කරුණාකර පසුව නැවත උත්සාහ කරන්න.',
            });
            return;
        }

        setIsLoading(true);

        try {
            // 1. Upload image to Firebase Storage
            const storage = getStorage();
            const fileExtension = paymentSlip.name.split('.').pop();
            const fileName = `payment_slips/${user.uid}/${uuidv4()}.${fileExtension}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, paymentSlip);
            const imageUrl = await getDownloadURL(storageRef);

            // 2. Create payment document in Firestore
            const paymentsCollection = collection(firestore, 'payments');
            await addDoc(paymentsCollection, {
                id: uuidv4(),
                userId: user.uid,
                paymentMethod: paymentMethod,
                amount: selectedPlan.price,
                paymentSlipUrl: imageUrl,
                status: 'Pending',
                targetId: selectedPlan.id,
                paymentFor: 'Membership',
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'ගෙවීම ඉදිරිපත් කරන ලදී',
                description: 'ඔබගේ ගෙවීම සමාලෝචනය වෙමින් පවතී. අනුමත කිරීමෙන් පසු ඔබගේ සැලැස්ම සක්‍රිය වනු ඇත.',
            });

            router.push('/');

        } catch (error: any) {
            console.error("Payment submission error: ", error);
            toast({
                variant: 'destructive',
                title: 'ඉදිරිපත් කිරීම අසාර්ථක විය',
                description: error.message || 'ඔබගේ ගෙවීම ඉදිරිපත් කිරීමේදී දෝෂයක් ඇතිවිය.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">ඔබගේ ගෙවීම සම්පූර්ණ කරන්න</CardTitle>
                    <CardDescription>ඔබ <span className="font-bold text-primary">{selectedPlan.name}</span> සැලැස්ම තෝරාගෙන ඇත.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-lg mb-3">ගෙවීම් උපදෙස්</h3>
                            <p className="text-sm text-muted-foreground mb-4">කරුණාකර පහත ක්‍රම වලින් එකක් භාවිතා කර රු. {selectedPlan.price.toLocaleString()} ක ගෙවීමක් කරන්න.</p>
                            
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
                            මෙය අතින් තහවුරු කිරීමේ ක්‍රියාවලියකි. අපගේ පරිපාලක කණ්ඩායම ඔබගේ ගෙවීම සමාලෝචනය කර අනුමත කිරීමෙන් පසු ඔබගේ සාමාජික සැලැස්ම සක්‍රිය වනු ඇත.
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
                            {isLoading ? 'ඉදිරිපත් කරමින්...' : `රු. ${selectedPlan.price.toLocaleString()} ගෙවීම ඉදිරිපත් කරන්න`}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
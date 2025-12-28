'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, getSdks } from '@/firebase';
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
        return <div>Loading...</div>;
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    if (!selectedPlan) {
        return <div>Invalid plan selected.</div>;
    }
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPaymentSlip(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!paymentSlip) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please upload your payment slip.',
            });
            return;
        }

        if (!firestore) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Database not available. Please try again later.',
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
                title: 'Payment Submitted',
                description: 'Your payment is being reviewed. Your plan will be activated upon approval.',
            });

            router.push('/');

        } catch (error: any) {
            console.error("Payment submission error: ", error);
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: error.message || 'There was an error submitting your payment.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Complete Your Payment</CardTitle>
                    <CardDescription>You have selected the <span className="font-bold text-primary">{selectedPlan.name}</span> plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="font-semibold">Bank Transfer Details</h3>
                        <p className="text-sm text-muted-foreground">Please make a payment of LKR {selectedPlan.price.toLocaleString()} to the following account:</p>
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
                        {isLoading ? 'Submitting...' : `Submit Payment of LKR ${selectedPlan.price.toLocaleString()}`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

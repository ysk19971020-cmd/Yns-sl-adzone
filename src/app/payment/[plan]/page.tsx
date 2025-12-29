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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard } from 'lucide-react';

export default function PaymentPage() {
    const { plan } = useParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("manual");

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

    const handleManualSubmit = async () => {
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
    
    const handleCardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Coming Soon!",
            description: "Card payments are not yet available. Please use a manual payment method for now.",
            variant: "default",
        });
    }

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Complete Your Payment</CardTitle>
                    <CardDescription>You have selected the <span className="font-bold text-primary">{selectedPlan.name}</span> plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="manual">Bank/Manual Transfer</TabsTrigger>
                            <TabsTrigger value="card">Card Payment</TabsTrigger>
                        </TabsList>
                        <TabsContent value="manual" className="pt-6">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-semibold text-lg mb-3">Payment Instructions</h3>
                                <p className="text-sm text-muted-foreground mb-4">Please make a payment of LKR {selectedPlan.price.toLocaleString()} using one of the methods below.</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold">1. Bank Transfer</h4>
                                        <ul className="mt-1 text-sm space-y-1 pl-4 list-disc list-inside">
                                            <li><strong>Bank:</strong> Sampath Bank</li>
                                            <li><strong>Account Name:</strong> J A Y S Kavinada</li>
                                            <li><strong>Account Number:</strong> 121212121212</li>
                                            <li><strong>Branch:</strong> Kalutara</li>
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold">2. eZ Cash</h4>
                                        <p className="mt-1 text-sm">Send to number: <strong>0771248610</strong></p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold">3. Genie</h4>
                                        <p className="mt-1 text-sm">Send to number: <strong>0771248610</strong></p>
                                    </div>
                                </div>

                                 <p className="text-xs text-muted-foreground mt-4">For bank transfers, please use your phone number as the reference. After payment, upload the slip below.</p>
                            </div>

                            <div className="space-y-4 mt-6">
                                <Label>Select Payment Method Used</Label>
                                <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="flex space-x-4">
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

                            <div className="space-y-2 mt-6">
                                <Label htmlFor="payment-slip">Upload Payment Slip</Label>
                                <Input id="payment-slip" type="file" accept="image/*" onChange={handleFileChange} />
                                <p className="text-xs text-muted-foreground">Please upload a clear image of your bank slip or transaction receipt.</p>
                            </div>

                            <Button onClick={handleManualSubmit} disabled={isLoading || !paymentSlip} className="w-full mt-6" size="lg">
                                {isLoading ? 'Submitting...' : `Submit Payment of LKR ${selectedPlan.price.toLocaleString()}`}
                            </Button>
                        </TabsContent>
                        <TabsContent value="card" className="pt-6">
                           <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <h3 className="font-semibold text-lg">Coming Soon!</h3>
                                <p className="text-sm text-muted-foreground mt-1">Online card payments will be available shortly.</p>
                           </div>
                           <form onSubmit={handleCardSubmit} className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="•••• •••• •••• ••••" disabled />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry-date">Expiry Date</Label>
                                        <Input id="expiry-date" placeholder="MM / YY" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="•••" disabled />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" size="lg" disabled>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay LKR {selectedPlan.price.toLocaleString()} Securely
                                </Button>
                           </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

    
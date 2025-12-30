'use client';

import { useEffect, useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { pricingPlans } from '@/lib/data';
import { add } from 'date-fns';

interface PaymentData {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentSlipUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  paymentFor: 'Membership' | 'Banner';
  targetId: string;
  createdAt: any;
}

export default function PaymentsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const paymentsQuery = useMemoFirebase(
    () => firestore ? collection(firestore, 'payments') : null,
    [firestore]
  );
  
  const { data: payments, isLoading: isLoadingPayments } = useCollection<PaymentData>(paymentsQuery);
  
  const pendingPayments = payments?.filter(p => p.status === 'Pending').sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()) || [];

  const handlePaymentAction = async (payment: PaymentData, newStatus: 'Approved' | 'Rejected') => {
    if (!firestore) return;
    setIsProcessing(payment.id);

    const batch = writeBatch(firestore);

    try {
      const paymentRef = doc(firestore, 'payments', payment.id);
      batch.update(paymentRef, { status: newStatus });

      if (newStatus === 'Approved') {
        if (payment.paymentFor === 'Membership') {
          const plan = pricingPlans.find(p => p.id === payment.targetId);
          if (plan) {
            const membershipId = `${payment.userId}_${plan.id}`;
            const membershipRef = doc(firestore, 'memberships', membershipId);
            const userMembershipDoc = await getDoc(membershipRef);
            
            const startDate = new Date();
            const expiryDate = add(startDate, { months: plan.durationInMonths });

            if (userMembershipDoc.exists()) {
               batch.update(membershipRef, {
                    planId: plan.id,
                    startDate: startDate,
                    expiryDate: expiryDate,
                    status: 'Active'
               });
            } else {
               batch.set(membershipRef, {
                  id: membershipId,
                  userId: payment.userId,
                  planId: plan.id,
                  startDate: startDate,
                  expiryDate: expiryDate,
                  status: 'Active',
                  createdAt: serverTimestamp()
               });
            }
          }
        } else if (payment.paymentFor === 'Banner') {
          const bannerRef = doc(firestore, 'banners', payment.targetId);
          // This is a simplified duration calculation.
          // You might want a more robust way to parse duration from the banner data itself.
          const durationParts = payment.targetId.split('?')[0].split('&').find(p => p.startsWith('duration='))?.split('=')[1] || '1-week';
          const durationValue = parseInt(durationParts.split('-')[0]);
          const durationUnit = durationParts.split('-')[1] as 'week' | 'month';
          const unit = durationUnit.endsWith('s') ? durationUnit.slice(0,-1) as 'week' | 'month' : durationUnit;
          
          const startDate = new Date();
          const expiryDate = add(startDate, { [unit + 's']: durationValue });

          batch.update(bannerRef, { 
            status: 'Active',
            startDate: startDate,
            expiryDate: expiryDate,
          });
        }
      }

      await batch.commit();
      toast({
        title: 'සාර්ථකයි',
        description: `ගෙවීම ${newStatus === 'Approved' ? 'අනුමත කරන ලදී' : 'ප්‍රතික්ෂේප කරන ලදී'}.`,
      });

    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        variant: 'destructive',
        title: 'දෝෂයකි',
        description: 'ගෙවීම සැකසීමට නොහැකි විය.',
      });
    } finally {
      setIsProcessing(null);
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">ගෙවීම් කළමනාකරණය</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>අනුමත කිරීමට ඇති ගෙවීම්</CardTitle>
          <CardDescription>
            අතින් සිදු කරන ලද ගෙවීම් ඉදිරිපත් කිරීම් සමාලෝචනය කර අනුමත කිරීම හෝ ප්‍රතික්ෂේප කිරීම.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>දිනය</TableHead>
                <TableHead>පරිශීලක ID</TableHead>
                <TableHead>මුදල</TableHead>
                <TableHead>ගෙවීම</TableHead>
                <TableHead>ගෙවීම් පත්‍රිකාව</TableHead>
                <TableHead className="text-right">ක්‍රියා</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPayments ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    <TableCell className="text-right space-x-2"><Skeleton className="h-8 w-20 inline-block" /><Skeleton className="h-8 w-20 inline-block" /></TableCell>
                  </TableRow>
                ))
              ) : pendingPayments.length > 0 ? (
                pendingPayments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.createdAt.toDate().toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.userId}</TableCell>
                    <TableCell>රු. {payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.paymentFor}</Badge>
                      <p className="text-xs text-muted-foreground">{payment.targetId}</p>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">පත්‍රිකාව බලන්න</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>ගෙවීම් පත්‍රිකාව</DialogTitle>
                          </DialogHeader>
                          <div className="relative mt-4 aspect-square w-full">
                            <Image src={payment.paymentSlipUrl} alt="Payment Slip" layout="fill" objectFit="contain" />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handlePaymentAction(payment, 'Rejected')}
                        disabled={isProcessing === payment.id}
                      >
                        {isProcessing === payment.id ? '...' : 'ප්‍රතික්ෂේප කරන්න'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePaymentAction(payment, 'Approved')}
                        disabled={isProcessing === payment.id}
                      >
                        {isProcessing === payment.id ? '...' : 'අනුමත කරන්න'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">අනුමත කිරීමට ගෙවීම් නොමැත.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

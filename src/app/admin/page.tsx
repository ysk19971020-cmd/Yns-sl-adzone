'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from "firebase/firestore";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

export default function AdminDashboard() {
    const firestore = useFirestore();

    const paymentsQuery = useMemoFirebase(
        () => firestore ? collection(firestore, 'payments') : null,
        [firestore]
    );
    const { data: payments } = useCollection<any>(paymentsQuery);
    
    const adsQuery = useMemoFirebase(
        () => firestore ? collection(firestore, 'ads') : null,
        [firestore]
    );
    const { data: ads } = useCollection<any>(adsQuery);

    const usersQuery = useMemoFirebase(
        () => firestore ? collection(firestore, 'users') : null,
        [firestore]
    );
    const { data: users } = useCollection<any>(usersQuery);

    const pendingPaymentsCount = payments?.filter(p => p.status === 'Pending').length || 0;
    const activeAdsCount = ads?.length || 0;
    const totalUsersCount = users?.length || 0;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">පරිපාලක පාලන පුවරුව</h1>
            </div>
            <div
                className="flex flex-1 rounded-lg border border-dashed shadow-sm"
            >
                <div className="flex flex-col items-center gap-1 text-center p-8 w-full">
                    <h3 className="text-2xl font-bold tracking-tight">
                        පරිපාලක පැනලයට සාදරයෙන් පිළිගනිමු
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        ඔබට මෙතැනින් ගෙවීම්, දැන්වීම්, සහ පරිශීලකයින් කළමනාකරණය කළ හැක.
                    </p>
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    අනුමත කිරීමට ඇති ගෙවීම්
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingPaymentsCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    ගෙවීම් අනුමැතිය අවශ්‍යයි
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    සක්‍රිය දැන්වීම්
                                </CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{activeAdsCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    වෙබ් අඩවියේ දැනට සජීවීව ඇත
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">සම්පූර්ණ පරිශීලකයින්</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalUsersCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    පරිශීලකයින් ලියාපදිංචි වී ඇත
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

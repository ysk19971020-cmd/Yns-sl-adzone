
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Newspaper, RectangleEllipsis } from "lucide-react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostAdOptionsPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    return (
        <div className="container mx-auto max-w-2xl py-16">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">What would you like to post?</CardTitle>
                    <CardDescription>Choose the type of advertisement you want to create.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <Link href="/post-ad" className="flex flex-col">
                        <Card className="h-full hover:border-primary hover:shadow-lg transition-all flex flex-col items-center justify-center text-center p-8">
                            <Newspaper className="h-16 w-16 text-primary mb-4" />
                            <h3 className="text-xl font-bold">Post a Classified Ad</h3>
                            <p className="text-muted-foreground mt-2">Sell your items, list properties, or offer services.</p>
                        </Card>
                    </Link>
                    <Link href="/post-banner-ad" className="flex flex-col">
                        <Card className="h-full hover:border-accent hover:shadow-lg transition-all flex flex-col items-center justify-center text-center p-8">
                           <RectangleEllipsis className="h-16 w-16 text-accent mb-4" />
                            <h3 className="text-xl font-bold">Post a Banner Ad</h3>
                            <p className="text-muted-foreground mt-2">Promote your business on our prime advertising spaces.</p>
                        </Card>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

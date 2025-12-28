'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingPlans } from "@/lib/data";
import { Check } from "lucide-react";
import Link from "next/link";


export default function PricingPage() {
    return (
        <div className="flex flex-col items-center py-12 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground">
                    Membership Plans
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Choose a plan that suits your needs and start posting unlimited ads today.
                </p>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pricingPlans.map((plan) => (
                        <Card key={plan.id} className="flex flex-col border-2 hover:border-primary hover:shadow-xl transition-all">
                            <CardHeader className="text-center">
                                <CardTitle className="font-headline text-3xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="text-center mb-6">
                                    <span className="text-4xl font-bold">LKR {plan.price.toLocaleString()}</span>
                                    <span className="text-lg text-muted-foreground">/ {plan.duration}</span>
                                </div>
                                <ul className="space-y-3 text-muted-foreground">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" size="lg">
                                    <Link href={`/payment/${plan.id}`}>Choose Plan</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

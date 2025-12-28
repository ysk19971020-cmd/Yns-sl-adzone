import { Car, Building2, Ban, Package, Star } from 'lucide-react';
import type { ComponentType } from 'react';

export interface Ad {
  id: string;
  title: string;
  description: string;
  category: '18-plus' | 'vehicles' | 'properties' | 'misc';
  categoryName: string;
  price: number;
  location: string;
  imageUrl: string;
  imageHint: string;
  postedAt: string;
}

export interface Category {
    slug: '18-plus' | 'vehicles' | 'properties' | 'misc';
    name: string;
    icon: ComponentType<{ className?: string }>;
}

export interface PricingPlan {
    id: 'silver' | 'gold' | 'platinum' | 'global-vip';
    name:string;
    description: string;
    price: number;
    duration: string;
    features: string[];
}

export const categories: Category[] = [
    { slug: 'vehicles', name: 'Vehicles', icon: Car },
    { slug: 'properties', name: 'Properties', icon: Building2 },
    { slug: 'misc', name: 'Misc Ads', icon: Package },
    { slug: '18-plus', name: '18+ Ads', icon: Ban },
];

export const pricingPlans: PricingPlan[] = [
    {
        id: 'silver',
        name: 'Silver',
        description: '3 months of unlimited ads.',
        price: 1500,
        duration: '3 Months',
        features: ['Unlimited Ads for 3 months', 'Standard ad visibility', 'Email support']
    },
    {
        id: 'gold',
        name: 'Gold',
        description: '6 months of unlimited ads.',
        price: 3000,
        duration: '6 Months',
        features: ['Unlimited Ads for 6 months', 'Enhanced ad visibility', 'Priority email support']
    },
    {
        id: 'platinum',
        name: 'Platinum',
        description: '9 months of unlimited ads.',
        price: 6000,
        duration: '9 Months',
        features: ['Unlimited Ads for 9 months', 'High ad visibility', '24/7 phone & email support']
    },
    {
        id: 'global-vip',
        name: 'Global VIP',
        description: '1 year of unlimited ads + banner placement.',
        price: 15000,
        duration: '1 Year',
        features: ['Unlimited Ads for 1 year', 'Top ad visibility', 'Includes Banner Ads', 'VIP support']
    }
];


export const ads: Ad[] = [];

import { Car, Building2, Ban, Package } from 'lucide-react';
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
    id: 'silver' | 'gold' | 'platinum';
    name: string;
    description: string;
    price: number;
    features: string[];
}

export const categories: Category[] = [
    { slug: '18-plus', name: '18+ Ads', icon: Ban },
    { slug: 'vehicles', name: 'Vehicles', icon: Car },
    { slug: 'properties', name: 'Properties', icon: Building2 },
    { slug: 'misc', name: 'Misc Ads', icon: Package }
];

export const pricingPlans: PricingPlan[] = [
    {
        id: 'silver',
        name: 'Silver',
        description: 'For individuals starting out.',
        price: 1000,
        features: ['Post up to 5 ads', 'Basic ad visibility', 'Email support']
    },
    {
        id: 'gold',
        name: 'Gold',
        description: 'For small businesses and frequent posters.',
        price: 2500,
        features: ['Post up to 20 ads', 'Enhanced ad visibility', 'Priority email support', 'Featured ads option']
    },
    {
        id: 'platinum',
        name: 'Platinum',
        description: 'For power users and agencies.',
        price: 5000,
        features: ['Unlimited ads', 'Top ad visibility', '24/7 phone & email support', 'All ads featured']
    }
];


export const ads: Ad[] = [];

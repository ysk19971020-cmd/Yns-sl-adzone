import { Car, Building2, Ban, Package, Star } from 'lucide-react';
import type { ComponentType } from 'react';

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string; // district
  imageUrls: string[];
  categoryName: string; // From categoryId
  postedAt: string; // from createdAt timestamp
  userId: string;
  categoryId: string;
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
    durationInMonths: number;
    features: string[];
}

export const categories: Category[] = [
    { slug: 'vehicles', name: 'වාහන', icon: Car },
    { slug: 'properties', name: 'දේපළ', icon: Building2 },
    { slug: 'misc', name: 'විවිධ දැන්වීම්', icon: Package },
    { slug: '18-plus', name: '18+ දැන්වීම්', icon: Ban },
];

export const pricingPlans: PricingPlan[] = [
    {
        id: 'silver',
        name: 'රිදී',
        description: 'මාස 3ක අසීමිත දැන්වීම්.',
        price: 1500,
        duration: 'මාස 3',
        durationInMonths: 3,
        features: ['මාස 3ක් සඳහා අසීමිත දැන්වීම්', 'සම්මත දැන්වීම් දෘශ්‍යතාව', 'ඊමේල් සහාය']
    },
    {
        id: 'gold',
        name: 'රන්',
        description: 'මාස 6ක අසීමිත දැන්වීම්.',
        price: 3000,
        duration: 'මාස 6',
        durationInMonths: 6,
        features: ['මාස 6ක් සඳහා අසීමිත දැන්වීම්', 'වැඩි දියුණු කළ දැන්වීම් දෘශ්‍යතාව', 'ප්‍රමුඛතා ඊමේල් සහාය']
    },
    {
        id: 'platinum',
        name: 'ප්ලැටිනම්',
        description: 'මාස 9ක අසීමිත දැන්වීම්.',
        price: 6000,
        duration: 'මාස 9',
        durationInMonths: 9,
        features: ['මාස 9ක් සඳහා අසීමිත දැන්වීම්', 'ඉහළ දැන්වීම් දෘශ්‍යතාව', '24/7 දුරකථන සහ ඊමේල් සහාය']
    },
    {
        id: 'global-vip',
        name: 'Global VIP',
        description: 'වසර 1ක අසීමිත දැන්වීම් + බැනර් ස්ථානගත කිරීම.',
        price: 15000,
        duration: 'වසර 1',
        durationInMonths: 12,
        features: ['වසර 1ක් සඳහා අසීමිත දැන්වීම්', 'ඉහළම දැන්වීම් දෘශ්‍යතාව', 'බැනර් දැන්වීම් ඇතුළත්', 'VIP සහාය']
    }
];


export const ads: Ad[] = [];

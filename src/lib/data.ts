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

export const categories: Category[] = [
    { slug: '18-plus', name: '18+ Ads', icon: Ban },
    { slug: 'vehicles', name: 'Vehicles', icon: Car },
    { slug: 'properties', name: 'Properties', icon: Building2 },
    { slug: 'misc', name: 'Misc Ads', icon: Package }
];

export const ads: Ad[] = [];

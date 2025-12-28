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

export const ads: Ad[] = [
  {
    id: '1',
    title: 'Toyota Aqua 2018 for Sale',
    description: 'Well-maintained Toyota Aqua, 2018 model. First owner, genuine mileage. Contact for more details.',
    category: 'vehicles',
    categoryName: 'Vehicles',
    price: 7800000,
    location: 'Colombo',
    imageUrl: 'https://picsum.photos/seed/car1/400/300',
    imageHint: 'modern car',
    postedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Luxury Apartment in Rajagiriya',
    description: '3 bedroom apartment with a stunning view. Includes pool and gym facilities. Fully furnished.',
    category: 'properties',
    categoryName: 'Properties',
    price: 45000000,
    location: 'Rajagiriya',
    imageUrl: 'https://picsum.photos/seed/apartment1/400/300',
    imageHint: 'apartment building',
    postedAt: '5 hours ago',
  },
  {
    id: '3',
    title: 'Brand New iPhone 14 Pro',
    description: 'Sealed pack iPhone 14 Pro, 256GB, Deep Purple. International warranty included.',
    category: 'misc',
    categoryName: 'Misc Ads',
    price: 450000,
    location: 'Kandy',
    imageUrl: 'https://picsum.photos/seed/phone1/400/300',
    imageHint: 'smartphone',
    postedAt: '1 day ago',
  },
  {
    id: '4',
    title: 'Honda Dio Scooter',
    description: 'Excellent condition Honda Dio, 2020 model. Low mileage, all documents clear. Perfect for city rides.',
    category: 'vehicles',
    categoryName: 'Vehicles',
    price: 650000,
    location: 'Galle',
    imageUrl: 'https://picsum.photos/seed/scooter1/400/300',
    imageHint: 'scooter',
    postedAt: '2 days ago',
  },
   {
    id: '5',
    title: 'Canon EOS R5 Mirrorless Camera',
    description: 'Barely used Canon R5 body with original box and accessories. Shutter count below 5k.',
    category: 'misc',
    categoryName: 'Misc Ads',
    price: 900000,
    location: 'Nugegoda',
    imageUrl: 'https://picsum.photos/seed/camera1/400/300',
    imageHint: 'digital camera',
    postedAt: '3 days ago',
  },
  {
    id: '6',
    title: 'Land for Sale in Malabe',
    description: '10 perch square land in a quiet residential area. 5 minutes to Malabe town.',
    category: 'properties',
    categoryName: 'Properties',
    price: 25000000,
    location: 'Malabe',
    imageUrl: 'https://picsum.photos/seed/land1/400/300',
    imageHint: 'empty lot',
    postedAt: '4 days ago',
  },
  {
    id: '7',
    title: 'Antique Wooden Cabinet',
    description: 'Rare antique cabinet made from teak wood. Over 100 years old. Perfect for collectors.',
    category: 'misc',
    categoryName: 'Misc Ads',
    price: 150000,
    location: 'Dehiwala',
    imageUrl: 'https://picsum.photos/seed/cabinet1/400/300',
    imageHint: 'wooden furniture',
    postedAt: '5 days ago',
  },
  {
    id: '8',
    title: 'Mitsubishi Montero Sport 2021',
    description: 'Jeep in mint condition. Company maintained, full option. A real beast on the road.',
    category: 'vehicles',
    categoryName: 'Vehicles',
    price: 28500000,
    location: 'Colombo 7',
    imageUrl: 'https://picsum.photos/seed/suv1/400/300',
    imageHint: 'SUV car',
    postedAt: '1 week ago',
  },
];

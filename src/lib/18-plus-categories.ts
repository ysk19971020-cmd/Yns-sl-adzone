import type { ComponentType } from 'react';
import {
  Heart,
  Video,
  Waves,
  User,
  Users,
  KeyRound,
  Tag,
  Gem,
  Puzzle,
  BedDouble,
  Newspaper,
  Briefcase,
  UserCheck,
  BarChart
} from 'lucide-react';

export interface SubCategory {
  slug: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
}

export const subCategories18Plus: SubCategory[] = [
  { slug: 'girls-personal', name: 'Girls Personal', icon: Heart },
  { slug: 'live-cam', name: 'Live Cam', icon: Video },
  { slug: 'spa', name: 'Spa', icon: Waves },
  { slug: 'boys-personal', name: 'Boys Personal', icon: User },
  { slug: 'shemale', name: 'Shemale', icon: Users },
  { slug: 'rent', name: 'Rent', icon: KeyRound },
  { slug: 'sale', name: 'Sale', icon: Tag },
  { slug: 'marriage-proposal', name: 'Marriage Proposal', icon: Gem },
  { slug: 'toys-accessories', name: 'Toys & Accessories', icon: Puzzle },
  { slug: 'rooms', name: 'Rooms', icon: BedDouble },
  { slug: 'lanka-ad', name: 'Lanka Ad', icon: Newspaper },
  { slug: 'lanka-jobs', name: 'Lanka Job\'s', icon: Briefcase },
  { slug: 'ad-agent', name: 'Ad Agent', icon: UserCheck },
  { slug: 'sales', name: 'Sales', icon: BarChart },
];

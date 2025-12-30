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
  { slug: 'girls-personal', name: 'කාන්තා පුද්ගලික', icon: Heart },
  { slug: 'live-cam', name: 'සජීවී කැමරා', icon: Video },
  { slug: 'spa', name: 'ස්පා', icon: Waves },
  { slug: 'boys-personal', name: 'පිරිමි පුද්ගලික', icon: User },
  { slug: 'shemale', name: 'සමලිංගික', icon: Users },
  { slug: 'rent', name: 'කුලියට', icon: KeyRound },
  { slug: 'sale', name: 'විකිණීමට', icon: Tag },
  { slug: 'marriage-proposal', name: 'විවාහ යෝජනා', icon: Gem },
  { slug: 'toys-accessories', name: 'සෙල්ලම් බඩු සහ උපාංග', icon: Puzzle },
  { slug: 'rooms', name: 'කාමර', icon: BedDouble },
  { slug: 'lanka-ad', name: 'ලංකා දැන්වීම්', icon: Newspaper },
  { slug: 'lanka-jobs', name: 'ලංකා රැකියා', icon: Briefcase },
  { slug: 'ad-agent', name: 'දැන්වීම් නියෝජිත', icon: UserCheck },
  { slug: 'sales', name: 'විකුණුම්', icon: BarChart },
];

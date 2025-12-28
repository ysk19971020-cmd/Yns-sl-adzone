import Link from 'next/link';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              The best marketplace in Sri Lanka.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/vehicles" className="text-muted-foreground hover:text-foreground">Vehicles</Link></li>
              <li><Link href="/category/properties" className="text-muted-foreground hover:text-foreground">Properties</Link></li>
              <li><Link href="/category/misc" className="text-muted-foreground hover:text-foreground">Misc Ads</Link></li>
              <li><Link href="/category/18-plus" className="text-muted-foreground hover:text-foreground">18+ Ads</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Our Apps</h3>
            <p className="text-sm text-muted-foreground">Coming Soon</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AdZone Lanka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

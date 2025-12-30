import Link from 'next/link';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full border-t bg-card text-card-foreground", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground">
              ශ්‍රී ලංකාවේ හොඳම වෙළඳපොළ.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">ඉක්මන් සබැඳි</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">අප ගැන</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">අමතන්න</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">මිල ගණන්</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">සේවා කොන්දේසි</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">ප්‍රවර්ග</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/vehicles" className="text-muted-foreground hover:text-foreground">වාහන</Link></li>
              <li><Link href="/category/properties" className="text-muted-foreground hover:text-foreground">දේපළ</Link></li>
              <li><Link href="/category/misc" className="text-muted-foreground hover:text-foreground">විවිධ දැන්වීම්</Link></li>
              <li><Link href="/category/18-plus" className="text-muted-foreground hover:text-foreground">18+ දැන්වීම්</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">අපගේ යෙදුම්</h3>
            <p className="text-sm text-muted-foreground">ළඟදීම</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AdZone Lanka. සියලුම හිමිකම් ඇවිරිණි.</p>
        </div>
      </div>
    </footer>
  );
}

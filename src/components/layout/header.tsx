"use client";

import * as React from 'react';
import Link from 'next/link';
import { Menu, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { Logo } from '@/components/logo';
import { useUser, useAuth } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from 'firebase/auth';

const PRIMARY_ADMIN_EMAIL = 'ysk19971020@gmail.com';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  // The isAdmin state is determined by checking the user's email.
  const isAdmin = !isUserLoading && user?.email === PRIMARY_ADMIN_EMAIL;

  const handleSignOut = () => {
    if(auth) {
      signOut(auth);
    }
  };

  return (
    <header className="sticky top-20 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-40 pr-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
              href={`/pricing`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {category.name}
            </Link>
          ))}
           <Link
              href={`/about`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
             <Link
              href={`/contact`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
            </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isUserLoading ? (
             <Button variant="ghost" size="icon" disabled>
                <User />
             </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild><Link href="/profile">My Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/my-ads">My Ads</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild variant="ghost" size="icon">
                <Link href="/login">
                    <User />
                </Link>
            </Button>
          )}

          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/post-ad">Post Ad</Link>
          </Button>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setOpen(false)}>
                  <Logo />
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href={`/pricing`}
                    className="font-medium text-lg"
                    onClick={() => setOpen(false)}
                  >
                    Pricing
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className="font-medium text-lg"
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                    <Link
                        href={`/about`}
                        className="font-medium text-lg"
                        onClick={() => setOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href={`/contact`}
                        className="font-medium text-lg"
                        onClick={() => setOpen(false)}
                    >
                        Contact
                    </Link>
                   {isUserLoading ? null : user ? null : (
                     <Button asChild variant="outline" onClick={() => setOpen(false)}>
                        <Link href="/login">Login</Link>
                     </Button>
                   )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

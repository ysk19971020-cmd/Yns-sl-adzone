"use client";

import * as React from 'react';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAuth, signOut } from 'firebase/auth';


export function Header() {
  const [open, setOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth);
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
        </nav>

        <div className="flex items-center gap-4">
          {isUserLoading ? (
             <Button variant="ghost" className="hidden md:inline-flex" disabled>Login</Button>
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>My Ads</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Login</Link>
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
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import * as React from 'react';
import Link from 'next/link';
import { Menu, User, Shield } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { categories } from '@/lib/data';
import { Logo } from '@/components/logo';
import { useUser, useAuth, useFirestore } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';

const PRIMARY_ADMIN_EMAIL = 'ysk19971020@gmail.com';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (user && firestore) {
        if (user.email === PRIMARY_ADMIN_EMAIL) {
          setIsAdmin(true);
          return;
        }
        try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().isAdmin) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    if (isClient && !isUserLoading) {
      checkAdmin();
    }
  }, [user, isUserLoading, firestore, isClient]);

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
          {isClient && !isUserLoading ? (
            user ? (
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
            )
          ) : (
             null
          )}

          {isClient ? (
            !isUserLoading ? (
              <Link href="/post-ad" className={cn(buttonVariants({ className: "bg-accent hover:bg-accent/90" }))}>
                Post Ad
              </Link>
            ) : (
              <Button disabled className="bg-accent hover:bg-accent/90">Post Ad</Button>
            )
          ) : (
            <Button disabled className="bg-accent hover:bg-accent/90">Post Ad</Button>
          )}
          
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
                   {isClient && !isUserLoading && !user ? (
                     <Button asChild variant="outline" onClick={() => setOpen(false)}>
                        <Link href="/login">Login</Link>
                     </Button>
                   ) : null}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

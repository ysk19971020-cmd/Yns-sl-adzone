'use client';

import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUser, useFirestore } from '@/firebase';
import { DollarSign, LayoutDashboard, ShoppingBag, Users, Star, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Toaster } from '@/components/ui/toaster';

function AdminHeader() {
  const { isMobile } = useSidebar();
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <Logo />
      </div>
    </header>
  );
}

const PRIMARY_ADMIN_EMAIL = 'ysk19971020@gmail.com';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading || !firestore) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const checkAdminStatus = async () => {
      let currentUserIsAdmin = false;
      const userDocRef = doc(firestore, 'users', user.uid);

      if (user.email === PRIMARY_ADMIN_EMAIL) {
        currentUserIsAdmin = true;
        // Ensure the admin flag is set in Firestore for the primary admin
        await setDoc(userDocRef, { isAdmin: true }, { merge: true });
      } else {
         const userDoc = await getDoc(userDocRef);
         if (userDoc.exists() && userDoc.data().isAdmin === true) {
            currentUserIsAdmin = true;
         }
      }
      
      setIsAdmin(currentUserIsAdmin);
      setIsCheckingAdmin(false);

      if (!currentUserIsAdmin) {
        router.push('/');
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, router]);
  

  if (isCheckingAdmin || isUserLoading) {
    return <div className="flex h-screen items-center justify-center">Checking permissions...</div>;
  }
  
  if (!isAdmin) {
     return null; // Don't render anything, router.push will handle redirection
  }

  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <div className="flex min-h-screen w-full flex-col">
          <AdminHeader />
          <div className="flex">
            <Sidebar>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/admin')} tooltip="Dashboard">
                          <Link href="/admin">
                              <LayoutDashboard />
                              Dashboard
                          </Link>
                       </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/admin/payments')} tooltip="Payments">
                        <Link href="/admin/payments">
                          <DollarSign />
                          Payments
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/admin/ads')} tooltip="Ads">
                        <Link href="/admin/ads">
                          <ShoppingBag />
                           Ads
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/admin/banners')} tooltip="Banners">
                        <Link href="/admin/banners">
                          <ImageIcon />
                           Banners
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/admin/memberships')} tooltip="Memberships">
                        <Link href="/admin/memberships">
                          <Star />
                           Memberships
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild isActive={isActive('/admin/users')} tooltip="Users">
                         <Link href="/admin/users">
                          <Users />
                          Users
                        </Link>
                       </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>{children}</SidebarInset>
             <Toaster />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

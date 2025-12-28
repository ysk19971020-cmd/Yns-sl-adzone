'use client';

import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { DollarSign, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
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
    if (isUserLoading || !firestore) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data()?.isAdmin === true) {
          setIsAdmin(true);
        } else {
          // If not an admin, redirect to home page
          router.push('/');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        router.push('/');
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, router]);

  if (isCheckingAdmin || isUserLoading) {
    return <div className="flex h-screen items-center justify-center">Checking permissions...</div>;
  }
  
  if (!isAdmin) {
     return <div className="flex h-screen items-center justify-center">You do not have permission to view this page.</div>;
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
                       <Link href="/admin" legacyBehavior passHref>
                          <SidebarMenuButton isActive={isActive('/admin')} tooltip="Dashboard">
                              <LayoutDashboard />
                              Dashboard
                          </SidebarMenuButton>
                       </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/admin/payments" legacyBehavior passHref>
                        <SidebarMenuButton isActive={isActive('/admin/payments')} tooltip="Payments">
                          <DollarSign />
                          Payments
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                      <Link href="/admin/ads" legacyBehavior passHref>
                        <SidebarMenuButton isActive={isActive('/admin/ads')} tooltip="Ads">
                          <ShoppingBag />
                           Ads
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                       <Link href="/admin/users" legacyBehavior passHref>
                        <SidebarMenuButton isActive={isActive('/admin/users')} tooltip="Users">
                          <Users />
                          Users
                        </SidebarMenuButton>
                       </Link>
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

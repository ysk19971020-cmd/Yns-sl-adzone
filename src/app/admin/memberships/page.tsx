
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembershipsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Membership Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Memberships</CardTitle>
          <CardDescription>
            View and manage user membership plans and statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Membership Management Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground">
                You'll be able to manage all user memberships from this page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

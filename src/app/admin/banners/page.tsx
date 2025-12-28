
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BannersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Banner Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Banner Ads</CardTitle>
          <CardDescription>
            Approve, reject, and manage banner ad placements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Banner Management Coming Soon
              </h3>
              <p className="text-sm text-muted-foreground">
                You'll be able to manage all banner ads from this page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

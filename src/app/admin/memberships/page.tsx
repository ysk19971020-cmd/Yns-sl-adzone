'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembershipsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">සාමාජික කළමනාකරණය</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>පරිශීලක සාමාජිකත්ව</CardTitle>
          <CardDescription>
            පරිශීලක සාමාජික සැලසුම් සහ තත්ත්වයන් බලන්න සහ කළමනාකරණය කරන්න.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                සාමාජික කළමනාකරණය ટૂંક સમયમાં આવી રહ્યું છે
              </h3>
              <p className="text-sm text-muted-foreground">
                ඔබට මෙම පිටුවෙන් සියලුම පරිශීලක සාමාජිකත්වයන් කළමනාකරණය කිරීමට හැකි වනු ඇත.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

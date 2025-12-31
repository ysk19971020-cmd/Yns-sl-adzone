'use client';

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

interface MembershipData {
  id: string;
  userId: string;
  planId: string;
  startDate: any;
  expiryDate: any;
  status: 'Active' | 'Expired' | 'Pending';
}

export default function MembershipsPage() {
  const firestore = useFirestore();

  const membershipsQuery = useMemoFirebase(
    () => firestore ? collection(firestore, 'memberships') : null,
    [firestore]
  );
  
  const { data: memberships, isLoading: isLoadingMemberships } = useCollection<MembershipData>(membershipsQuery);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>පරිශීලක ID</TableHead>
                <TableHead>සැලැස්ම</TableHead>
                <TableHead>තත්ත්වය</TableHead>
                <TableHead>ආරම්භක දිනය</TableHead>
                <TableHead>කල් ඉකුත්වන දිනය</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingMemberships ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : memberships && memberships.length > 0 ? (
                memberships.map(membership => (
                  <TableRow key={membership.id}>
                    <TableCell className="font-mono text-xs">{membership.userId}</TableCell>
                    <TableCell><Badge variant="secondary">{membership.planId}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={membership.status === 'Active' ? 'default' : 'destructive'}>
                        {membership.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {membership.startDate ? format(membership.startDate.toDate(), 'yyyy-MM-dd') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {membership.expiryDate ? format(membership.expiryDate.toDate(), 'yyyy-MM-dd') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">සාමාජිකත්ව හමු නොවීය.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

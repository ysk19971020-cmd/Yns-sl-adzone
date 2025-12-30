'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async () => {
    if (!auth) {
      toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'සත්‍යාපන සේවාව සූදානම් නැත.' });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'සාර්ථකයි', description: 'සාර්ථකව පිවිසිනි.' });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'පිවිසීම අසාර්ථකයි', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'දෝෂයකි', description: 'සත්‍යාපන හෝ Firestore සේවාව සූදානම් නැත.' });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', newUser.uid), {
        id: newUser.uid,
        email: newUser.email,
        isAdmin: false, // Default isAdmin to false
      });

      toast({ title: 'සාර්ථකයි', description: 'ගිණුම සාර්ථකව නිර්මාණය කරන ලදී. ඔබ දැන් පිවිස ඇත.' });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'ලියාපදිංචි වීම අසාර්ථකයි', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(activeTab === 'login') {
          handleLogin();
      } else {
          handleSignUp();
      }
  }

  if (isUserLoading || (!isUserLoading && user)) {
    return <div className="flex items-center justify-center min-h-screen">පූරණය වෙමින් පවතී...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{activeTab === 'login' ? 'පිවිසෙන්න' : 'ලියාපදිංචි වන්න'}</CardTitle>
          <CardDescription>
            පිවිසීමට ඔබගේ ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">පිවිසෙන්න</TabsTrigger>
              <TabsTrigger value="signup">ලියාපදිංචි වන්න</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
               <TabsContent value="login" className="m-0 p-0 space-y-4">
                    <Input
                        type="email"
                        placeholder="ඊමේල්"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        type="password"
                        placeholder="මුරපදය"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !email || !password} className="w-full">
                        {isLoading ? 'පූරණය වෙමින්...' : 'පිවිසෙන්න'}
                    </Button>
                </TabsContent>
                <TabsContent value="signup" className="m-0 p-0 space-y-4">
                     <Input
                        type="email"
                        placeholder="ඊමේල්"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        type="password"
                        placeholder="මුරපදය"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !email || !password} className="w-full">
                        {isLoading ? 'ගිණුම නිර්මාණය කරමින්...' : 'ලියාපදිංචි වන්න'}
                    </Button>
                </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

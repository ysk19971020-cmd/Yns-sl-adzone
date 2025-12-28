'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (auth && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }
  }, [auth]);

  const handleSendOtp = async () => {
    if (!auth || !window.recaptchaVerifier) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Recaptcha not initialized. Please wait a moment and try again.',
        });
        return;
    }
    
    setIsLoading(true);
    // Add country code if not present
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+94${phoneNumber.replace(/^0/, '')}`;
    
    try {
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${formattedPhoneNumber}.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error sending OTP',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Success',
        description: 'You have been logged in successfully.',
      });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error verifying OTP',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || (!isUserLoading && user)) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div> // Or a spinner component
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            {otpSent ? 'Enter the OTP sent to your phone' : 'Enter your phone number to login'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!otpSent ? (
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="e.g., 0771234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleSendOtp} disabled={isLoading || !phoneNumber} className="w-full">
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleVerifyOtp} disabled={isLoading || !otp} className="w-full">
                  {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
                </Button>
                 <Button variant="link" onClick={() => setOtpSent(false)} disabled={isLoading}>
                    Back to phone number
                </Button>
              </div>
            )}
          </div>
          <div id="recaptcha-container" className="mt-4"></div>
        </CardContent>
      </Card>
    </div>
  );
}

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
    }
}

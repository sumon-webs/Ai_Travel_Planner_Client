'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthForm from '@/components/auth/AuthForm';
import GoogleButton from '@/components/auth/GoogleButton';
import AuthFooter from '@/components/auth/AuthFooter';
import { signUp, signIn, useSession } from '@/lib/auth-client';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signUp.email({
        email,
        password,
        name: fullName,
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const result = await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/`,
      });
      
      // Handle redirect if Better Auth returns a redirect URL
      if (result && typeof result === 'object' && 'redirect' in result && result.redirect && 'url' in result) {
        window.location.href = (result as any).url;
      }
    } catch (error) {
      console.error('Google signup failed:', error);
      setIsLoading(false);
    }
  };



  return (
    <AuthLayout>
      <AuthCard title="Create Account" showIllustration>
        <AuthForm type="signup" onSubmit={handleSubmit} isLoading={isLoading} />
        <GoogleButton onClick={handleGoogleSignup} isLoading={isLoading} />
        <AuthFooter type="signup" />
      </AuthCard>
    </AuthLayout>
  );
}

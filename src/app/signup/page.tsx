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
  const [error, setError] = useState('');
  const { data: session, isPending } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
      // If successful, redirect will happen automatically via session check
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error?.message || 'Signup failed. Please check your information and try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/`,
      });

      // Handle redirect if Better Auth returns a redirect URL
      if (result && typeof result === 'object' && 'redirect' in result && result.redirect && 'url' in result) {
        window.location.href = (result as any).url;
      } else {
        // If no redirect, reset loading state
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Google signup failed:', error);
      setError(error?.message || 'Google signup failed. Please try again.');
      setIsLoading(false);
    }
  };



  return (
    <AuthLayout>
      <AuthCard title="Create Account" showIllustration>
         <div className=' space-y-3'>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <AuthForm type="signup" onSubmit={handleSubmit} isLoading={isLoading} />
          <GoogleButton onClick={handleGoogleSignup} isLoading={isLoading} />
        </div>
        <AuthFooter type="signup" />
      </AuthCard>
    </AuthLayout>
  );
}

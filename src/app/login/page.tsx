'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthForm from '@/components/auth/AuthForm';
import GoogleButton from '@/components/auth/GoogleButton';
import AuthFooter from '@/components/auth/AuthFooter';
import { signIn, useSession } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await signIn.email({
        email,
        password,
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      console.error('Google login failed:', error);
      setIsLoading(false);
    }
  };

  // Redirect to home if session is available (after successful login)
  if (!isPending && session) {
    router.push('/');
  }

  return (
    <AuthLayout>
      <AuthCard title="Welcome Back" showIllustration>
        <AuthForm type="login" onSubmit={handleSubmit} isLoading={isLoading} />
        <GoogleButton onClick={handleGoogleLogin} isLoading={isLoading} />
        <AuthFooter type="login" />
      </AuthCard>
    </AuthLayout>
  );
}

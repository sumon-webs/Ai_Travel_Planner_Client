'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthCard from '@/components/auth/AuthCard';
import AuthForm from '@/components/auth/AuthForm';
import GoogleButton from '@/components/auth/GoogleButton';
import DemoLoginCard from '@/components/auth/DemoLoginCard';
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
      await signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.email({
        email: 'demo@aitravel.com',
        password: 'Demo123@',
        callbackURL: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error('Demo login failed:', error);
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
        <DemoLoginCard onDemoLogin={handleDemoLogin} isLoading={isLoading} />
        <AuthFooter type="login" />
      </AuthCard>
    </AuthLayout>
  );
}

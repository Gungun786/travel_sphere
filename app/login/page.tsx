'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('callbackUrl');
    if (value) setCallbackUrl(value);
  }, []);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="https://images.pexels.com/photos/28890056/pexels-photo-28890056.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Kerala backwaters"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean/80 via-ocean/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Globe className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold">TravelSphere</span>
          </Link>
          <h2 className="mt-8 font-display text-3xl font-bold leading-tight text-balance">
            Welcome back. Your next adventure is waiting.
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean text-white">
              <Globe className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold">TravelSphere</span>
          </Link>

          <h1 className="mt-8 font-display text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue planning your trips with your group.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-8 w-full gap-2"
            onClick={() => void signIn('google', { callbackUrl })}
          >
            <GoogleIcon /> Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Only verified Google accounts can sign in.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

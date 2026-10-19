'use client';

import { Search, Bell } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store/userStore';

export function Header({ title }: { title?: string }) {
  const user = useUserStore((s) => s.user);
  const { data: session } = useSession();
  const sessionUser = session?.user;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        {title && (
          <h1 className="font-display text-lg font-semibold tracking-tight md:text-xl">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search trips, places…"
            className="h-10 w-56 rounded-lg border border-input bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ocean focus:bg-background md:w-72"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-sunset" />
        </button>

        {sessionUser ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {sessionUser.image && <AvatarImage src={sessionUser.image} alt={sessionUser.name ?? 'Traveler'} />}
              <AvatarFallback>{sessionUser.name?.slice(0, 2).toUpperCase() ?? 'TR'}</AvatarFallback>
            </Avatar>
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium leading-tight">{sessionUser.name ?? sessionUser.email}</p>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-xs text-muted-foreground hover:text-foreground">
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => signIn('google')} className="text-sm font-medium text-ocean hover:underline">
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}

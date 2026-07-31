'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Compass, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Trips', href: '/dashboard?tab=trips', icon: Map },
  { label: 'Explore', href: '/dashboard?tab=explore', icon: Compass },
  { label: 'Profile', href: '/profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href.split('?')[0];
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium transition-colors',
              active ? 'text-ocean' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

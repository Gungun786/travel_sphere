'use client';

import Link from 'next/link';
import { Share2, Pencil, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Trip } from '@/types';
import { formatDateRange } from './shared';

const subNav = [
  { label: 'Overview', segment: '' },
  { label: 'Group', segment: 'group' },
  { label: 'Destination', segment: 'destination' },
  { label: 'Itinerary', segment: 'itinerary' },
  { label: 'Budget', segment: 'budget' },
  { label: 'Expenses', segment: 'expenses' },
];

export function TripHero({ trip, active }: { trip: Trip; active: string }) {
  return (
    <div className="relative">
      <div className="relative h-56 w-full overflow-hidden md:h-72">
        <img src={trip.image} alt={trip.destinationName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-6 md:px-8">
            <p className="text-sm font-medium text-white/70">{formatDateRange(trip.startDate, trip.endDate)}</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-4xl">{trip.name}</h1>
            <p className="mt-1 text-white/80">{trip.destinationName} · {trip.travelers} travelers · {trip.days} days</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <Button size="sm" className="gap-1.5 bg-white/10 text-white hover:bg-white/20">
                <Pencil className="h-3.5 w-3.5" /> Edit Trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub navigation */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <nav className="no-scrollbar flex gap-1 overflow-x-auto">
            {subNav.map((n) => {
              const href = `/trip/${trip.id}${n.segment ? '/' + n.segment : ''}`;
              const isActive = active === n.label;
              return (
                <Link
                  key={n.label}
                  href={href}
                  className={`flex items-center gap-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'border-ocean text-ocean' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

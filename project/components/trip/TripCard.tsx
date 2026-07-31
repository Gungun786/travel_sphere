'use client';

import Link from 'next/link';
import { Users, Calendar, IndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Trip } from '@/types';
import { formatINR, formatDateRange } from './shared';

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative h-44 overflow-hidden">
        <img
          src={trip.image}
          alt={trip.destinationName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight">
              {trip.name}
            </h3>
            <p className="text-sm text-white/80">{trip.destinationName}</p>
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
            {trip.status}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {trip.travelers} travelers
          </span>
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <IndianRupee className="h-4 w-4" />
            {formatINR(trip.budget)}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Planning progress</span>
            <span className="font-medium">{trip.progress}%</span>
          </div>
          <Progress value={trip.progress} className="h-1.5" />
        </div>

        <Link href={`/trip/${trip.id}`} className="block">
          <Button variant="outline" className="w-full">
            View Trip
          </Button>
        </Link>
      </div>
    </Card>
  );
}

'use client';

import { Star, Cloud, CalendarDays, IndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/types';
import { formatINR } from './shared';

export function DestinationCard({
  destination,
  onCompare,
  onSelect,
  compareable = true,
}: {
  destination: Destination;
  onCompare?: (d: Destination) => void;
  onSelect?: (d: Destination) => void;
  compareable?: boolean;
}) {
  return (
    <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative h-52 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {destination.match}% Match
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-display text-xl font-semibold leading-tight">
            {destination.name}
          </h3>
          <p className="text-sm text-white/80">{destination.state}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <IndianRupee className="h-4 w-4" />
            {formatINR(destination.estimatedCost)}
          </span>
          <span className="flex items-center gap-1.5">
            <Cloud className="h-4 w-4" />
            {destination.temperature}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {destination.bestSeason}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-sunset">
            <Star className="h-4 w-4 fill-sunset" />
            {destination.rating}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Top activities
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {destination.activities.slice(0, 5).map((a) => (
              <Badge key={a} variant="secondary" className="font-normal">
                {a}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {compareable && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onCompare?.(destination)}
            >
              Compare
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onSelect?.(destination)}
          >
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
}

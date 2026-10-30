'use client';

import { CalendarDays, IndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/types';
import { formatINR } from './shared';
import { destinationImage } from './destinationImage';

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
          {...destinationImage(destination.slug, destination.name)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-display text-xl font-semibold leading-tight">
            {destination.name}
          </h3>
          <p className="text-sm text-white/80">{destination.state ?? 'India'}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <IndianRupee className="h-4 w-4" />
            {formatINR(destination.cost)}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {destination.bestSeason ?? 'Season unavailable'}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Tags
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {destination.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
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

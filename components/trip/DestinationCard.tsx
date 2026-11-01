'use client';

import { CalendarDays, IndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/types';
import { formatINR } from './shared';
import { destinationImage } from './destinationImage';
import { normalizeTags } from '@/lib/tags';

export interface DestinationFit {
  dateFits: boolean;
  budgetFits: boolean;
  overBudgetCount: number;
  memberCount: number;
  matchingTags: string[];
  chosenByOptimizer?: boolean;
  optimizerExplanation?: string | null;
}

export function DestinationCard({
  destination,
  onCompare,
  onSelect,
  compareable = true,
  fit,
}: {
  destination: Destination;
  onCompare?: (d: Destination) => void;
  onSelect?: (d: Destination) => void;
  compareable?: boolean;
  fit?: DestinationFit;
}) {
  const tags = normalizeTags(destination.tags);
  const statusClass = (state: 'green' | 'amber' | 'red') =>
    state === 'green'
      ? 'border-success/30 bg-success/10 text-success'
      : state === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-700'
        : 'border-destructive/30 bg-destructive/10 text-destructive';

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
            {tags.slice(0, 5).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`font-normal ${fit?.matchingTags.includes(tag) ? 'border-success/50 bg-success/15 text-success' : ''}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {fit && (
          <div className="space-y-2 text-sm">
            <div className={`rounded-md border px-3 py-2 ${statusClass(fit.dateFits ? 'green' : 'red')}`}>
              <p className="font-medium">
                {fit.dateFits ? 'Available for your dates' : `Outside its window (${destination.bestSeason ?? 'season unavailable'})`}
              </p>
              <p className="mt-0.5 text-xs">Season: {destination.bestSeason ?? 'Season unavailable'}.</p>
            </div>
            <div className={`rounded-md border px-3 py-2 ${statusClass(fit.budgetFits ? 'green' : 'red')}`}>
              <p className="font-medium">
                {fit.budgetFits
                  ? `Estimated ${formatINR(destination.cost)} per person, within everyone's limit`
                  : `Over budget for ${fit.overBudgetCount} of ${fit.memberCount} members`}
              </p>
              <p className="mt-0.5 text-xs">Based on the curated per-person estimate.</p>
            </div>
            <div className={`rounded-md border px-3 py-2 ${statusClass(fit.matchingTags.length > 0 ? 'green' : 'amber')}`}>
              <p className="font-medium">Matches {fit.matchingTags.length} of {fit.memberCount} members</p>
              <p className="mt-0.5 text-xs">Highlighted tags match group interests.</p>
            </div>
            {fit.chosenByOptimizer && (
              <div className="rounded-md border border-ocean/30 bg-ocean/10 px-3 py-2 text-xs text-ocean">
                <p className="font-medium">Chosen by optimizer</p>
                {fit.optimizerExplanation && <p className="mt-0.5">{fit.optimizerExplanation}</p>}
              </div>
            )}
          </div>
        )}

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

'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ItineraryDay, Activity } from '@/types';
import { ActivityCard } from './ActivityCard';
import { formatINR } from './shared';

export function ItineraryTimeline({
  day,
  onAddActivity,
  onEditActivity,
  onRemoveActivity,
}: {
  day: ItineraryDay;
  onAddActivity?: (day: number) => void;
  onEditActivity?: (day: number, a: Activity) => void;
  onRemoveActivity?: (day: number, a: Activity) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[39px] top-2 w-px bg-border" />
      <div className="space-y-3">
        {day.activities.map((a) => (
          <div key={a.id} className="relative pl-0">
            <span className="absolute left-[34px] top-5 z-10 h-3 w-3 rounded-full border-2 border-background bg-ocean" />
            <ActivityCard
              activity={a}
              onEdit={(act) => onEditActivity?.(day.day, act)}
              onRemove={(act) => onRemoveActivity?.(day.day, act)}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between pl-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddActivity?.(day.day)}
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
        <span className="text-sm text-muted-foreground">
          Day cost:{' '}
          <span className="font-semibold text-foreground">
            {formatINR(day.dailyCost)}
          </span>
        </span>
      </div>
    </div>
  );
}

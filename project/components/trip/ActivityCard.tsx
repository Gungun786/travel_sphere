'use client';

import { Clock, MapPin, Route, IndianRupee, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Activity } from '@/types';
import { CategoryBadge, formatINR } from './shared';

export function ActivityCard({
  activity,
  onEdit,
  onRemove,
}: {
  activity: Activity;
  onEdit?: (a: Activity) => void;
  onRemove?: (a: Activity) => void;
}) {
  return (
    <Card className="relative p-4 transition-shadow hover:shadow-soft">
      <div className="flex gap-4">
        <div className="flex w-20 shrink-0 flex-col items-start">
          <span className="font-mono text-sm font-semibold text-ocean">
            {activity.time}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {activity.place}
              </h4>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <CategoryBadge category={activity.category} />
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {activity.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Route className="h-3.5 w-3.5" />
                  {activity.distanceFromPrev}
                </span>
                {activity.cost > 0 && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {formatINR(activity.cost)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit?.(activity)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove?.(activity)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

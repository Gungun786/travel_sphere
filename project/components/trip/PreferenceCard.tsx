'use client';

import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PrefOption {
  label: string;
  icon?: string;
}

export function PreferenceCard({
  title,
  options,
  selected,
  onToggle,
  multi = true,
}: {
  title: string;
  options: PrefOption[];
  selected: string[];
  onToggle: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <Card className="p-5">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onToggle(opt.label)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
                active
                  ? 'border-ocean bg-ocean/10 text-ocean'
                  : 'border-border bg-background text-muted-foreground hover:border-ocean/40 hover:bg-muted'
              )}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      {!multi && (
        <p className="mt-2 text-xs text-muted-foreground">Select one</p>
      )}
    </Card>
  );
}

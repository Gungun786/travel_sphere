import { cn } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  Food: 'bg-sunset/15 text-sunset',
  Sightseeing: 'bg-ocean/15 text-ocean',
  Heritage: 'bg-chart-4/15 text-chart-4',
  Beach: 'bg-chart-2/15 text-chart-2',
  Wildlife: 'bg-success/15 text-success',
  Nature: 'bg-success/15 text-success',
  Culture: 'bg-chart-4/15 text-chart-4',
  Travel: 'bg-muted text-muted-foreground',
  Stay: 'bg-ocean/15 text-ocean',
  Shopping: 'bg-sunset/15 text-sunset',
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        categoryColors[category] ?? 'bg-muted text-muted-foreground'
      )}
    >
      {category}
    </span>
  );
}

export function formatINR(amount: number) {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameYear = s.getFullYear() === e.getFullYear();
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = s.toLocaleDateString('en-US', opts);
  const endStr = e.toLocaleDateString(
    'en-US',
    sameYear ? opts : { ...opts, year: 'numeric' }
  );
  return `${startStr} – ${endStr}`;
}

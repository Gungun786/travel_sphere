import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatINR } from './shared';

export function BudgetCard({
  label,
  spent,
  allocated,
}: {
  label: string;
  spent: number;
  allocated: number;
}) {
  const pct = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
  const over = spent > allocated;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`text-sm font-semibold ${
            over ? 'text-destructive' : 'text-foreground'
          }`}
        >
          {formatINR(spent)} / {formatINR(allocated)}
        </span>
      </div>
      <Progress
        value={pct}
        className={`mt-3 h-2 ${over ? '[&>div]:bg-destructive' : ''}`}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {over
          ? `${formatINR(spent - allocated)} over budget`
          : `${formatINR(allocated - spent)} remaining`}
      </p>
    </Card>
  );
}

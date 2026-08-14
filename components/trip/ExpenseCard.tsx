'use client';

import { Trash2, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Expense } from '@/types';
import { formatINR } from './shared';

const categoryIcon: Record<string, string> = {
  Food: '🍽️',
  Transport: '🚕',
  Stay: '🏨',
  Activities: '🎯',
  Shopping: '🛍️',
  Other: '📦',
};

export function ExpenseCard({
  expense,
  onRemove,
}: {
  expense: Expense;
  onRemove?: (id: string) => void;
}) {
  return (
    <Card className="flex items-center gap-4 p-4 transition-shadow hover:shadow-soft">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
        {categoryIcon[expense.category] ?? '📦'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate font-medium">{expense.name}</h4>
          <span className="shrink-0 font-semibold">{formatINR(expense.amount)}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Paid by {expense.paidBy}</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Split between {expense.splitBetween}
          </span>
          <span>{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove?.(expense.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}

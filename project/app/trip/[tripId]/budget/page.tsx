'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, IndianRupee } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { BudgetCard } from '@/components/trip/BudgetCard';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTripStore } from '@/store/tripStore';
import { formatINR } from '@/components/trip/shared';

const categoryColors: Record<string, string> = {
  Accommodation: 'hsl(199 89% 30%)',
  Transportation: 'hsl(173 58% 39%)',
  Food: 'hsl(43 74% 56%)',
  Activities: 'hsl(27 87% 60%)',
  Other: 'hsl(142 71% 45%)',
};

export default function Budget() {
  const getCurrentTrip = useTripStore((s) => s.getCurrentTrip);
  const budget = useTripStore((s) => s.budget);
  const trip = getCurrentTrip();

  const totalBudget = trip.budget;
  const estimated =
    budget.accommodation.spent +
    budget.transportation.spent +
    budget.food.spent +
    budget.activities.spent +
    budget.other.spent;
  const remaining = totalBudget - estimated;
  const perPerson = Math.round(totalBudget / Math.max(trip.travelers, 1));
  const overBudget = remaining < 0;

  const chartData = [
    { name: 'Accommodation', value: budget.accommodation.spent, color: categoryColors.Accommodation },
    { name: 'Transportation', value: budget.transportation.spent, color: categoryColors.Transportation },
    { name: 'Food', value: budget.food.spent, color: categoryColors.Food },
    { name: 'Activities', value: budget.activities.spent, color: categoryColors.Activities },
    { name: 'Other', value: budget.other.spent, color: categoryColors.Other },
  ];

  const topCards = [
    { label: 'Total Budget', value: formatINR(totalBudget), tint: 'bg-ocean/10 text-ocean' },
    { label: 'Estimated Cost', value: formatINR(estimated), tint: 'bg-chart-4/15 text-chart-4' },
    { label: 'Remaining', value: formatINR(Math.abs(remaining)), tint: overBudget ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success' },
    { label: 'Per Person', value: formatINR(perPerson), tint: 'bg-chart-2/15 text-chart-2' },
  ];

  return (
    <AppShell>
      <Header />
      <TripHero trip={trip} active="Budget" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-2xl font-bold tracking-tight">Budget</h1>
          <p className="mt-1 text-muted-foreground">Track your group spending and stay on plan.</p>

          {/* Top cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topCards.map((c) => (
              <Card key={c.label} className="p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}>
                  <IndianRupee className="h-5 w-5" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold">{c.value}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* Donut chart */}
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">Budget Allocation</h2>
              <p className="mt-1 text-sm text-muted-foreground">How your estimated cost is distributed.</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatINR(value)}
                      contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(214 32% 91%)', fontSize: '0.875rem' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Budget health */}
            <Card className="flex flex-col p-6">
              <h2 className="font-display text-lg font-semibold">Budget Health</h2>
              <div className={`mt-4 flex-1 rounded-xl p-5 ${overBudget ? 'bg-destructive/5' : 'bg-success/5'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${overBudget ? 'bg-destructive/15 text-destructive' : 'bg-success/15 text-success'}`}>
                  {overBudget ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                </div>
                <p className="mt-4 font-display text-lg font-semibold">
                  {overBudget
                    ? `You’re ${formatINR(Math.abs(remaining))} above your budget.`
                    : 'You’re within your planned budget.'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {overBudget
                    ? 'Consider adjusting activities or accommodation to stay on track.'
                    : `You have ${formatINR(remaining)} remaining for unexpected expenses.`}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estimated vs. Budget</span>
                  <span className="font-medium">{Math.round((estimated / totalBudget) * 100)}%</span>
                </div>
                <Progress
                  value={(estimated / totalBudget) * 100}
                  className={`mt-2 h-2 ${overBudget ? '[&>div]:bg-destructive' : ''}`}
                />
              </div>
            </Card>
          </div>

          {/* Breakdown */}
          <Card className="mt-6 p-6">
            <h2 className="font-display text-lg font-semibold">Budget Breakdown</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <BudgetCard label="Accommodation" spent={budget.accommodation.spent} allocated={budget.accommodation.allocated} />
              <BudgetCard label="Transportation" spent={budget.transportation.spent} allocated={budget.transportation.allocated} />
              <BudgetCard label="Food" spent={budget.food.spent} allocated={budget.food.allocated} />
              <BudgetCard label="Activities" spent={budget.activities.spent} allocated={budget.activities.allocated} />
            </div>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}

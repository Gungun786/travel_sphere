'use client';

import { useState } from 'react';
import { Plus, ArrowRight, Check } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { ExpenseCard } from '@/components/trip/ExpenseCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTripStore } from '@/store/tripStore';
import { mockSettlements } from '@/data/mockTripData';
import { toast } from 'sonner';
import { formatINR } from '@/components/trip/shared';
import type { Expense } from '@/types';

const categories = ['Food', 'Transport', 'Stay', 'Activities', 'Shopping', 'Other'];

export default function Expenses() {
  const getCurrentTrip = useTripStore((s) => s.getCurrentTrip);
  const expenses = useTripStore((s) => s.expenses);
  const addExpense = useTripStore((s) => s.addExpense);
  const removeExpense = useTripStore((s) => s.removeExpense);
  const trip = getCurrentTrip();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: 0,
    category: 'Food',
    paidBy: trip.members[0]?.name ?? 'Gungun',
    splitBetween: trip.members.length,
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [settlements, setSettlements] = useState(mockSettlements);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const yourShare = expenses
    .filter((e) => e.paidBy === 'Gungun')
    .reduce((sum, e) => sum + e.amount, 0);
  const groupShare = totalSpent - yourShare;
  const pending = settlements.filter((s) => !s.settled).length;

  const stats = [
    { label: 'Total Spent', value: formatINR(totalSpent), tint: 'bg-ocean/10 text-ocean' },
    { label: 'Your Spending', value: formatINR(yourShare), tint: 'bg-chart-4/15 text-chart-4' },
    { label: 'Group Spending', value: formatINR(groupShare), tint: 'bg-chart-2/15 text-chart-2' },
    { label: 'Pending Settlements', value: `${pending}`, tint: 'bg-sunset/15 text-sunset' },
  ];

  const handleAdd = () => {
    if (!form.name || form.amount <= 0) {
      toast.error('Enter an expense name and amount.');
      return;
    }
    const e: Expense = {
      id: 'e' + Date.now(),
      name: form.name,
      amount: Number(form.amount),
      category: form.category,
      paidBy: form.paidBy,
      splitBetween: Number(form.splitBetween) || trip.members.length,
      date: form.date,
      notes: form.notes || undefined,
    };
    addExpense(e);
    toast.success('Expense added.');
    setOpen(false);
    setForm({ ...form, name: '', amount: 0, notes: '' });
  };

  const settle = (id: string) => {
    setSettlements((ss) => ss.map((s) => (s.id === id ? { ...s, settled: true } : s)));
    toast.success('Marked as settled.');
  };

  return (
    <AppShell>
      <Header />
      <TripHero trip={trip} active="Expenses" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Shared Expenses</h1>
              <p className="mt-1 text-muted-foreground">Track who paid and who owes what.</p>
            </div>
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((c) => (
              <Card key={c.label} className="p-5">
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-display text-2xl font-bold">{c.value}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
            {/* Expense list */}
            <div>
              <h2 className="font-display text-lg font-semibold">All Expenses</h2>
              {expenses.length === 0 ? (
                <Card className="mt-3 border-dashed py-16 text-center">
                  <p className="text-muted-foreground">No expenses added yet.</p>
                  <Button className="mt-4 gap-2" onClick={() => setOpen(true)}>
                    <Plus className="h-4 w-4" /> Add your first expense
                  </Button>
                </Card>
              ) : (
                <div className="mt-3 space-y-3">
                  {expenses.map((e) => (
                    <ExpenseCard key={e.id} expense={e} onRemove={(id) => { removeExpense(id); toast.success('Expense removed.'); }} />
                  ))}
                </div>
              )}
            </div>

            {/* Settlements */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Card className="p-5">
                <h2 className="font-display text-lg font-semibold">Who owes whom?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Simplify your group settlements.</p>
                <div className="mt-4 space-y-3">
                  {settlements.length === 0 && (
                    <p className="text-sm text-muted-foreground">All settled up!</p>
                  )}
                  {settlements.map((s) => (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between rounded-xl border p-3 ${
                        s.settled ? 'border-success/30 bg-success/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{s.from}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{s.to}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatINR(s.amount)}</span>
                        {s.settled ? (
                          <Badge variant="secondary" className="gap-1 bg-success/15 text-success">
                            <Check className="h-3 w-3" /> Settled
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => settle(s.id)}>
                            Mark as Settled
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Add expense dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Expense name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dinner at Oceanos" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Amount (₹)</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ocean">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Paid by</Label>
                <select value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ocean">
                  {trip.members.map((m) => <option key={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Split between</Label>
                <Input type="number" min={1} max={trip.members.length} value={form.splitBetween} onChange={(e) => setForm({ ...form, splitBetween: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any extra details" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

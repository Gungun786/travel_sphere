'use client';

import { useState } from 'react';
import { RefreshCw, Map as MapIcon, Plus, X, Pencil } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { ItineraryTimeline } from '@/components/trip/ItineraryTimeline';
import { GroupApproval } from '@/components/trip/GroupApproval';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTripStore } from '@/store/tripStore';
import { toast } from 'sonner';
import { formatINR } from '@/components/trip/shared';
import type { Activity } from '@/types';

export default function Itinerary() {
  const getCurrentTrip = useTripStore((s) => s.getCurrentTrip);
  const itinerary = useTripStore((s) => s.itinerary);
  const addItineraryActivity = useTripStore((s) => s.addItineraryActivity);
  const removeItineraryActivity = useTripStore((s) => s.removeItineraryActivity);
  const trip = getCurrentTrip();

  const [activeDay, setActiveDay] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [form, setForm] = useState({ time: '10:00 AM', place: '', category: 'Sightseeing', duration: '1 hr', cost: 0 });

  const day = itinerary.find((d) => d.day === activeDay)!;
  const totalCost = itinerary.reduce((sum, d) => sum + d.dailyCost, 0);

  const openAdd = () => {
    setEditActivity(null);
    setForm({ time: '10:00 AM', place: '', category: 'Sightseeing', duration: '1 hr', cost: 0 });
    setAddOpen(true);
  };

  const openEdit = (d: number, a: Activity) => {
    setEditActivity(a);
    setForm({ time: a.time, place: a.place, category: a.category, duration: a.duration, cost: a.cost });
    setAddOpen(true);
  };

  const saveActivity = () => {
    if (!form.place) {
      toast.error('Please enter a place name.');
      return;
    }
    if (editActivity) {
      // For simplicity, remove + re-add (mock editing)
      removeItineraryActivity(activeDay, editActivity.id);
    }
    const newActivity: Activity = {
      id: 'act-' + Date.now(),
      time: form.time,
      place: form.place,
      category: form.category,
      duration: form.duration,
      cost: Number(form.cost) || 0,
      distanceFromPrev: '—',
    };
    addItineraryActivity(activeDay, newActivity);
    toast.success(editActivity ? 'Activity updated.' : 'Activity added to your day.');
    setAddOpen(false);
  };

  return (
    <AppShell>
      <Header />
      <TripHero trip={trip} active="Itinerary" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Your {trip.destinationName} Itinerary</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{trip.days} Days</span>
                <span>·</span>
                <span>{trip.travelers} Travelers</span>
                <span>·</span>
                <span className="font-medium text-foreground">{formatINR(totalCost)} estimated</span>
              </div>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => toast.success('Day plan refreshed.')}>
              <RefreshCw className="h-4 w-4" /> Regenerate Day Plan
            </Button>
          </div>

          {/* Day selector */}
          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
            {itinerary.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`flex min-w-[88px] flex-col items-center rounded-xl border px-4 py-3 transition-all ${
                  activeDay === d.day
                    ? 'border-ocean bg-ocean text-white'
                    : 'border-border bg-card text-muted-foreground hover:border-ocean/40 hover:bg-muted'
                }`}
              >
                <span className="text-xs font-medium">Day</span>
                <span className="font-display text-lg font-bold leading-none">{d.day}</span>
                <span className="mt-1 max-w-[80px] truncate text-[11px] opacity-80">{d.title.split('·')[0]}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Timeline */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">{day.title}</h2>
                  <p className="text-sm text-muted-foreground">Day {day.day} of {itinerary.length}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={openAdd}>
                  <Plus className="h-3.5 w-3.5" /> Add Activity
                </Button>
              </div>
              <ItineraryTimeline
                day={day}
                onAddActivity={openAdd}
                onEditActivity={openEdit}
                onRemoveActivity={(d, a) => { removeItineraryActivity(d, a.id); toast.success('Activity removed.'); }}
              />
            </div>

            {/* Map placeholder */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <Card className="overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h3 className="flex items-center gap-2 font-medium">
                    <MapIcon className="h-4 w-4 text-ocean" /> Route Map
                  </h3>
                  <Button size="sm" variant="ghost" className="text-ocean">View on Map</Button>
                </div>
                <div className="relative h-80 bg-muted">
                  {/* Stylized map mock */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(199_89%_90%),transparent_50%),radial-gradient(circle_at_70%_60%,hsl(173_58%_85%),transparent_50%)]" />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 320" fill="none">
                    <path d="M40 250 Q90 180 140 200 T240 120 T280 60" stroke="hsl(199 89% 30%)" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                    {[
                      { x: 40, y: 250, label: '1' },
                      { x: 140, y: 200, label: '2' },
                      { x: 240, y: 120, label: '3' },
                      { x: 280, y: 60, label: '4' },
                    ].map((p) => (
                      <g key={p.label}>
                        <circle cx={p.x} cy={p.y} r="10" fill="white" stroke="hsl(199 89% 30%)" strokeWidth="2" />
                        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="hsl(199 89% 30%)">{p.label}</text>
                      </g>
                    ))}
                  </svg>
                  <div className="absolute bottom-3 left-3 rounded-lg bg-background/90 px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
                    Day {day.day} route · {day.activities.length} stops
                  </div>
                </div>
              </Card>

              <Card className="mt-4 p-4">
                <h3 className="text-sm font-semibold">Daily Cost</h3>
                <p className="mt-1 font-display text-2xl font-bold">{formatINR(day.dailyCost)}</p>
                <p className="text-xs text-muted-foreground">Across {day.activities.length} activities</p>
              </Card>
            </div>
          </div>

          {/* Group Approval Section */}
          <GroupApproval trip={trip} />
        </div>
      </main>

      {/* Add/Edit activity dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editActivity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM" />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ocean">
                  {['Food', 'Sightseeing', 'Heritage', 'Beach', 'Wildlife', 'Nature', 'Culture', 'Travel', 'Stay', 'Shopping'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Place</Label>
              <Input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="e.g. Fort Kochi Walk" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1 hr" />
              </div>
              <div className="space-y-1.5">
                <Label>Estimated cost (₹)</Label>
                <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} placeholder="0" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={saveActivity}>{editActivity ? 'Save changes' : 'Add Activity'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

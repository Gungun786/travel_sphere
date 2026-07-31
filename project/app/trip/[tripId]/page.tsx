'use client';

import Link from 'next/link';
import {
  Users,
  CalendarDays,
  Wallet,
  Compass,
  CheckCircle2,
  Circle,
  MapPin,
  ArrowRight,
  Star,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTripStore } from '@/store/tripStore';
import { mockDestinations } from '@/data/mockDestinations';
import { formatINR, formatDateRange } from '@/components/trip/shared';

const progressItems = [
  { label: 'Preferences completed', done: true, pct: 100 },
  { label: 'Destination selected', done: true, pct: 100 },
  { label: 'Itinerary ready', done: false, pct: 60 },
  { label: 'Budget planned', done: true, pct: 100 },
];

const quickInfo = [
  { icon: Users, label: 'Travelers', value: '5' },
  { icon: CalendarDays, label: 'Duration', value: '4 days' },
  { icon: Wallet, label: 'Budget', value: '₹50,000' },
  { icon: Compass, label: 'Travel style', value: 'Nature' },
];

export default function TripOverview() {
  const getCurrentTrip = useTripStore((s) => s.getCurrentTrip);
  const trip = getCurrentTrip();

  return (
    <AppShell>
      <Header />
      <TripHero trip={trip} active="Overview" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          {/* Trip progress */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Trip Progress</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {progressItems.map((p) => (
                <div key={p.label} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {p.done ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{p.label}</span>
                  </div>
                  <Progress value={p.pct} className="h-1.5" />
                </div>
              ))}
            </div>
          </Card>

          {/* Quick info */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickInfo.map((q) => {
              const Icon = q.icon;
              return (
                <Card key={q.label} className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{q.label}</p>
                    <p className="font-semibold">{q.value}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {/* Destination */}
            <Card className="overflow-hidden p-0 lg:col-span-2">
              <div className="relative h-48">
                <img src={trip.image} alt={trip.destinationName} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm text-white/70">Destination</p>
                  <h3 className="font-display text-xl font-semibold">{trip.destinationName}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground">
                  Your group’s selected destination. Explore alternatives or lock in your choice.
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/trip/${trip.id}/destination`}>
                    <Button size="sm" variant="outline">Compare destinations</Button>
                  </Link>
                  <Link href={`/trip/${trip.id}/itinerary`}>
                    <Button size="sm" className="gap-1.5">View itinerary <ArrowRight className="h-3.5 w-3.5" /></Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Group overview */}
            <Card className="p-5">
              <h3 className="font-display text-lg font-semibold">Group Overview</h3>
              <p className="mt-1 text-sm text-muted-foreground">{trip.members.length} travelers</p>
              <div className="mt-4 flex -space-x-2">
                {trip.members.map((m) => (
                  <Avatar key={m.id} className="h-10 w-10 border-2 border-background">
                    <AvatarFallback className={m.avatarColor}>{m.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {trip.members.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span>{m.name}</span>
                    <span className="text-muted-foreground">{m.travelStyle}</span>
                  </div>
                ))}
              </div>
              <Link href={`/trip/${trip.id}/group`} className="mt-4 block">
                <Button variant="ghost" size="sm" className="w-full gap-1.5 text-ocean">
                  View group preferences <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          </div>

          {/* Upcoming schedule + budget summary */}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Upcoming Schedule</h3>
                <Link href={`/trip/${trip.id}/itinerary`}>
                  <Button variant="ghost" size="sm" className="text-ocean">View all</Button>
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { day: 'Day 1', title: 'Arrival · Fort Kochi', time: '08:00 AM' },
                  { day: 'Day 2', title: 'Munnar Tea Hills', time: '07:00 AM' },
                  { day: 'Day 3', title: 'Alleppey Backwaters', time: '07:30 AM' },
                ].map((s) => (
                  <div key={s.day} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-ocean/10 text-ocean">
                      <span className="text-[10px] font-medium">DAY</span>
                      <span className="text-sm font-bold leading-none">{s.day.slice(4)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">Starts {s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Budget Summary</h3>
                <Link href={`/trip/${trip.id}/budget`}>
                  <Button variant="ghost" size="sm" className="text-ocean">Details</Button>
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total budget</span>
                  <span className="font-semibold">{formatINR(trip.budget)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated cost</span>
                  <span className="font-semibold">{formatINR(46800)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-success">{formatINR(3200)}</span>
                </div>
                <Progress value={94} className="h-2" />
                <p className="flex items-center gap-1.5 text-sm text-success">
                  <TrendingUp className="h-4 w-4" /> You’re within your planned budget.
                </p>
              </div>
            </Card>
          </div>

          {/* Top places */}
          <Card className="mt-5 p-5">
            <h3 className="font-display text-lg font-semibold">Top Places in {trip.destinationName}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockDestinations[0].activities.slice(0, 3).map((a, i) => (
                <div key={a} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-ocean" />
                  <div>
                    <p className="text-sm font-medium">{a}</p>
                    <p className="text-xs text-muted-foreground">Highly rated by travelers</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card className="mt-5 p-5">
            <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              {[
                { who: 'Gungun', what: 'added an expense', detail: 'Dinner at Oceanos · ₹2,500', when: '2h ago' },
                { who: 'Kanak', what: 'updated preferences', detail: 'Added Photography to interests', when: '5h ago' },
                { who: 'Divya', what: 'booked accommodation', detail: 'Hotel confirmed for 2 nights', when: '1d ago' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {a.who.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-medium">{a.who}</span> {a.what}</p>
                    <p className="text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.when}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}

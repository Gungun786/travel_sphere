'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  MapPin,
  Users,
  Wallet,
  CalendarClock,
  ArrowRight,
  Star,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripCard } from '@/components/trip/TripCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { useTripStore } from '@/store/tripStore';
import { mockDestinations } from '@/data/mockDestinations';
import { formatINR } from '@/components/trip/shared';

const stats = [
  { label: 'Active Trips', value: '2', icon: CalendarClock, tint: 'bg-ocean/10 text-ocean' },
  { label: 'Upcoming Trips', value: '3', icon: MapPin, tint: 'bg-sunset/15 text-sunset' },
  { label: 'Group Members', value: '12', icon: Users, tint: 'bg-success/15 text-success' },
  { label: 'Total Planned Budget', value: '₹1.5L', icon: Wallet, tint: 'bg-chart-4/15 text-chart-4' },
];

export default function Dashboard() {
  const user = useUserStore((s) => s.user);
  const trips = useTripStore((s) => s.trips);
  const [tab, setTab] = useState<'overview' | 'trips' | 'explore'>('overview');

  return (
    <AppShell>
      <Header />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        {/* Greeting */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Good morning, {user?.name} 👋
            </h1>
            <p className="mt-1 text-muted-foreground">Ready to plan your next adventure?</p>
          </div>
          <Link href="/create-trip">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Trip
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-1 border-b border-border">
          {([
            ['overview', 'Overview'],
            ['trips', 'My Trips'],
            ['explore', 'Explore'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === k
                  ? 'border-ocean text-ocean'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            {/* Upcoming trips */}
            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Upcoming Trips</h2>
                <button onClick={() => setTab('trips')} className="text-sm text-ocean hover:underline">
                  View all
                </button>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {trips.slice(0, 3).map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            </section>

            {/* Recommended */}
            <section className="mt-12">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Recommended for You</h2>
                <button onClick={() => setTab('explore')} className="text-sm text-ocean hover:underline">
                  Explore more
                </button>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {mockDestinations.slice(0, 3).map((d) => (
                  <Card key={d.id} className="group overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                    <div className="relative h-48 overflow-hidden">
                      <img src={d.image} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-semibold text-white">
                        {d.match}% Match
                      </span>
                      <div className="absolute bottom-3 left-4 text-white">
                        <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                        <p className="text-sm text-white/80">{formatINR(d.estimatedCost)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-sunset text-sunset" />
                        {d.rating} · {d.temperature}
                      </span>
                      <Link href="/create-trip">
                        <Button size="sm" variant="ghost" className="gap-1 text-ocean">
                          Plan here <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === 'trips' && (
          <section className="mt-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
            {trips.length === 0 && (
              <div className="rounded-xl border border-dashed border-border py-16 text-center">
                <p className="text-muted-foreground">No trips yet. Create your first trip to get started.</p>
              </div>
            )}
          </section>
        )}

        {tab === 'explore' && (
          <section className="mt-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mockDestinations.map((d) => (
                <Card key={d.id} className="group overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                  <div className="relative h-52 overflow-hidden">
                    <img src={d.image} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ocean px-2.5 py-1 text-xs font-semibold text-white">
                      {d.match}% Match
                    </span>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                      <p className="text-sm text-white/80">{d.state}</p>
                    </div>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{formatINR(d.estimatedCost)}</span>
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-sunset text-sunset" />{d.rating}</span>
                    </div>
                    <Link href="/create-trip">
                      <Button size="sm" className="w-full">Plan a trip here</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </AppShell>
  );
}

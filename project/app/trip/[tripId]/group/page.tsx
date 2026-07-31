'use client';

import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Heart } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { MemberCard } from '@/components/trip/MemberCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripStore } from '@/store/tripStore';
import { mockDestinations } from '@/data/mockDestinations';
import { formatINR } from '@/components/trip/shared';

export default function GroupPreferences() {
  const getCurrentTrip = useTripStore((s) => s.getCurrentTrip);
  const trip = getCurrentTrip();
  const members = trip.members;

  // Aggregate interests
  const interestCounts: Record<string, number> = {};
  members.forEach((m) => m.interests.forEach((i) => { interestCounts[i] = (interestCounts[i] || 0) + 1; }));
  const sortedInterests = Object.entries(interestCounts).sort((a, b) => b[1] - a[1]);
  const common = sortedInterests.filter(([, c]) => c >= 3);
  const partial = sortedInterests.filter(([, c]) => c === 2);

  const comparisons = [
    { label: 'Beach vs Mountains', a: 'Beach', b: 'Mountains', aCount: members.filter((m) => m.interests.includes('Beaches')).length, bCount: members.filter((m) => m.interests.includes('Mountains')).length },
    { label: 'Nightlife vs Relaxation', a: 'Nightlife', b: 'Relaxation', aCount: members.filter((m) => m.travelStyle === 'Nightlife').length, bCount: members.filter((m) => m.travelStyle === 'Relaxed').length },
    { label: 'Adventure vs Leisure', a: 'Adventure', b: 'Leisure', aCount: members.filter((m) => m.travelStyle === 'Adventure').length, bCount: members.filter((m) => m.travelStyle === 'Relaxed' || m.travelStyle === 'Luxury').length },
  ];

  const bestMatch = mockDestinations[0];

  return (
    <AppShell>
      <Header />
      <TripHero trip={trip} active="Group" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Your Group</h1>
            <p className="mt-1 text-muted-foreground">See what everyone wants from this trip.</p>
          </div>

          {/* Member cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>

          {/* Group overview visualization */}
          <Card className="mt-8 p-6">
            <h2 className="font-display text-xl font-semibold">Group Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">Where your group agrees and where you differ.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Common preferences */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-success">
                  <Check className="h-4 w-4" /> Common preferences
                </h3>
                <div className="mt-3 space-y-3">
                  {common.length === 0 && <p className="text-sm text-muted-foreground">No shared interests across the whole group yet.</p>}
                  {common.map(([label, count]) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">{count}/{members.length} travelers</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-success" style={{ width: `${(count / members.length) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  {partial.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Also popular</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {partial.map(([label]) => (
                          <Badge key={label} variant="secondary" className="font-normal">{label}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Different preferences */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-sunset">
                  <Heart className="h-4 w-4" /> Different preferences
                </h3>
                <div className="mt-3 space-y-4">
                  {comparisons.map((c) => {
                    const total = c.aCount + c.bCount || 1;
                    const aPct = (c.aCount / total) * 100;
                    return (
                      <div key={c.label}>
                        <p className="text-sm font-medium">{c.label}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="w-20 text-right text-xs text-muted-foreground">{c.a} ({c.aCount})</span>
                          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="absolute left-0 top-0 h-full bg-ocean" style={{ width: `${aPct}%` }} />
                            <div className="absolute right-0 top-0 h-full bg-sunset" style={{ width: `${100 - aPct}%` }} />
                          </div>
                          <span className="w-20 text-xs text-muted-foreground">({c.bCount}) {c.b}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Best match */}
          <Card className="mt-8 overflow-hidden p-0">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img src={bestMatch.image} alt={bestMatch.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-ocean px-3 py-1 text-xs font-semibold text-white">
                  <Sparkles className="h-3.5 w-3.5" /> Best Match
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold">{bestMatch.name}</h2>
                <p className="mt-1 text-muted-foreground">{bestMatch.state}</p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  Strong match for your group’s interests, budget, preferred activities, and travel style. {bestMatch.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bestMatch.activities.map((a) => (
                    <Badge key={a} variant="secondary" className="font-normal">{a}</Badge>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatINR(bestMatch.estimatedCost)} estimated</span>
                  <span>·</span>
                  <span>{bestMatch.temperature}</span>
                  <span>·</span>
                  <span>{bestMatch.match}% match</span>
                </div>
                <div className="mt-6 flex gap-2">
                  <Link href={`/trip/${trip.id}/destination`}>
                    <Button variant="outline">Compare Destinations</Button>
                  </Link>
                  <Button className="gap-1.5">Choose Destination <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}

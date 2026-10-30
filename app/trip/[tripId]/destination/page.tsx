'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { X, Check, GitCompare } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { DestinationCard } from '@/components/trip/DestinationCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripStore } from '@/store/tripStore';
import type { Destination } from '@/types';
import { toast } from 'sonner';
import { formatINR } from '@/components/trip/shared';
import { usePersistedTrip } from '@/components/trip/persisted';
import { listDestinations, optimizeTrip, updateTrip, type OptimizeResult } from '@/lib/api';
import { apiDestinationToDestination } from '@/lib/destinations';
import { destinationImage } from '@/components/trip/destinationImage';

const filters = [
  { key: 'budget', label: 'Budget', options: ['Any', 'Budget', 'Mid-range', 'Premium'] },
  { key: 'style', label: 'Tag', options: ['Any', 'Nature', 'Adventure', 'Cultural', 'Relaxed'] },
  { key: 'season', label: 'Best season', options: ['Any', 'Winter', 'Summer', 'Monsoon'] },
];

const compareMetrics = [
  { key: 'budget', label: 'Estimated cost', getVal: (d: Destination) => formatINR(d.cost), max: 70000, getNum: (d: Destination) => d.cost },
  { key: 'season', label: 'Best season', getVal: (d: Destination) => d.bestSeason ?? 'Unavailable', max: 1, getNum: () => 1 },
  { key: 'places', label: 'Top places', getVal: (d: Destination) => `${d.topPlaces.length} places`, max: 5, getNum: (d: Destination) => d.topPlaces.length },
  { key: 'tags', label: 'Tags', getVal: (d: Destination) => d.tags.slice(0, 3).join(', '), max: 3, getNum: (d: Destination) => Math.min(d.tags.length, 3) },
];

export default function DestinationRecommendation() {
  const selectDestination = useTripStore((s) => s.selectDestination);
  const params = useParams<{ tripId: string }>();
  const { trip, loading, error } = usePersistedTrip(params.tripId);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    if (!/^[1-9]\d*$/.test(params.tripId)) {
      return;
    }
    listDestinations()
      .then((items) => setDestinations(items.map(apiDestinationToDestination)))
      .catch(() => setDestinations([]));
  }, [params.tripId]);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map((f) => [f.key, 'Any']))
  );
  const [compareList, setCompareList] = useState<Destination[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [vetoedDestinations, setVetoedDestinations] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<OptimizeResult | null>(null);
  const [vetoingTravelerId, setVetoingTravelerId] = useState<string | null>(null);

  if (loading) return <PageMessage message="Loading trip…" />;
  if (error || !trip) return <PageMessage message={error?.message ?? 'Trip not found.'} />;

  const suggestedDestination = suggestion ? suggestion.chosen : trip.destinationName;
  const suggestedDestinationData = destinations.find(
    (destination) => destination.name === suggestedDestination
  );

  const toDayNumber = (value: string): number => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    return Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;
  };

  const vetoDestination = async (travelerId: string) => {
    if (!suggestedDestination || suggestedDestination === 'To be decided') return;

    const nextVetoes = [...vetoedDestinations, suggestedDestination];
    setVetoingTravelerId(travelerId);
    try {
      const nextResult = await optimizeTrip({
        travelers: Object.fromEntries(
          trip.members.map((member) => [
            member.name,
            {
              budget_max: member.budgetPerPerson,
              date_start: toDayNumber(trip.startDate),
              date_end: toDayNumber(trip.endDate),
              interests: member.interests,
            },
          ])
        ),
        vetoedDestinations: nextVetoes,
      });
      await updateTrip(params.tripId, { optimizer_result: nextResult });
      setVetoedDestinations(nextVetoes);
      setSuggestion(nextResult);
      if (!nextResult.chosen) {
        toast.info('There are no remaining destinations that fit your group.');
      }
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Could not veto this destination.');
    } finally {
      setVetoingTravelerId(null);
    }
  };

  const toggleCompare = (d: Destination) => {
    setCompareList((list) => {
      if (list.some((x) => x.id === d.id)) return list.filter((x) => x.id !== d.id);
      if (list.length >= 3) {
        toast.info('You can compare up to 3 destinations.');
        return list;
      }
      return [...list, d];
    });
  };

  const onSelect = (d: Destination) => {
    selectDestination(d.id, d.name, d.image, d.cost);
    toast.success(`${d.name} selected as your destination.`);
  };

  return (
    <AppShell>
      <Header />
      <TripHero trip={trip} active="Destination" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Find Your Perfect Destination</h1>
            <p className="mt-1 text-muted-foreground">Filter and compare destinations tailored to your group.</p>
          </div>

          {trip.decideLater && suggestedDestinationData && (
            <Card className="mt-6 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <img
                  {...destinationImage(suggestedDestinationData.slug, suggestedDestinationData.name)}
                  className="h-28 w-full rounded-lg object-cover sm:w-44"
                />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested destination</p>
                  <h2 className="mt-1 font-display text-xl font-semibold">{suggestedDestinationData.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trip.members.map((member) => (
                      <Button
                        key={member.id}
                        variant="outline"
                        size="sm"
                        onClick={() => vetoDestination(member.id)}
                        disabled={vetoingTravelerId !== null}
                      >
                        Veto for {member.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Filters */}
          <Card className="mt-6 p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filters.map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.label}</label>
                  <select
                    value={selectedFilters[f.key]}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, [f.key]: e.target.value })}
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ocean"
                  >
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </Card>

          {/* Compare bar */}
          {compareList.length > 0 && (
            <div className="sticky top-16 z-20 mt-4 flex items-center gap-3 rounded-xl border border-ocean/30 bg-ocean/5 p-3 backdrop-blur-md">
              <span className="text-sm font-medium">{compareList.length} selected to compare</span>
              <div className="flex flex-1 flex-wrap gap-2">
                {compareList.map((d) => (
                  <Badge key={d.id} variant="secondary" className="gap-1">{d.name}
                    <button onClick={() => toggleCompare(d)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => setShowCompare(true)} disabled={compareList.length < 2}>
                <GitCompare className="h-3.5 w-3.5" /> Compare
              </Button>
            </div>
          )}

          {/* Destination grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                onCompare={toggleCompare}
                onSelect={onSelect}
              />
            ))}
          </div>
          <div className="mt-8 space-y-6">
            {Array.from(
              new Set(destinations.flatMap((destination) => destination.places.map((place) => place.category)))
            ).map((category) => {
              const places = destinations.flatMap((destination) =>
                destination.places
                  .filter((place) => place.category === category)
                  .map((place) => ({ ...place, destinationName: destination.name }))
              );
              return (
                <section key={category}>
                  <h2 className="font-display text-xl font-semibold">{category}</h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {places.map((place) => (
                      <Card key={`${place.destinationName}-${place.id}`} className="p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{place.destinationName}</p>
                        <h3 className="mt-1 font-semibold">{place.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{place.description}</p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {place.avgHours} hours · {formatINR(place.entryCost)} entry
                        </p>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      {/* Compare modal */}
      {showCompare && compareList.length >= 2 && (
        <CompareModal destinations={compareList} onClose={() => setShowCompare(false)} onSelect={onSelect} />
      )}
    </AppShell>
  );
}

function PageMessage({ message }: { message: string }) {
  return (
    <AppShell>
      <Header />
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">{message}</p>
      </main>
    </AppShell>
  );
}

function CompareModal({ destinations, onClose, onSelect }: { destinations: Destination[]; onClose: () => void; onSelect: (d: Destination) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-soft-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Compare Destinations</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="w-40 p-3 text-left text-muted-foreground">Metric</th>
                {destinations.map((d) => (
                  <th key={d.id} className="p-3 text-left">
                    <div className="flex items-center gap-2">
                      <img {...destinationImage(d.slug, d.name)} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-display font-semibold">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.bestSeason ?? 'Season unavailable'}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareMetrics.map((m) => (
                <tr key={m.key} className="border-t border-border">
                  <td className="p-3 font-medium text-muted-foreground">{m.label}</td>
                  {destinations.map((d) => {
                    const num = m.getNum(d);
                    const pct = Math.min((num / m.max) * 100, 100);
                    return (
                      <td key={d.id} className="p-3">
                        <p className="font-medium">{m.getVal(d)}</p>
                        <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted">
                          <div className="h-1.5 rounded-full bg-ocean" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-border">
                <td className="p-3" />
                {destinations.map((d) => (
                  <td key={d.id} className="p-3">
                    <Button size="sm" className="w-full gap-1.5" onClick={() => { onSelect(d); onClose(); }}>
                      <Check className="h-3.5 w-3.5" /> Select
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

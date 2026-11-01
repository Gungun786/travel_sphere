'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { X, Check, GitCompare } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { DestinationCard, type DestinationFit } from '@/components/trip/DestinationCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripStore } from '@/store/tripStore';
import type { Destination } from '@/types';
import { toast } from 'sonner';
import { formatINR } from '@/components/trip/shared';
import { usePersistedTrip } from '@/components/trip/persisted';
import { getCompare, listDestinations, optimizeTrip, updateTrip, type OptimizeResult } from '@/lib/api';
import { apiDestinationToDestination } from '@/lib/destinations';
import { destinationImage } from '@/components/trip/destinationImage';
import { dayOfYear, rangesOverlap } from '@/lib/dates';
import { normalizeTags } from '@/lib/tags';
import type { CompareDestinationFacts, CompareResult } from '@/lib/api';

const filters = [
  { key: 'budget', label: 'Budget', options: ['Any', 'Budget', 'Mid-range', 'Premium'] },
  { key: 'style', label: 'Tag', options: ['Any', 'Nature', 'Adventure', 'Cultural', 'Relaxed'] },
  { key: 'season', label: 'Best season', options: ['Any', 'Winter', 'Summer', 'Monsoon'] },
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

  useEffect(() => {
    fetch('/destinations/credits.json')
      .then((response) => (response.ok ? response.json() : {}))
      .then((credits: Record<string, { author?: string; license?: string }>) =>
        setPhotoCredits(credits)
      )
      .catch(() => setPhotoCredits({}));
  }, []);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map((f) => [f.key, 'Any']))
  );
  const [compareList, setCompareList] = useState<Destination[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareExplaining, setCompareExplaining] = useState(false);
  const [photoCredits, setPhotoCredits] = useState<Record<string, { author?: string; license?: string }>>({});
  const [vetoedDestinations, setVetoedDestinations] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<OptimizeResult | null>(null);
  const [vetoingTravelerId, setVetoingTravelerId] = useState<string | null>(null);

  if (loading) return <PageMessage message="Loading trip…" />;
  if (error || !trip) return <PageMessage message={error?.message ?? 'Trip not found.'} />;

  const suggestedDestination = suggestion ? suggestion.chosen : trip.destinationName;
  const suggestedDestinationData = destinations.find(
    (destination) => destination.name === suggestedDestination
  );

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
              date_start: dayOfYear(trip.startDate),
              date_end: dayOfYear(trip.endDate),
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

  const openCompare = async () => {
    setShowCompare(true);
    setCompareResult(null);
    setCompareLoading(true);
    try {
      setCompareResult(await getCompare(params.tripId, {
        slugs: compareList.map((destination) => destination.slug),
        explain: false,
      }));
    } catch (reason) {
      setShowCompare(false);
      toast.error(reason instanceof Error ? reason.message : 'Could not load comparison.');
    } finally {
      setCompareLoading(false);
    }
  };

  const explainCompare = async () => {
    setCompareExplaining(true);
    try {
      setCompareResult(await getCompare(params.tripId, {
        slugs: compareList.map((destination) => destination.slug),
        explain: true,
      }));
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Could not explain comparison.');
    } finally {
      setCompareExplaining(false);
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

  const tripStart = dayOfYear(trip.startDate);
  const tripEnd = dayOfYear(trip.endDate);
  const destinationsWithFit = destinations.map((destination) => {
    const tags = normalizeTags(destination.tags);
    const matchingTags = tags.filter((tag) =>
      trip.members.some((member) =>
        member.interests.some((interest) => interest.toLowerCase() === tag.toLowerCase())
      )
    );
    const overBudgetCount = trip.members.filter(
      (member) => destination.cost > member.budgetPerPerson
    ).length;
    const fit: DestinationFit = {
      dateFits: rangesOverlap(
        tripStart,
        tripEnd,
        destination.availStart,
        destination.availEnd
      ),
      budgetFits: overBudgetCount === 0,
      overBudgetCount,
      memberCount: trip.members.length,
      matchingTags,
      chosenByOptimizer:
        trip.decideLater && trip.destinationName === destination.name,
      optimizerExplanation:
        trip.decideLater && trip.destinationName === destination.name
          ? trip.optimizerExplanation
          : null,
    };
    return { destination, fit };
  });
  const filteredDestinations = destinationsWithFit
    .filter(({ destination }) => {
      const budgetFilter = selectedFilters.budget;
      const styleFilter = selectedFilters.style;
      const seasonFilter = selectedFilters.season;
      const matchesBudget =
        budgetFilter === 'Any' ||
        (budgetFilter === 'Budget' && destination.cost <= 20000) ||
        (budgetFilter === 'Mid-range' && destination.cost > 20000 && destination.cost <= 40000) ||
        (budgetFilter === 'Premium' && destination.cost > 40000);
      const matchesStyle =
        styleFilter === 'Any' || normalizeTags(destination.tags).includes(styleFilter);
      const matchesSeason =
        seasonFilter === 'Any' || destination.bestSeason?.includes(seasonFilter);
      return matchesBudget && matchesStyle && matchesSeason;
    })
    .sort(
      (a, b) =>
        Number(b.fit.dateFits && b.fit.budgetFits) -
        Number(a.fit.dateFits && a.fit.budgetFits)
    );

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
              <span className="text-sm font-medium">Compare ({compareList.length})</span>
              <div className="flex flex-1 flex-wrap gap-2">
                {compareList.map((d) => (
                  <Badge key={d.id} variant="secondary" className="gap-1">{d.name}
                    <button onClick={() => toggleCompare(d)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setCompareList([])}>
                Clear
              </Button>
              <Button size="sm" className="gap-1.5" onClick={openCompare} disabled={compareList.length < 2}>
                <GitCompare className="h-3.5 w-3.5" /> Compare
              </Button>
            </div>
          )}

          {/* Destination grid */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDestinations.map(({ destination: d, fit }) => (
              <DestinationCard
                key={d.id}
                destination={d}
                fit={fit}
                onCompare={toggleCompare}
                comparing={compareList.some((item) => item.id === d.id)}
                photoCredit={photoCredits[d.slug]?.author && photoCredits[d.slug]?.license
                  ? `Photo: ${photoCredits[d.slug].author} · ${photoCredits[d.slug].license}`
                  : undefined}
                onSelect={onSelect}
              />
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Costs and seasons are estimates from curated data.
          </p>
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
        <CompareModal
          destinations={compareList}
          result={compareResult}
          loading={compareLoading}
          explaining={compareExplaining}
          onExplain={explainCompare}
          onClose={() => setShowCompare(false)}
          onSelect={onSelect}
        />
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

function CompareModal({
  destinations,
  result,
  loading,
  explaining,
  onExplain,
  onClose,
  onSelect,
}: {
  destinations: Destination[];
  result: CompareResult | null;
  loading: boolean;
  explaining: boolean;
  onExplain: () => void;
  onClose: () => void;
  onSelect: (d: Destination) => void;
}) {
  const factsBySlug = new Map(result?.destinations.map((fact) => [fact.slug, fact]) ?? []);
  const value = (fact: CompareDestinationFacts | undefined, row: string) => {
    if (!fact) return 'n/a';
    if (row === 'estimated_cost') return fact.estimated_cost == null ? 'n/a' : formatINR(fact.estimated_cost);
    if (row === 'date_fit') return fact.date_fit == null ? 'n/a' : fact.date_fit ? 'Fits' : 'Does not fit';
    if (row === 'budget_fit') {
      return fact.budget_fit == null ? 'n/a' : `${fact.budget_fit.fit_count} of ${fact.budget_fit.total_members} members`;
    }
    if (row === 'interest_match') {
      return fact.interest_match == null
        ? 'n/a'
        : `${fact.interest_match.matched_members} of ${fact.interest_match.total_members} members`;
    }
    if (row === 'best_season') return fact.best_season ?? 'n/a';
    return fact.top_places.length ? fact.top_places.join(', ') : 'n/a';
  };
  const rows = [
    ['estimated_cost', 'Estimated cost'],
    ['date_fit', 'Date fit'],
    ['budget_fit', 'Budget fit'],
    ['interest_match', 'Interest match'],
    ['best_season', 'Best season'],
    ['top_places', 'Top places'],
  ];
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
              {rows.map(([key, label]) => (
                <tr key={key} className="border-t border-border">
                  <td className="p-3 font-medium text-muted-foreground">{label}</td>
                  {destinations.map((d) => {
                    const fact = factsBySlug.get(d.slug);
                    const best = result?.best_per_row[key as keyof CompareResult['best_per_row']];
                    return (
                      <td key={d.id} className={`p-3 ${best === d.slug ? 'bg-success/10' : ''}`}>
                        <p className="font-medium">{value(fact, key)}</p>
                        {key === 'interest_match' && fact?.interest_match?.shared_tags.length ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {fact.interest_match.shared_tags.join(', ')}
                          </p>
                        ) : null}
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={onExplain} disabled={loading || explaining}>
            {explaining ? 'Explaining…' : 'Explain this comparison'}
          </Button>
          {loading && <p className="text-sm text-muted-foreground">Loading comparison…</p>}
          {result?.summary && <p className="max-w-2xl text-sm text-muted-foreground">{result.summary}</p>}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Costs and seasons are estimates from curated data.
        </p>
      </div>
    </div>
  );
}

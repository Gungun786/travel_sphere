'use client';

import { useState } from 'react';
import { X, Check, Star, GitCompare } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { DestinationCard } from '@/components/trip/DestinationCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTripStore } from '@/store/tripStore';
import { mockDestinations } from '@/data/mockDestinations';
import type { Destination } from '@/types';
import { toast } from 'sonner';
import { formatINR } from '@/components/trip/shared';

const filters = [
  { key: 'budget', label: 'Budget', options: ['Any', 'Budget', 'Mid-range', 'Premium'] },
  { key: 'weather', label: 'Weather', options: ['Any', 'Warm', 'Mild', 'Cool'] },
  { key: 'style', label: 'Travel style', options: ['Any', 'Nature', 'Adventure', 'Cultural', 'Relaxed'] },
  { key: 'season', label: 'Season', options: ['Any', 'Winter', 'Summer', 'Monsoon'] },
];

const compareMetrics = [
  { key: 'budget', label: 'Budget', getVal: (d: Destination) => formatINR(d.estimatedCost), max: 70000, getNum: (d: Destination) => d.estimatedCost },
  { key: 'weather', label: 'Weather', getVal: (d: Destination) => d.temperature, max: 35, getNum: (d: Destination) => parseInt(d.temperature) },
  { key: 'activities', label: 'Activities', getVal: (d: Destination) => `${d.activities.length} options`, max: 6, getNum: (d: Destination) => d.activities.length },
  { key: 'food', label: 'Food scene', getVal: (d: Destination) => d.activities.includes('Food') ? 'Excellent' : 'Good', max: 1, getNum: (d: Destination) => d.activities.includes('Food') ? 1 : 0.5 },
  { key: 'nature', label: 'Nature', getVal: (d: Destination) => d.travelStyle.includes('Nature') ? 'High' : 'Medium', max: 1, getNum: (d: Destination) => d.travelStyle.includes('Nature') ? 1 : 0.5 },
  { key: 'culture', label: 'Culture', getVal: (d: Destination) => d.travelStyle.includes('Cultural') ? 'High' : 'Medium', max: 1, getNum: (d: Destination) => d.travelStyle.includes('Cultural') ? 1 : 0.5 },
  { key: 'traveltime', label: 'Travel time', getVal: (d: Destination) => '3–5 hrs', max: 1, getNum: () => 0.8 },
  { key: 'overall', label: 'Overall suitability', getVal: (d: Destination) => `${d.match}%`, max: 100, getNum: (d: Destination) => d.match },
];

export default function DestinationRecommendation() {
  const getCurrentTrip = useTripStore((s) => s.getCurrentTrip);
  const selectDestination = useTripStore((s) => s.selectDestination);
  const trip = getCurrentTrip();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map((f) => [f.key, 'Any']))
  );
  const [compareList, setCompareList] = useState<Destination[]>([]);
  const [showCompare, setShowCompare] = useState(false);

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
    selectDestination(d.id, d.name, d.image, d.estimatedCost);
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
            {mockDestinations.map((d) => (
              <DestinationCard
                key={d.id}
                destination={d}
                onCompare={toggleCompare}
                onSelect={onSelect}
              />
            ))}
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
                      <img src={d.image} alt={d.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-display font-semibold">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.match}% match</p>
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

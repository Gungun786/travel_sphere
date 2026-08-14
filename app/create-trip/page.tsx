'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  CalendarDays,
  Users,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PreferenceCard } from '@/components/trip/PreferenceCard';
import { mockDestinations } from '@/data/mockDestinations';
import { mockMembers } from '@/data/mockMembers';
import { useTripStore } from '@/store/tripStore';
import { toast } from 'sonner';
import type { Trip, Member, TravelStyle, Interest, FoodPref, Accommodation } from '@/types';
import { formatINR } from '@/components/trip/shared';

const steps = ['Trip Details', 'Group', 'Preferences', 'Budget', 'Review'];

const travelStyles: TravelStyle[] = ['Relaxed', 'Adventure', 'Luxury', 'Budget', 'Cultural', 'Nature', 'Nightlife'];
const interests: Interest[] = ['Beaches', 'Mountains', 'Trekking', 'Photography', 'Historical', 'Food', 'Shopping', 'Wildlife', 'Nightlife'];
const foods: FoodPref[] = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Local cuisine', 'Street food', 'Fine dining'];
const accommodations: Accommodation[] = ['Budget', 'Mid-range', 'Premium'];

export default function CreateTrip() {
  const router = useRouter();
  const addTrip = useTripStore((s) => s.addTrip);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('Summer Escape');
  const [destination, setDestination] = useState<string>('');
  const [decideLater, setDecideLater] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(4);
  const [members, setMembers] = useState<Member[]>(mockMembers.slice(0, 4));
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [prefs, setPrefs] = useState<Record<string, { style: TravelStyle; interests: Interest[]; food: FoodPref[]; acc: Accommodation }>>(
    Object.fromEntries(mockMembers.slice(0, 4).map((m) => [m.id, { style: m.travelStyle, interests: m.interests, food: m.food, acc: m.accommodation }]))
  );
  const [budget, setBudget] = useState({
    total: 50000,
    perPerson: 12500,
    transport: 12000,
    stay: 18000,
    food: 10000,
    activities: 8000,
  });
  const [loading, setLoading] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const addMember = () => {
    if (!newMember.name) return;
    const id = 'm' + (members.length + 1);
    const m: Member = {
      id,
      name: newMember.name,
      email: newMember.email || `${newMember.name.toLowerCase()}@travelsphere.app`,
      avatarColor: 'bg-chart-3 text-white',
      initials: newMember.name.slice(0, 2),
      travelStyle: 'Relaxed',
      interests: ['Beaches'],
      food: ['Vegetarian'],
      accommodation: 'Mid-range',
      budgetPerPerson: 10000,
    };
    setMembers((ms) => [...ms, m]);
    setPrefs((p) => ({ ...p, [id]: { style: 'Relaxed', interests: ['Beaches'], food: ['Vegetarian'], acc: 'Mid-range' } }));
    setNewMember({ name: '', email: '' });
  };

  const togglePref = (memberId: string, key: 'interests' | 'food', value: string) => {
    setPrefs((p) => {
      const cur = p[memberId];
      const arr = cur[key] as string[];
      const has = arr.includes(value);
      return { ...p, [memberId]: { ...cur, [key]: has ? arr.filter((x) => x !== value) : [...arr, value] } };
    });
  };

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      const dest = mockDestinations.find((d) => d.name === destination);
      const trip: Trip = {
        id: 'trip-' + Date.now(),
        name,
        destinationName: destination || 'To be decided',
        destinationId: dest?.id ?? null,
        image: dest?.image ?? 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1200',
        startDate: startDate || '2026-06-01',
        endDate: endDate || '2026-06-05',
        days: 4,
        travelers: members.length,
        budget: budget.total,
        perPerson: Math.round(budget.total / Math.max(members.length, 1)),
        progress: 35,
        status: 'planning',
        travelStyle: prefs[members[0]?.id]?.style ?? 'Relaxed',
        members,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addTrip(trip);
      toast.success('Trip created successfully.');
      router.push(`/trip/${trip.id}`);
    }, 800);
  };

  return (
    <AppShell>
      <Header title="Create a Trip" />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        {/* Progress */}
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      i < step
                        ? 'border-ocean bg-ocean text-white'
                        : i === step
                        ? 'border-ocean text-ocean'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`mt-2 hidden text-xs sm:block ${i === step ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 ${i < step ? 'bg-ocean' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          {/* Step 1 */}
          {step === 0 && (
            <Card className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold">Trip Details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Start with the basics of your trip.</p>
              <div className="mt-6 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Trip name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Summer Escape" />
                </div>

                <div className="space-y-1.5">
                  <Label>Destination</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={destination}
                      onChange={(e) => { setDestination(e.target.value); setDecideLater(false); }}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ocean"
                    >
                      <option value="">Select a destination</option>
                      {mockDestinations.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant={decideLater ? 'default' : 'outline'}
                      onClick={() => { setDecideLater(true); setDestination(''); }}
                      className="gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      {decideLater ? 'Will decide later' : 'Help me decide later'}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="start">Start date</Label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end">End date</Label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Number of travelers</Label>
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Slider
                      value={[travelers]}
                      min={1}
                      max={12}
                      step={1}
                      onValueChange={(v) => setTravelers(v[0])}
                      className="flex-1"
                    />
                    <span className="w-10 text-right font-semibold">{travelers}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <Card className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold">Invite Group Members</h2>
              <p className="mt-1 text-sm text-muted-foreground">Bring everyone into this trip.</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                <Input placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                <Button type="button" onClick={addMember} className="gap-2">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={m.avatarColor}>{m.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{m.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                    </div>
                    <button
                      onClick={() => setMembers((ms) => ms.filter((x) => x.id !== m.id))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-semibold">Group Preferences</h2>
                <p className="mt-1 text-sm text-muted-foreground">Capture what each traveler wants from this trip.</p>
              </div>
              {members.map((m) => {
                const p = prefs[m.id];
                return (
                  <Card key={m.id} className="p-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={m.avatarColor}>{m.initials}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-display text-lg font-semibold">{m.name}</h3>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Travel style</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {travelStyles.map((s) => (
                            <button
                              key={s}
                              onClick={() => setPrefs((prev) => ({ ...prev, [m.id]: { ...p, style: s } }))}
                              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                                p.style === s ? 'border-ocean bg-ocean/10 text-ocean' : 'border-border text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Interests</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {interests.map((s) => {
                            const active = p.interests.includes(s);
                            return (
                              <button
                                key={s}
                                onClick={() => togglePref(m.id, 'interests', s)}
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                                  active ? 'border-ocean bg-ocean/10 text-ocean' : 'border-border text-muted-foreground hover:bg-muted'
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Food</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {foods.map((s) => {
                            const active = p.food.includes(s);
                            return (
                              <button
                                key={s}
                                onClick={() => togglePref(m.id, 'food', s)}
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                                  active ? 'border-ocean bg-ocean/10 text-ocean' : 'border-border text-muted-foreground hover:bg-muted'
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Accommodation</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {accommodations.map((s) => (
                            <button
                              key={s}
                              onClick={() => setPrefs((prev) => ({ ...prev, [m.id]: { ...p, acc: s } }))}
                              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                                p.acc === s ? 'border-ocean bg-ocean/10 text-ocean' : 'border-border text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <Card className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold">Budget</h2>
              <p className="mt-1 text-sm text-muted-foreground">Allocate your group budget across categories.</p>

              <div className="mt-6 space-y-6">
                <BudgetSlider label="Total group budget" value={budget.total} min={10000} max={200000} step={1000} onChange={(v) => setBudget({ ...budget, total: v, perPerson: Math.round(v / Math.max(members.length, 1)) })} />
                <BudgetSlider label="Budget per person" value={budget.perPerson} min={2000} max={50000} step={500} onChange={(v) => setBudget({ ...budget, perPerson: v })} />
                <BudgetSlider label="Transportation budget" value={budget.transport} min={0} max={50000} step={500} onChange={(v) => setBudget({ ...budget, transport: v })} />
                <BudgetSlider label="Stay budget" value={budget.stay} min={0} max={80000} step={500} onChange={(v) => setBudget({ ...budget, stay: v })} />
                <BudgetSlider label="Food budget" value={budget.food} min={0} max={40000} step={500} onChange={(v) => setBudget({ ...budget, food: v })} />
                <BudgetSlider label="Activities budget" value={budget.activities} min={0} max={40000} step={500} onChange={(v) => setBudget({ ...budget, activities: v })} />
              </div>
            </Card>
          )}

          {/* Step 5 */}
          {step === 4 && (
            <Card className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold">Review & Create</h2>
              <p className="mt-1 text-sm text-muted-foreground">Here’s a summary of your trip.</p>

              <div className="mt-6 space-y-4">
                <SummaryRow label="Trip name" value={name} />
                <SummaryRow label="Destination" value={destination || 'To be decided'} />
                <SummaryRow label="Dates" value={`${startDate || '—'} → ${endDate || '—'}`} />
                <SummaryRow label="Travelers" value={`${members.length} people`} />
                <SummaryRow label="Total budget" value={formatINR(budget.total)} />
                <SummaryRow label="Per person" value={formatINR(budget.perPerson)} />
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Group members</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {members.map((m) => (
                    <Badge key={m.id} variant="secondary" className="gap-1.5 py-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className={`h-5 w-5 text-[10px] ${m.avatarColor}`}>{m.initials}</AvatarFallback>
                      </Avatar>
                      {m.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreate} className="mt-8 w-full gap-2" size="lg" disabled={loading}>
                {loading ? 'Creating trip…' : (<>Create Trip <ArrowRight className="h-4 w-4" /></>)}
              </Button>
            </Card>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={prev} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < steps.length - 1 && (
              <Button onClick={next} className="gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function BudgetSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="flex items-center font-semibold">
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
          {formatINR(value).slice(1)}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-4">
        <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} className="flex-1" />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

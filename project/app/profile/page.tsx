'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Check, X, MapPin, Star } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { useTripStore } from '@/store/tripStore';
import { toast } from 'sonner';
import { formatINR } from '@/components/trip/shared';

const pastTrips = [
  { id: 'p1', name: 'Rishikesh Retreat', image: 'https://images.pexels.com/photos/15970052/pexels-photo-15970052.jpeg?auto=compress&cs=tinysrgb&w=800', year: '2025' },
  { id: 'p2', name: 'Goa Beach Days', image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800', year: '2025' },
  { id: 'p3', name: 'Jaipur Heritage', image: 'https://images.pexels.com/photos/14780020/pexels-photo-14780020.jpeg?auto=compress&cs=tinysrgb&w=800', year: '2024' },
  { id: 'p4', name: 'Manali Snow', image: 'https://images.pexels.com/photos/12716193/pexels-photo-12716193.jpeg?auto=compress&cs=tinysrgb&w=800', year: '2024' },
];

export default function Profile() {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const trips = useTripStore((s) => s.trips);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    travelStyle: user?.travelStyle ?? '',
    favoriteDestinations: user?.favoriteDestinations.join(', ') ?? '',
    foodPreference: user?.foodPreference ?? '',
    typicalBudget: user?.typicalBudget ?? 0,
  });

  const save = () => {
    updateUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      travelStyle: form.travelStyle,
      favoriteDestinations: form.favoriteDestinations.split(',').map((s) => s.trim()).filter(Boolean),
      foodPreference: form.foodPreference,
      typicalBudget: Number(form.typicalBudget) || 0,
      initials: form.name.slice(0, 2),
    });
    setEditing(false);
    toast.success('Profile updated.');
  };

  return (
    <AppShell>
      <Header />
      <main className="flex-1 px-4 pb-24 pt-6 md:px-8 lg:pb-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-2xl font-bold tracking-tight">Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your personal travel preferences.</p>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_2fr]">
            {/* Profile summary */}
            <Card className="p-6 text-center">
              <Avatar className="mx-auto h-20 w-20">
                <AvatarFallback className={`text-xl font-semibold ${user?.avatarColor}`}>
                  {user?.initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 font-display text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-sunset text-sunset" /> {trips.length} trips
                </Badge>
                <Badge variant="outline">{user?.travelStyle}</Badge>
              </div>
            </Card>

            {/* Editable details */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Personal Information</h2>
                {!editing ? (
                  <Button variant="ghost" size="sm" className="gap-1.5 text-ocean" onClick={() => setEditing(true)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><X className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" className="gap-1.5" onClick={save}><Check className="h-3.5 w-3.5" /> Save</Button>
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!editing} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!editing} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!editing} />
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred travel style</Label>
                  <Input value={form.travelStyle} onChange={(e) => setForm({ ...form, travelStyle: e.target.value })} disabled={!editing} />
                </div>
                <div className="space-y-1.5">
                  <Label>Favorite destinations</Label>
                  <Input value={form.favoriteDestinations} onChange={(e) => setForm({ ...form, favoriteDestinations: e.target.value })} disabled={!editing} placeholder="Comma separated" />
                </div>
                <div className="space-y-1.5">
                  <Label>Food preference</Label>
                  <Input value={form.foodPreference} onChange={(e) => setForm({ ...form, foodPreference: e.target.value })} disabled={!editing} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Typical budget (₹)</Label>
                  <Input type="number" value={form.typicalBudget} onChange={(e) => setForm({ ...form, typicalBudget: Number(e.target.value) })} disabled={!editing} />
                </div>
              </div>
            </Card>
          </div>

          {/* Travel history */}
          <Card className="mt-5 p-6">
            <h2 className="font-display text-lg font-semibold">Travel History</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your past adventures.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pastTrips.map((t) => (
                <Card key={t.id} className="group overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                  <div className="relative h-40 overflow-hidden">
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs text-white/70">{t.year}</p>
                      <h3 className="font-display text-base font-semibold">{t.name}</h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Upcoming */}
          <Card className="mt-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Upcoming Trips</h2>
              <Link href="/dashboard"><Button variant="ghost" size="sm" className="text-ocean">View all</Button></Link>
            </div>
            <div className="mt-4 space-y-3">
              {trips.slice(0, 3).map((t) => (
                <Link key={t.id} href={`/trip/${t.id}`}>
                  <div className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
                    <img src={t.image} alt={t.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {t.destinationName} · {formatINR(t.budget)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}

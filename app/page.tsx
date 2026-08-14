'use client';

import Link from 'next/link';
import {
  Globe,
  MapPinned,
  Users,
  CalendarDays,
  IndianRupee,
  Compass,
  Heart,
  Wallet,
  Sparkles,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Compass,
    title: 'Personalized Trip Planning',
    desc: 'Create travel plans around your dates, interests, budget, and preferred travel style.',
  },
  {
    icon: Users,
    title: 'Group Preferences',
    desc: 'Bring everyone’s choices together and find options that work well for the whole group.',
  },
  {
    icon: CalendarDays,
    title: 'Smart Itinerary',
    desc: 'Organize each day with places, activities, timings, and efficient travel routes.',
  },
  {
    icon: Wallet,
    title: 'Budget & Expenses',
    desc: 'Track the total trip cost, individual spending, and shared expenses in one place.',
  },
  {
    icon: MapPinned,
    title: 'Destination Discovery',
    desc: 'Compare destinations using budget, interests, weather, ratings, and seasonality.',
  },
];

const steps = [
  { n: '01', title: 'Create your trip', desc: 'Set your dates, group size, and budget.' },
  { n: '02', title: 'Invite your group', desc: 'Bring everyone into one shared plan.' },
  { n: '03', title: 'Share preferences', desc: 'Collect travel styles, interests, and food choices.' },
  { n: '04', title: 'Build your travel plan', desc: 'Get a destination, itinerary, and budget together.' },
];

const destinations = [
  { name: 'Kerala', tag: 'Backwaters', img: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Goa', tag: 'Beaches', img: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Manali', tag: 'Mountains', img: 'https://images.pexels.com/photos/12716193/pexels-photo-12716193.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Jaipur', tag: 'Heritage', img: 'https://images.pexels.com/photos/14780020/pexels-photo-14780020.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Rishikesh', tag: 'Adventure', img: 'https://images.pexels.com/photos/15970052/pexels-photo-15970052.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Meghalaya', tag: 'Waterfalls', img: 'https://images.pexels.com/photos/14379054/pexels-photo-14379054.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const testimonials = [
  { name: 'Aarav Mehta', role: 'Weekend explorer', text: 'Our group of six finally agreed on a destination. TravelSphere made the whole planning conversation painless.', initials: 'AM', color: 'bg-ocean text-white' },
  { name: 'Sara Khan', role: 'Trip organizer', text: 'The budget tracking saved us from so many awkward money conversations after the trip.', initials: 'SK', color: 'bg-sunset text-white' },
  { name: 'Rohan Das', role: 'Frequent traveler', text: 'Seeing everyone’s preferences side by side helped us pick a trip that genuinely worked for all of us.', initials: 'RD', color: 'bg-success text-white' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean text-white">
              <Globe className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              TravelSphere
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#explore" className="transition-colors hover:text-foreground">Explore</a>
            <a href="#how" className="transition-colors hover:text-foreground">How It Works</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <Badge variant="secondary" className="mb-5 gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Plan trips together, beautifully
              </Badge>
              <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-6xl">
                Plan Better.{' '}
                <span className="text-ocean">Travel Together.</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground text-balance">
                Bring everyone’s travel preferences, plans, and budgets together in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/create-trip">
                  <Button size="lg" className="gap-2">
                    Plan a Trip <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">Explore Destinations</Button>
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative animate-fade-up">
              <div className="relative overflow-hidden rounded-3xl shadow-soft-lg">
                <img
                  src="https://images.pexels.com/photos/19743480/pexels-photo-19743480.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Kerala backwaters"
                  className="h-[420px] w-full object-cover md:h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 top-10 hidden rounded-2xl border border-border bg-background/90 p-3 shadow-soft backdrop-blur-md sm:flex sm:items-center sm:gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Travelers</p>
                  <p className="text-sm font-semibold">5 travelers</p>
                </div>
              </div>

              <div className="absolute -right-4 top-24 hidden rounded-2xl border border-border bg-background/90 p-3 shadow-soft backdrop-blur-md sm:block">
                <p className="text-xs text-muted-foreground">Group budget</p>
                <p className="text-sm font-semibold">₹50,000</p>
              </div>

              <div className="absolute -left-4 bottom-10 hidden rounded-2xl border border-border bg-background/90 p-3 shadow-soft backdrop-blur-md sm:flex sm:items-center sm:gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sunset/15 text-sunset">
                  <CalendarDays className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">4 days</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-16 hidden rounded-2xl border border-border bg-background/90 p-3 shadow-soft backdrop-blur-md sm:block">
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="text-sm font-semibold">Kerala</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
              Everything your group needs for a better trip
            </h2>
            <p className="mt-3 text-muted-foreground">
              One shared workspace for planning, preferences, budgets, and the journey itself.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-6 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              );
            })}
            <Card className="flex flex-col justify-center bg-ocean p-6 text-white">
              <Star className="h-6 w-6 fill-white/30 text-white/80" />
              <p className="mt-4 font-display text-lg font-semibold">
                Loved by groups of every size
              </p>
              <p className="mt-2 text-sm text-white/80">
                From weekend getaways to week-long expeditions, TravelSphere keeps everyone on the same page.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Four simple steps from idea to itinerary.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <Card key={s.n} className="p-6">
                <span className="font-display text-3xl font-bold text-ocean/30">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="explore" className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Where will you go next?
              </h2>
              <p className="mt-3 text-muted-foreground">
                A few favorites to spark your next adventure.
              </p>
            </div>
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="outline" className="gap-2">
                Explore all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Card key={d.name} className="group overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                <div className="relative h-56 overflow-hidden">
                  <img src={d.img} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{d.name}</h3>
                      <p className="text-sm text-white/80">{d.tag}</p>
                    </div>
                    <Heart className="h-5 w-5 text-white/70" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Travelers love planning together
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-sunset text-sunset" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-ocean">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-white md:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Start Planning Your Next Trip
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Bring your group together and turn scattered plans into one beautiful journey.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" variant="secondary">Get Started Free</Button>
            </Link>
            <Link href="/create-trip">
              <Button size="lg" className="bg-white text-ocean hover:bg-white/90">Plan a Trip</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div className="max-w-xs">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-semibold">TravelSphere</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Plan better, travel together — one shared workspace for your whole group.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-4">
              {['Product', 'Features', 'About', 'Contact', 'Privacy', 'Terms'].map((l) => (
                <a key={l} href="#" className="text-muted-foreground transition-colors hover:text-foreground">{l}</a>
              ))}
            </div>
          </div>
          <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} TravelSphere. Crafted for groups who love to travel.
          </div>
        </div>
      </footer>
    </div>
  );
}

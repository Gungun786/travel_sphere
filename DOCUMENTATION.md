# TravelSphere — Project Documentation

A premium travel planning platform that helps groups plan trips together — bringing preferences, itineraries, and budgets into one shared workspace.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [How the App Works](#how-the-app-works)
5. [Page-by-Page Walkthrough](#page-by-page-walkthrough)
6. [State Management](#state-management)
7. [Mock Data Architecture](#mock-data-architecture)
8. [Component Library](#component-library)
9. [Design System](#design-system)
10. [Responsive Design](#responsive-design)
11. [How to Customize](#how-to-customize)
12. [Connecting a Backend Later](#connecting-a-backend-later)
13. [Common Questions](#common-questions)

---

## Getting Started

### Prerequisites

- Node.js 18 or higher (developed on Node 22)
- VS Code (or any code editor)
- A modern browser

### Installation

```bash
# 1. Open the project folder in VS Code
# 2. Open the terminal (Ctrl + ` or Terminal > New Terminal)

# Install all dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Other Commands

```bash
npm run build     # Build the production version
npm run start      # Run the production build
npm run lint       # Check for code issues
npm run typecheck  # Check TypeScript types without building
```

---

## Tech Stack

| Layer              | Technology              | Why it was chosen                                      |
|--------------------|-------------------------|--------------------------------------------------------|
| Framework          | Next.js 14 (React 18)   | File-based routing, server rendering, fast dev server  |
| Language           | TypeScript              | Type safety catches bugs before runtime                |
| Styling            | Tailwind CSS 3          | Utility-first CSS for rapid, consistent styling        |
| UI Components      | shadcn/ui + Radix       | Accessible, customizable component primitives           |
| Icons              | Lucide React            | Clean, consistent icon set                             |
| State Management   | Zustand                 | Lightweight, no boilerplate, global state              |
| Charts             | Recharts                | Responsive charts for the budget dashboard              |
| Notifications      | Sonner                  | Toast messages for user feedback                        |
| Fonts              | Google Fonts            | Inter (body) + Plus Jakarta Sans (headings)             |

### Why Next.js instead of plain React?

Next.js is built on top of React. It adds:
- **File-based routing** — each folder under `app/` becomes a URL route automatically
- **Fast refresh** — edits appear instantly in the browser without losing state
- **Production optimization** — code splitting, image handling, and minification built in

The original request mentioned Vite + React Router. This project uses Next.js because the starter template was already configured with it. The architecture (components, stores, types, mock data) is framework-agnostic and would work the same way with Vite.

---

## Project Structure

```
project/
├── app/                          # All pages (Next.js App Router)
│   ├── layout.tsx                # Root layout — sets fonts, toaster
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # Global styles + CSS variables
│   ├── login/page.tsx            # Login page (/login)
│   ├── signup/page.tsx           # Signup page (/signup)
│   ├── dashboard/page.tsx        # Dashboard (/dashboard)
│   ├── create-trip/page.tsx      # Multi-step trip creation (/create-trip)
│   ├── profile/page.tsx          # User profile (/profile)
│   └── trip/[tripId]/            # Trip detail pages
│       ├── page.tsx              # Trip overview (/trip/:tripId)
│       ├── group/page.tsx        # Group preferences (/trip/:tripId/group)
│       ├── destination/page.tsx  # Destination finder (/trip/:tripId/destination)
│       ├── itinerary/page.tsx    # Day-by-day itinerary (/trip/:tripId/itinerary)
│       ├── budget/page.tsx       # Budget dashboard (/trip/:tripId/budget)
│       └── expenses/page.tsx     # Expense tracking (/trip/:tripId/expenses)
│
├── components/
│   ├── layout/                   # App shell components
│   │   ├── AppShell.tsx          # Wraps pages with sidebar + mobile nav
│   │   ├── Sidebar.tsx           # Desktop navigation sidebar
│   │   ├── Header.tsx            # Top bar with search, notifications, avatar
│   │   └── MobileNav.tsx         # Bottom navigation for mobile
│   ├── trip/                     # Trip-specific reusable components
│   │   ├── TripCard.tsx          # Trip preview card with image + progress
│   │   ├── TripHero.tsx          # Trip page hero image + sub-navigation
│   │   ├── MemberCard.tsx        # Group member profile card
│   │   ├── DestinationCard.tsx  # Destination with match % and details
│   │   ├── ActivityCard.tsx      # Single itinerary activity
│   │   ├── ItineraryTimeline.tsx # Day timeline with activities
│   │   ├── BudgetCard.tsx        # Budget category progress bar
│   │   ├── ExpenseCard.tsx       # Single expense entry
│   │   ├── PreferenceCard.tsx    # Selectable preference chips
│   │   └── shared.tsx            # Shared helpers (formatINR, dates, badges)
│   └── ui/                       # shadcn/ui primitives (Button, Card, Dialog, etc.)
│
├── store/                        # Zustand global state
│   ├── userStore.ts              # Current user + auth state
│   └── tripStore.ts              # Trips, budget, expenses, itinerary
│
├── data/                         # Mock data (replaces a backend API)
│   ├── mockTrips.ts              # Sample trips (Kerala, Goa, Manali)
│   ├── mockDestinations.ts       # 6 destinations with match scores
│   ├── mockMembers.ts            # 5 group members with preferences
│   └── mockTripData.ts           # Itinerary, budget, expenses, settlements
│
├── types/
│   └── index.ts                  # All TypeScript interfaces
│
├── lib/
│   └── utils.ts                  # cn() helper for class merging
│
├── tailwind.config.ts            # Tailwind theme (colors, fonts, shadows)
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies and scripts
```

---

## How the App Works

### The Big Picture

TravelSphere is a **single-page application** with **client-side state**. Here's the flow:

```
User visits Landing → Signs up / Logs in → Arrives at Dashboard
    → Creates a new trip (5-step wizard)
    → Opens the trip → Navigates between 6 sub-pages:
        Overview · Group · Destination · Itinerary · Budget · Expenses
```

All data lives in the browser via **Zustand stores**. When you create a trip, it appears on the dashboard instantly. When you add an expense, the totals update immediately. No server calls are made — everything is mock data and local state.

### What happens when you load a page

1. Next.js matches the URL to a file in `app/`
2. The page component reads data from Zustand stores
3. The component renders UI using shadcn/ui components
4. User interactions (clicks, form submits) update the Zustand store
5. The store change triggers a re-render with new data

---

## Page-by-Page Walkthrough

### 1. Landing Page (`app/page.tsx`)

**What it shows:** Marketing page with hero, features, how-it-works, destinations, testimonials, CTA.

**Key concepts:**
- Uses `Link` from Next.js for navigation (no page reload)
- Floating cards on the hero are absolutely positioned over the image
- The `animate-fade-up` class triggers a CSS keyframe animation defined in `globals.css`
- All sections use semantic IDs (`#features`, `#how`, `#explore`) for smooth-scroll navigation

**How to explain it:** "The landing page is a static marketing page. Each section is a self-contained block. The header navigation links scroll to sections using anchor IDs. The 'Plan a Trip' and 'Get Started' buttons use Next.js Link components to navigate to the create-trip and signup routes without a full page reload."

### 2. Login & Signup (`app/login/page.tsx`, `app/signup/page.tsx`)

**What it shows:** Split-screen layout with travel image on one side, form on the other.

**Key concepts:**
- `useState` manages form fields (email, password, etc.)
- `validate()` function checks fields before submission
- On submit, a `setTimeout` simulates a network request (700-800ms)
- Calls `login()` or `signup()` from the userStore
- `useRouter().push('/dashboard')` navigates to the dashboard
- Toast notification appears via `sonner`

**How to explain it:** "The auth pages use React's useState hook to track form input. Before submitting, a validate function checks that the email format is valid and passwords match. Since there's no backend yet, the 'login' just stores the user in Zustand and redirects to the dashboard. The setTimeout simulates a real API call delay so the button shows a loading state."

### 3. Dashboard (`app/dashboard/page.tsx`)

**What it shows:** Greeting, stat cards, tabbed sections for trips and destinations.

**Key concepts:**
- Reads `trips` from `useTripStore` — any trip created appears here
- Three tabs (Overview / My Trips / Explore) controlled by local `useState`
- `TripCard` component is reused for each trip
- Stat cards are hardcoded values (would come from an API later)

**How to explain it:** "The dashboard reads the trips array from the global Zustand store. When you create a trip on the create-trip page, it calls addTrip() which prepends the new trip to the store. Because React components subscribed to the store re-render on changes, the dashboard automatically shows the new trip. The tabs are simple local state — clicking a tab just swaps which section renders."

### 4. Create Trip (`app/create-trip/page.tsx`)

**What it shows:** 5-step wizard with a progress indicator at the top.

**Key concepts:**
- `step` state (0-4) controls which step renders
- `next()` and `prev()` increment/decrement the step
- Each step has its own state fields (name, destination, members, preferences, budget)
- Step 2: members are stored in a `Member[]` array; add/remove updates the array
- Step 3: preferences use a `Record<memberId, preferences>` object; `togglePref` adds/removes items from arrays
- Step 4: budget uses `Slider` components (from shadcn/ui) with `onValueChange`
- Step 5: `handleCreate()` builds a `Trip` object and calls `addTrip()` from the store

**How to explain it:** "The create-trip page is a controlled multi-step form. A single step state variable (0 through 4) determines which step's UI renders. All form data is held in React state across the steps. The progress indicator at the top checks if step < current to show a checkmark. When the user clicks Create Trip on step 5, all the collected state is assembled into a Trip object and added to the Zustand store, which makes it appear on the dashboard."

### 5. Trip Overview (`app/trip/[tripId]/page.tsx`)

**What it shows:** Hero image, progress checklist, quick info, and six content sections.

**Key concepts:**
- `[tripId]` is a dynamic route parameter — Next.js passes it via the URL
- `getCurrentTrip()` from the store finds the trip by ID
- `TripHero` component renders the image + sub-navigation tabs
- Progress items are a static array with done/pct values
- Recent activity is mock data showing a timeline of actions

**How to explain it:** "The trip overview uses a dynamic route — the [tripId] folder name becomes a URL parameter. The page calls getCurrentTrip() from the store to find the matching trip. The TripHero component at the top is shared across all six trip sub-pages; it takes an 'active' prop to highlight the current tab in the sub-navigation."

### 6. Group Preferences (`app/trip/[tripId]/group/page.tsx`)

**What it shows:** Member cards, common vs. different preferences visualization, best-match destination.

**Key concepts:**
- Iterates over `trip.members` to render `MemberCard` components
- Aggregates interests: counts how many members share each interest
- "Common" = 3+ members share it; "partial" = 2 members
- Comparison bars show two-sided preferences (Beach vs Mountains, etc.)
- Width of each side is proportional to the count of members
- "Best Match" card shows the top destination with explanation copy

**How to explain it:** "This page aggregates each member's preferences. It loops through all members' interests and counts how many people selected each one. Interests chosen by 3 or more people are 'common preferences.' The comparison bars calculate a percentage — if 3 people want beaches and 2 want mountains, the bar splits 60/40. The Best Match card just shows the highest-rated destination with a plain-language explanation."

### 7. Destination Recommendation (`app/trip/[tripId]/destination/page.tsx`)

**What it shows:** Filter controls, destination cards with match %, comparison modal.

**Key concepts:**
- `compareList` state holds up to 3 destinations for comparison
- `toggleCompare()` adds/removes from the list (max 3)
- Compare modal renders a table with metric bars for each destination
- `onSelect()` calls `selectDestination()` in the store, which updates the trip's destination
- Filter dropdowns are local state (visual only — would filter results with a backend)

**How to explain it:** "Each destination card shows a match percentage from the mock data. Users can select up to 3 destinations to compare — the compareList array holds them, and when you click Compare, a modal opens with a side-by-side table. Each metric bar's width is calculated as (value / max) * 100. When you click Select on a destination, it calls the store's selectDestination function, which updates the current trip's destinationId, name, and image."

### 8. Itinerary (`app/trip/[tripId]/itinerary/page.tsx`)

**What it shows:** Day selector, timeline of activities, route map placeholder, add/edit dialog.

**Key concepts:**
- `activeDay` state controls which day's timeline shows
- `itinerary` comes from the store (mock data with 4 days)
- `ItineraryTimeline` renders activities with a vertical line connecting them
- Add/Edit uses a `Dialog` component (shadcn/ui) with form fields
- `addItineraryActivity()` and `removeItineraryActivity()` update the store
- The route map is a styled SVG with dotted paths and numbered markers — a visual placeholder

**How to explain it:** "The itinerary page shows one day at a time. The day selector buttons set the activeDay state, and the timeline for that day renders. Each activity is an ActivityCard with time, place, category, duration, and cost. The timeline component draws a vertical line with dots using CSS. The map on the right is an SVG with a dashed path and numbered circles — it's a visual mock that would be replaced with a real map (like Google Maps) when a backend is connected. Adding or editing an activity opens a Dialog modal with form fields, and the activity is added to or replaced in the store."

### 9. Budget (`app/trip/[tripId]/budget/page.tsx`)

**What it shows:** Top stat cards, donut chart, budget health card, category breakdown.

**Key concepts:**
- Budget data comes from `useTripStore().budget` (a `BudgetBreakdown` object)
- Donut chart uses Recharts: `PieChart` with `Pie` (innerRadius + outerRadius = donut)
- Each slice gets a color from `categoryColors` map
- "Budget Health" compares estimated vs. total budget — green if under, red if over
- `BudgetCard` component shows a progress bar for each category (spent / allocated)

**How to explain it:** "The budget page reads the budget breakdown from the store — it has five categories (accommodation, transportation, food, activities, other), each with a spent and allocated amount. The donut chart uses Recharts' PieChart component with an innerRadius to create the donut shape. Each slice's color comes from a predefined color map. The Budget Health card checks if the total estimated cost exceeds the trip budget — if so, it shows a red warning state; otherwise, a green success state. The category breakdown uses the BudgetCard component, which calculates a percentage and shows a progress bar."

### 10. Expenses (`app/trip/[tripId]/expenses/page.tsx`)

**What it shows:** Stat cards, expense list, add-expense modal, settlement section.

**Key concepts:**
- `expenses` array from the store; `addExpense()` prepends new entries
- Stats are calculated with `.reduce()` — total spent, your share, group share
- Settlements have a `settled` boolean; "Mark as Settled" flips it to true
- Add expense dialog collects: name, amount, category, paid by, split between, date, notes
- Empty state shows when no expenses exist

**How to explain it:** "The expenses page lists all expenses from the store. The four stat cards at the top are calculated using JavaScript's reduce method — summing all amounts for 'Total Spent', filtering by who paid for 'Your Spending'. The add-expense modal collects all fields and creates an Expense object that's prepended to the store. The settlement section on the right shows who owes whom — each settlement has a 'settled' flag, and clicking 'Mark as Settled' updates that flag in local state, which changes the badge to show 'Settled'."

### 11. Profile (`app/profile/page.tsx`)

**What it shows:** Avatar, editable personal info, travel history gallery, upcoming trips.

**Key concepts:**
- Reads `user` from `useUserStore`
- Edit mode toggled by `editing` state
- `save()` calls `updateUser()` with the form data
- Travel history is a static array of past trips with images
- Upcoming trips come from the trip store

**How to explain it:** "The profile page shows the current user from the user store. Clicking Edit switches the form fields from disabled to editable. The save function calls updateUser() with all the form values, which updates the store and re-renders. The travel history section is a grid of past trip cards with images. The upcoming trips section reads from the trip store and links back to each trip's overview page."

---

## State Management

The app uses **Zustand** for global state. Zustand is a lightweight alternative to Redux — no action types, no reducers, no boilerplate.

### userStore (`store/userStore.ts`)

```
user: User | null          ← current logged-in user
isAuthenticated: boolean   ← tracks login state
login(email)               ← sets user + authenticated
signup(name, email)        ← creates user + authenticated
logout()                   ← clears auth
updateUser(patch)          ← partial update for profile editing
```

### tripStore (`store/tripStore.ts`)

```
trips: Trip[]              ← all trips (starts with 3 mock trips)
currentTripId: string      ← which trip is being viewed
budget: BudgetBreakdown    ← 5 categories with spent/allocated
expenses: Expense[]        ← all expense entries
itinerary: ItineraryDay[]  ← 4 days of activities

addTrip(trip)              ← adds a new trip (from create-trip)
addExpense(expense)        ← adds an expense
updateBudget(patch)        ← updates budget categories
addItineraryActivity()     ← adds activity to a day
removeItineraryActivity()   ← removes activity
selectDestination()        ← changes the trip's destination
```

### How Zustand works (for your teacher)

```typescript
// Create a store
export const useTripStore = create<TripState>((set, get) => ({
  trips: mockTrips,                    // initial state
  addTrip: (trip) => set((s) => ({     // action that updates state
    trips: [trip, ...s.trips],
  })),
  getCurrentTrip: () => {              // read state with get()
    const { trips, currentTripId } = get();
    return trips.find(t => t.id === currentTripId) ?? trips[0];
  },
}));

// Use it in a component
function Dashboard() {
  const trips = useTripStore((s) => s.trips);  // subscribe to trips
  // Only re-renders when `trips` changes
}
```

**Key point:** Components subscribe to specific slices of state. When that slice changes, only those components re-render — not the whole app.

---

## Mock Data Architecture

All data lives in the `data/` folder and is imported into the Zustand stores as initial state.

```
data/
├── mockTrips.ts          → 3 trips (Kerala, Goa, Manali)
├── mockMembers.ts        → 5 members (Gungun, Kanak, Kanan, Divya, Monika)
├── mockDestinations.ts   → 6 destinations with match scores, ratings, weather
└── mockTripData.ts       → itinerary (4 days), budget breakdown, expenses, settlements
```

### Why this structure?

Each data file exports typed arrays. The stores import them as initial state. When you're ready to connect a backend:

1. Replace the initial state with an API fetch
2. Keep the same TypeScript interfaces
3. The components don't change at all

**Example — current (mock):**
```typescript
trips: mockTrips,
```

**Example — future (API):**
```typescript
trips: [],
fetchTrips: async () => {
  const res = await fetch('/api/trips');
  set({ trips: await res.json() });
},
```

---

## Component Library

### Layout Components

| Component       | Purpose                                           |
|-----------------|---------------------------------------------------|
| `AppShell`      | Wraps every authenticated page (sidebar + content)|
| `Sidebar`       | Desktop left navigation (Dashboard, Trips, Explore, Profile) |
| `Header`        | Top bar with search, notifications, user avatar  |
| `MobileNav`     | Bottom tab bar shown on mobile (hidden on desktop)|

### Trip Components

| Component          | Purpose                                              |
|--------------------|------------------------------------------------------|
| `TripCard`         | Preview card with image, dates, budget, progress bar |
| `TripHero`         | Full-width image header + sub-navigation tabs       |
| `MemberCard`       | Shows a member's avatar, style, interests, food prefs|
| `DestinationCard`  | Destination with match %, cost, weather, activities  |
| `ActivityCard`     | Single itinerary activity with time, place, category |
| `ItineraryTimeline`| Renders a day's activities as a vertical timeline    |
| `BudgetCard`       | Category progress bar (spent vs allocated)           |
| `ExpenseCard`      | Single expense with category icon, payer, split      |
| `PreferenceCard`   | Selectable chip groups for preferences                |

### UI Components (shadcn/ui)

These are pre-built accessible components in `components/ui/`:
- `Button`, `Card`, `Input`, `Label`, `Badge`, `Avatar`
- `Dialog` (modal), `Tabs`, `Checkbox`, `Slider`, `Progress`
- `Select`, `Textarea`, `Tooltip`, `Dropdown`, `Toast`, `Sonner`

---

## Design System

### Colors (CSS variables in `globals.css`)

| Variable      | Use case                        |
|---------------|---------------------------------|
| `--primary`   | Ocean blue (#0c4a6e) — main brand color |
| `--sunset`     | Warm orange — used sparingly for accents |
| `--success`   | Green — budget healthy states   |
| `--destructive`| Red — over budget, errors       |
| `--background`| White — page background          |
| `--muted`     | Light gray — secondary backgrounds|

### Typography

- **Headings:** Plus Jakarta Sans (`font-display` class) — bold, modern
- **Body:** Inter (`font-sans` class) — clean, highly readable
- **Line spacing:** 150% for body, 120% for headings

### Spacing

The design uses an **8px spacing system**. Tailwind's default spacing scale (4 = 1rem = 16px) is used throughout for consistent padding and margins.

### Shadows

Custom soft shadows defined in `tailwind.config.ts`:
- `shadow-soft` — subtle card shadow
- `shadow-soft-lg` — elevated card shadow on hover

---

## Responsive Design

| Breakpoint | Width     | Layout                                    |
|------------|-----------|-------------------------------------------|
| Mobile     | < 768px   | Bottom nav, stacked cards, single column  |
| Tablet     | 768-1024px| 2-column grids, no sidebar                |
| Desktop    | > 1024px  | Full sidebar, 3-column grids, wide content|

### How it works

- Sidebar: `hidden lg:flex` — only shows on large screens
- MobileNav: `lg:hidden` — only shows on smaller screens
- Grids: `grid sm:grid-cols-2 lg:grid-cols-3` — columns increase with screen size
- Content padding: `px-4 md:px-8` — more padding on larger screens

---

## How to Customize

### Change the brand color

Edit `app/globals.css`:
```css
--primary: 199 89% 30%;   /* Change these HSL values */
--ocean: 199 89% 30%;
```

### Change the app name

Search for "TravelSphere" across all files and replace with your name.

### Add a new trip

Edit `data/mockTrips.ts` and add a new object to the array.

### Add a new destination

Edit `data/mockDestinations.ts` and add a new destination object.

### Change member names

Edit `data/mockMembers.ts` — update name, email, initials, and avatarColor.

### Add a new page

1. Create a new folder under `app/` (e.g., `app/settings/page.tsx`)
2. Write a React component as the default export
3. It's automatically available at `/settings`

---

## Connecting a Backend Later

The app is structured so mock data can be replaced with real API calls.

### Step 1: Keep the TypeScript interfaces

The types in `types/index.ts` (Trip, Member, Expense, etc.) define the data shape. Your backend should return JSON matching these interfaces.

### Step 2: Replace store initial values with fetch calls

**Before (mock):**
```typescript
trips: mockTrips,
```

**After (API):**
```typescript
trips: [],
fetchTrips: async () => {
  const res = await fetch('https://your-api.com/api/trips');
  set({ trips: await res.json() });
},
```

### Step 3: Call fetch on page load

```typescript
useEffect(() => {
  useTripStore.getState().fetchTrips();
}, []);
```

### Suggested API endpoints (FastAPI)

```
GET    /api/trips                  → list trips
POST   /api/trips                  → create trip
GET    /api/trips/:id              → get trip details
PUT    /api/trips/:id              → update trip
GET    /api/trips/:id/expenses     → list expenses
POST   /api/trips/:id/expenses     → add expense
GET    /api/destinations           → list destinations
POST   /api/auth/login             → login
POST   /api/auth/signup            → signup
```

---

## Common Questions

**Q: Why does the app use Next.js instead of Vite?**
A: The project starter was pre-configured with Next.js. Both are React frameworks — the component logic, state management, and styling would be identical with Vite. Next.js adds file-based routing and production optimization.

**Q: Where is the data stored?**
A: In the browser's memory via Zustand stores. When you refresh the page, the data resets to the mock defaults. This is intentional — it's a frontend demo. A real backend would persist data in a database.

**Q: Is the authentication real?**
A: No. The login and signup pages store a user object in Zustand and redirect to the dashboard. There's no server verification, password hashing, or session management. This would be added when connecting a backend.

**Q: How does the match percentage work?**
A: It's a static number in the mock data (`match: 92`). In a real app, the backend would calculate this based on the group's preferences, budget, and travel style compared to each destination's attributes.

**Q: Why are there two navigation bars?**
A: The sidebar is for desktop (wide screens). The bottom navigation bar is for mobile (narrow screens). They show the same links but adapt to the device. Only one is visible at a time.

**Q: What is shadcn/ui?**
A: It's a collection of pre-built React components built on top of Radix UI primitives. They're copied directly into your project (in `components/ui/`) so you can customize them freely. It's not an npm package you install — you own the component code.

**Q: What is Zustand?**
A: A small (1KB) state management library for React. It lets you create a store with state and actions. Components subscribe to slices of the store and re-render only when their slice changes. It's simpler than Redux with less boilerplate.

**Q: How do I add a new feature?**
A: 1) Define the type in `types/index.ts`. 2) Add mock data in `data/`. 3) Add state/actions to a Zustand store. 4) Create a component in `components/`. 5) Use it in a page under `app/`.

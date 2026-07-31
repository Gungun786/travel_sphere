export type TravelStyle =
  | 'Relaxed'
  | 'Adventure'
  | 'Luxury'
  | 'Budget'
  | 'Cultural'
  | 'Nature'
  | 'Nightlife';

export type Interest =
  | 'Beaches'
  | 'Mountains'
  | 'Trekking'
  | 'Photography'
  | 'Historical'
  | 'Food'
  | 'Shopping'
  | 'Wildlife'
  | 'Nightlife';

export type FoodPref =
  | 'Vegetarian'
  | 'Non-vegetarian'
  | 'Vegan'
  | 'Local cuisine'
  | 'Street food'
  | 'Fine dining';

export type Accommodation = 'Budget' | 'Mid-range' | 'Premium';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  travelStyle: TravelStyle;
  interests: Interest[];
  food: FoodPref[];
  accommodation: Accommodation;
  budgetPerPerson: number;
}

export interface Trip {
  id: string;
  name: string;
  destinationName: string;
  destinationId: string | null;
  image: string;
  startDate: string;
  endDate: string;
  days: number;
  travelers: number;
  budget: number;
  perPerson: number;
  progress: number;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
  travelStyle: TravelStyle;
  members: Member[];
  createdAt: string;
}

export interface Activity {
  id: string;
  time: string;
  place: string;
  category: string;
  duration: string;
  cost: number;
  distanceFromPrev: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
  dailyCost: number;
}

export interface BudgetBreakdown {
  accommodation: { spent: number; allocated: number };
  transportation: { spent: number; allocated: number };
  food: { spent: number; allocated: number };
  activities: { spent: number; allocated: number };
  other: { spent: number; allocated: number };
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  paidBy: string;
  splitBetween: number;
  date: string;
  notes?: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  settled: boolean;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  match: number;
  estimatedCost: number;
  temperature: string;
  bestSeason: string;
  activities: string[];
  rating: number;
  travelStyle: string[];
  budgetLevel: 'Budget' | 'Mid-range' | 'Premium';
  seasonTags: string[];
  description: string;
}

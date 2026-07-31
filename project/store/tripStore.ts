import { create } from 'zustand';
import type {
  Trip,
  Member,
  BudgetBreakdown,
  Expense,
  ItineraryDay,
} from '@/types';
import { mockTrips } from '@/data/mockTrips';
import { mockMembers } from '@/data/mockMembers';
import {
  mockBudget,
  mockExpenses,
  mockItinerary,
} from '@/data/mockTripData';

interface TripState {
  trips: Trip[];
  currentTripId: string | null;
  draftTrip: Partial<Trip> | null;
  draftMembers: Member[];
  budget: BudgetBreakdown;
  expenses: Expense[];
  itinerary: ItineraryDay[];
  selectedDestinationId: string | null;

  setCurrentTrip: (id: string) => void;
  getCurrentTrip: () => Trip;
  addTrip: (trip: Trip) => void;
  setDraftTrip: (draft: Partial<Trip> | null) => void;
  setDraftMembers: (members: Member[]) => void;
  addDraftMember: (m: Member) => void;
  updateBudget: (b: Partial<BudgetBreakdown>) => void;
  addExpense: (e: Expense) => void;
  removeExpense: (id: string) => void;
  updateItineraryActivity: (day: number, activityId: string, patch: Partial<{ time: string; place: string; category: string; duration: string; cost: number }>) => void;
  removeItineraryActivity: (day: number, activityId: string) => void;
  addItineraryActivity: (day: number, activity: any) => void;
  selectDestination: (id: string, name: string, image: string, estimatedCost: number) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: mockTrips,
  currentTripId: mockTrips[0].id,
  draftTrip: null,
  draftMembers: mockMembers,
  budget: mockBudget,
  expenses: mockExpenses,
  itinerary: mockItinerary,
  selectedDestinationId: 'd1',

  setCurrentTrip: (id) => set({ currentTripId: id }),
  getCurrentTrip: () => {
    const { trips, currentTripId } = get();
    return trips.find((t) => t.id === currentTripId) ?? trips[0];
  },
  addTrip: (trip) =>
    set((s) => ({
      trips: [trip, ...s.trips],
      currentTripId: trip.id,
      draftTrip: null,
      draftMembers: mockMembers,
    })),
  setDraftTrip: (draft) => set({ draftTrip: draft }),
  setDraftMembers: (members) => set({ draftMembers: members }),
  addDraftMember: (m) =>
    set((s) => ({ draftMembers: [...s.draftMembers, m] })),
  updateBudget: (b) => set((s) => ({ budget: { ...s.budget, ...b } })),
  addExpense: (e) => set((s) => ({ expenses: [e, ...s.expenses] })),
  removeExpense: (id) =>
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
  updateItineraryActivity: (day, activityId, patch) =>
    set((s) => ({
      itinerary: s.itinerary.map((d) =>
        d.day === day
          ? {
              ...d,
              activities: d.activities.map((a) =>
                a.id === activityId ? { ...a, ...patch } : a
              ),
            }
          : d
      ),
    })),
  removeItineraryActivity: (day, activityId) =>
    set((s) => ({
      itinerary: s.itinerary.map((d) =>
        d.day === day
          ? {
              ...d,
              activities: d.activities.filter((a) => a.id !== activityId),
            }
          : d
      ),
    })),
  addItineraryActivity: (day, activity) =>
    set((s) => ({
      itinerary: s.itinerary.map((d) =>
        d.day === day ? { ...d, activities: [...d.activities, activity] } : d
      ),
    })),
  selectDestination: (id, name, image, estimatedCost) =>
    set((s) => {
      const newTrips = s.trips.map((t) =>
        t.id === s.currentTripId
          ? {
              ...t,
              destinationId: id,
              destinationName: name,
              image,
              budget: Math.max(t.budget, estimatedCost),
            }
          : t
      );
      return { selectedDestinationId: id, trips: newTrips };
    }),
}));

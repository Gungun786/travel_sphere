import type { ItineraryDay, BudgetBreakdown, Expense, Settlement } from '@/types';

export const mockItinerary: ItineraryDay[] = [
  {
    day: 1,
    title: 'Arrival · Fort Kochi',
    dailyCost: 9200,
    activities: [
      { id: 'a1', time: '08:00 AM', place: 'Breakfast', category: 'Food', duration: '45 min', cost: 600, distanceFromPrev: '—' },
      { id: 'a2', time: '09:30 AM', place: 'Fort Kochi Walk', category: 'Sightseeing', duration: '2 hrs', cost: 0, distanceFromPrev: '1.2 km' },
      { id: 'a3', time: '12:30 PM', place: 'Lunch at Oceanos', category: 'Food', duration: '1 hr', cost: 1800, distanceFromPrev: '0.8 km' },
      { id: 'a4', time: '02:00 PM', place: 'Mattancherry Palace', category: 'Heritage', duration: '1.5 hrs', cost: 200, distanceFromPrev: '2.1 km' },
      { id: 'a5', time: '05:00 PM', place: 'Sunset at Fort Kochi Beach', category: 'Beach', duration: '1 hr', cost: 0, distanceFromPrev: '1.5 km' },
      { id: 'a6', time: '07:30 PM', place: 'Dinner', category: 'Food', duration: '1.5 hrs', cost: 2200, distanceFromPrev: '0.6 km' },
    ],
  },
  {
    day: 2,
    title: 'Munnar Tea Hills',
    dailyCost: 11800,
    activities: [
      { id: 'b1', time: '07:00 AM', place: 'Drive to Munnar', category: 'Travel', duration: '4 hrs', cost: 3500, distanceFromPrev: '130 km' },
      { id: 'b2', time: '11:30 AM', place: 'Tea Museum', category: 'Heritage', duration: '1 hr', cost: 400, distanceFromPrev: '3 km' },
      { id: 'b3', time: '01:00 PM', place: 'Lunch', category: 'Food', duration: '1 hr', cost: 1500, distanceFromPrev: '1 km' },
      { id: 'b4', time: '03:00 PM', place: 'Eravikulam National Park', category: 'Wildlife', duration: '2 hrs', cost: 800, distanceFromPrev: '8 km' },
      { id: 'b5', time: '06:00 PM', place: 'Sunset Point', category: 'Nature', duration: '1 hr', cost: 0, distanceFromPrev: '5 km' },
      { id: 'b6', time: '08:00 PM', place: 'Dinner at Resort', category: 'Food', duration: '1.5 hrs', cost: 2400, distanceFromPrev: '2 km' },
    ],
  },
  {
    day: 3,
    title: 'Alleppey Backwaters',
    dailyCost: 14500,
    activities: [
      { id: 'c1', time: '07:30 AM', place: 'Drive to Alleppey', category: 'Travel', duration: '3.5 hrs', cost: 3200, distanceFromPrev: '110 km' },
      { id: 'c2', time: '11:00 AM', place: 'Board Houseboat', category: 'Stay', duration: '—', cost: 8000, distanceFromPrev: '—' },
      { id: 'c3', time: '01:00 PM', place: 'Lunch on Houseboat', category: 'Food', duration: '1 hr', cost: 1200, distanceFromPrev: '—' },
      { id: 'c4', time: '03:30 PM', place: 'Canoe through Backwaters', category: 'Nature', duration: '1.5 hrs', cost: 800, distanceFromPrev: '—' },
      { id: 'c5', time: '05:30 PM', place: 'Village Walk', category: 'Culture', duration: '1 hr', cost: 0, distanceFromPrev: '0.5 km' },
      { id: 'c6', time: '08:00 PM', place: 'Dinner on Houseboat', category: 'Food', duration: '1.5 hrs', cost: 1300, distanceFromPrev: '—' },
    ],
  },
  {
    day: 4,
    title: 'Departure · Kochi',
    dailyCost: 11300,
    activities: [
      { id: 'd1', time: '08:00 AM', place: 'Breakfast on Houseboat', category: 'Food', duration: '1 hr', cost: 600, distanceFromPrev: '—' },
      { id: 'd2', time: '10:00 AM', place: 'Disembark & Drive to Kochi', category: 'Travel', duration: '2 hrs', cost: 2800, distanceFromPrev: '55 km' },
      { id: 'd3', time: '12:30 PM', place: 'Lunch', category: 'Food', duration: '1 hr', cost: 1400, distanceFromPrev: '1 km' },
      { id: 'd4', time: '02:30 PM', place: 'Souvenir Shopping', category: 'Shopping', duration: '1.5 hrs', cost: 2500, distanceFromPrev: '0.5 km' },
      { id: 'd5', time: '05:00 PM', place: 'Marine Drive Walk', category: 'Sightseeing', duration: '1 hr', cost: 0, distanceFromPrev: '1 km' },
      { id: 'd6', time: '07:00 PM', place: 'Farewell Dinner', category: 'Food', duration: '1.5 hrs', cost: 2000, distanceFromPrev: '0.8 km' },
    ],
  },
];

export const mockBudget: BudgetBreakdown = {
  accommodation: { spent: 18000, allocated: 20000 },
  transportation: { spent: 12000, allocated: 12000 },
  food: { spent: 8500, allocated: 10000 },
  activities: { spent: 6300, allocated: 8000 },
  other: { spent: 2000, allocated: 5000 },
};

export const mockExpenses: Expense[] = [
  { id: 'e1', name: 'Dinner at Oceanos', category: 'Food', amount: 2500, paidBy: 'Gungun', splitBetween: 5, date: '2026-03-18', notes: 'Group dinner' },
  { id: 'e2', name: 'Taxi to Fort Kochi', category: 'Transport', amount: 1200, paidBy: 'Kanak', splitBetween: 5, date: '2026-03-18' },
  { id: 'e3', name: 'Hotel Booking', category: 'Stay', amount: 18000, paidBy: 'Divya', splitBetween: 5, date: '2026-03-18', notes: '2 nights, 3 rooms' },
  { id: 'e4', name: 'Houseboat', category: 'Activities', amount: 8000, paidBy: 'Monika', splitBetween: 5, date: '2026-03-20' },
  { id: 'e5', name: 'Breakfast', category: 'Food', amount: 600, paidBy: 'Kanan', splitBetween: 5, date: '2026-03-18' },
];

export const mockSettlements: Settlement[] = [
  { id: 's1', from: 'Kanan', to: 'Gungun', amount: 850, settled: false },
  { id: 's2', from: 'Divya', to: 'Kanak', amount: 420, settled: false },
  { id: 's3', from: 'Monika', to: 'Divya', amount: 1200, settled: false },
];

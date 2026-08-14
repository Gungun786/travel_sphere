import type { Trip } from '@/types';
import { mockMembers } from './mockMembers';

export const mockTrips: Trip[] = [
  {
    id: 'kerala-escape',
    name: 'Kerala Escape',
    destinationName: 'Kerala',
    destinationId: 'd1',
    image:
      'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1200',
    startDate: '2026-03-18',
    endDate: '2026-03-21',
    days: 4,
    travelers: 5,
    budget: 50000,
    perPerson: 10000,
    progress: 72,
    status: 'upcoming',
    travelStyle: 'Nature',
    members: mockMembers,
    createdAt: '2026-01-12',
  },
  {
    id: 'goa-weekend',
    name: 'Goa Weekend',
    destinationName: 'Goa',
    destinationId: 'd2',
    image:
      'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200',
    startDate: '2026-04-05',
    endDate: '2026-04-07',
    days: 3,
    travelers: 4,
    budget: 32000,
    perPerson: 8000,
    progress: 45,
    status: 'planning',
    travelStyle: 'Relaxed',
    members: mockMembers.slice(0, 4),
    createdAt: '2026-02-02',
  },
  {
    id: 'manali-expedition',
    name: 'Manali Expedition',
    destinationName: 'Manali',
    destinationId: 'd3',
    image:
      'https://images.pexels.com/photos/12716193/pexels-photo-12716193.jpeg?auto=compress&cs=tinysrgb&w=1200',
    startDate: '2026-05-22',
    endDate: '2026-05-27',
    days: 6,
    travelers: 5,
    budget: 68000,
    perPerson: 13600,
    progress: 20,
    status: 'planning',
    travelStyle: 'Adventure',
    members: mockMembers,
    createdAt: '2026-02-18',
  },
];

export const getTripById = (id: string) =>
  mockTrips.find((t) => t.id === id) ?? mockTrips[0];

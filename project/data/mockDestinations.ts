import type { Destination } from '@/types';

export const mockDestinations: Destination[] = [
  {
    id: 'd1',
    name: 'Kerala',
    state: 'Kerala, India',
    image:
      'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1200',
    match: 92,
    estimatedCost: 48500,
    temperature: '28°C',
    bestSeason: 'Sep – Mar',
    activities: ['Backwaters', 'Beaches', 'Ayurveda', 'Tea Gardens', 'Culture'],
    rating: 4.7,
    travelStyle: ['Nature', 'Relaxed', 'Cultural'],
    budgetLevel: 'Mid-range',
    seasonTags: ['Winter', 'Monsoon'],
    description:
      'Lush backwaters, palm-fringed beaches, and spice-scented hill stations.',
  },
  {
    id: 'd2',
    name: 'Goa',
    state: 'Goa, India',
    image:
      'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200',
    match: 86,
    estimatedCost: 32000,
    temperature: '30°C',
    bestSeason: 'Nov – Feb',
    activities: ['Beaches', 'Nightlife', 'Water Sports', 'Seafood', 'Markets'],
    rating: 4.5,
    travelStyle: ['Relaxed', 'Nightlife'],
    budgetLevel: 'Mid-range',
    seasonTags: ['Winter'],
    description:
      'Sun-soaked beaches, vibrant beach shacks, and Portuguese heritage towns.',
  },
  {
    id: 'd3',
    name: 'Manali',
    state: 'Himachal Pradesh',
    image:
      'https://images.pexels.com/photos/12716193/pexels-photo-12716193.jpeg?auto=compress&cs=tinysrgb&w=1200',
    match: 78,
    estimatedCost: 52000,
    temperature: '12°C',
    bestSeason: 'Mar – Jun',
    activities: ['Trekking', 'Skiing', 'Mountains', 'Cafes', 'Adventure'],
    rating: 4.6,
    travelStyle: ['Adventure', 'Nature'],
    budgetLevel: 'Mid-range',
    seasonTags: ['Summer', 'Winter'],
    description:
      'Snow-capped peaks, alpine forests, and gateway to the Spiti Valley.',
  },
  {
    id: 'd4',
    name: 'Jaipur',
    state: 'Rajasthan, India',
    image:
      'https://images.pexels.com/photos/14780020/pexels-photo-14780020.jpeg?auto=compress&cs=tinysrgb&w=1200',
    match: 74,
    estimatedCost: 36000,
    temperature: '22°C',
    bestSeason: 'Oct – Mar',
    activities: ['Forts', 'Palaces', 'Shopping', 'Food', 'Heritage'],
    rating: 4.5,
    travelStyle: ['Cultural', 'Luxury'],
    budgetLevel: 'Mid-range',
    seasonTags: ['Winter'],
    description:
      'The Pink City of grand forts, royal palaces, and bustling bazaars.',
  },
  {
    id: 'd5',
    name: 'Rishikesh',
    state: 'Uttarakhand, India',
    image:
      'https://images.pexels.com/photos/15970052/pexels-photo-15970052.jpeg?auto=compress&cs=tinysrgb&w=1200',
    match: 81,
    estimatedCost: 28000,
    temperature: '20°C',
    bestSeason: 'Sep – Apr',
    activities: ['Yoga', 'Rafting', 'Trekking', 'Ashrams', 'Ganges'],
    rating: 4.6,
    travelStyle: ['Adventure', 'Nature', 'Cultural'],
    budgetLevel: 'Budget',
    seasonTags: ['Winter', 'Spring'],
    description:
      'The yoga capital of the world on the banks of the holy Ganges.',
  },
  {
    id: 'd6',
    name: 'Meghalaya',
    state: 'Meghalaya, India',
    image:
      'https://images.pexels.com/photos/14379054/pexels-photo-14379054.jpeg?auto=compress&cs=tinysrgb&w=1200',
    match: 84,
    estimatedCost: 44000,
    temperature: '18°C',
    bestSeason: 'Oct – May',
    activities: ['Waterfalls', 'Caving', 'Living Roots', 'Trekking', 'Lakes'],
    rating: 4.8,
    travelStyle: ['Adventure', 'Nature'],
    budgetLevel: 'Mid-range',
    seasonTags: ['Winter', 'Spring'],
    description:
      'The abode of clouds — living root bridges, cascading falls, and misty valleys.',
  },
];

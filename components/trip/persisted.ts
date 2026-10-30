import { useEffect, useState } from 'react';
import { getTrip, type ApiTrip } from '@/lib/api';
import type { Member, Trip, TravelStyle } from '@/types';

export function inclusiveDays(start: string, end: string): number {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  return Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1
  );
}

export function apiTripToTrip(apiTrip: ApiTrip): Trip {
  const optimizedDestination = apiTrip.optimizer_result?.chosen ?? null;
  const destinationName = apiTrip.destination ?? optimizedDestination ?? 'To be decided';
  const members: Member[] = apiTrip.members.map((member, index) => ({
    id: String(member.id),
    name: member.name,
    email: '',
    avatarColor: index % 2 === 0 ? 'bg-ocean text-white' : 'bg-sunset text-white',
    initials: member.name.slice(0, 2),
    travelStyle: 'Relaxed',
    interests: member.interests as Member['interests'],
    food: [],
    accommodation: 'Mid-range',
    budgetPerPerson: member.budget_per_person,
  }));

  return {
    id: String(apiTrip.id),
    name: apiTrip.name,
    destinationName,
    destinationId: destinationName === 'To be decided' ? null : destinationName.toLowerCase().replace(/\s+/g, '-'),
    image: destinationName === 'To be decided' ? '' : `/destinations/${destinationName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    startDate: apiTrip.date_start,
    endDate: apiTrip.date_end,
    days: inclusiveDays(apiTrip.date_start, apiTrip.date_end),
    travelers: members.length,
    budget: apiTrip.budget_total,
    perPerson: Math.round(apiTrip.budget_total / Math.max(members.length, 1)),
    progress: 35,
    status: 'planning',
    travelStyle: 'Relaxed' as TravelStyle,
    members,
    createdAt: apiTrip.created_at.slice(0, 10),
    decideLater: apiTrip.decide_later,
    optimizerExplanation: apiTrip.optimizer_result?.explanation ?? null,
  };
}

export function usePersistedTrip(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    if (!/^[1-9]\d*$/.test(tripId)) {
      setTrip(null);
      setError(new Error('Trip not found.'));
      setLoading(false);
      return () => {
        active = false;
      };
    }
    setLoading(true);
    setError(null);
    getTrip(tripId)
      .then((response) => {
        if (active) setTrip(apiTripToTrip(response));
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason : new Error('Could not load trip.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tripId]);

  return { trip, loading, error };
}

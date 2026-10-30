import type { ApiDestination } from './api';
import type { Destination } from '@/types';

export function apiDestinationToDestination(
  destination: ApiDestination,
  index: number
): Destination {
  return {
    id: destination.slug ?? `${destination.name.toLowerCase()}-${index}`,
    slug: destination.slug ?? destination.name.toLowerCase().replace(/\s+/g, '-'),
    name: destination.name,
    state: destination.state,
    image: '',
    cost: destination.cost,
    bestSeason: destination.best_season,
    tags: destination.tags,
    topPlaces: destination.top_places,
    description: destination.description,
    aliases: destination.aliases,
    places: destination.places.map((place) => ({
      id: place.id,
      name: place.name,
      category: place.category,
      description: place.description,
      avgHours: place.avg_hours,
      entryCost: place.entry_cost,
    })),
  };
}

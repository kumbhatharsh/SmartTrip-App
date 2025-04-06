export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

export interface Flight {
  id: string;
  from: string;
  to: string;
  departureDate: string;
  arrivalDate: string;
  airline: string;
  price: number;
  duration: string;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  highlights: string[];
  startDate: string;
  endDate: string;
}

export const popularDestinations = [
  {
    id: '1',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&h=500',
  },
  {
    id: '2',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=500',
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&h=500',
  },
  {
    id: '4',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&h=500',
  },
];

export const popularHotels: Hotel[] = [
  {
    id: '1',
    name: 'Ocean View Resort & Spa',
    location: 'Bali, Indonesia',
    price: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&h=500',
    description: 'Luxury beachfront resort with stunning ocean views and world-class amenities.',
  },
  {
    id: '2',
    name: 'City Lights Boutique Hotel',
    location: 'Paris, France',
    price: 210,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&h=500',
    description: 'Elegant boutique hotel in the heart of Paris with easy access to major attractions.',
  },
  {
    id: '3',
    name: 'Mountain Retreat Lodge',
    location: 'Swiss Alps, Switzerland',
    price: 180,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&h=500',
    description: 'Cozy mountain lodge with breathtaking views of the Swiss Alps.',
  },
  {
    id: '4',
    name: 'Urban Oasis Hotel',
    location: 'New York, USA',
    price: 250,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=800&h=500',
    description: 'Modern hotel in the heart of Manhattan with luxurious amenities.',
  },
];

export const popularFlights: Flight[] = [
  {
    id: '1',
    from: 'London',
    to: 'New York',
    departureDate: '2025-06-10T08:30:00',
    arrivalDate: '2025-06-10T11:45:00',
    airline: 'British Airways',
    price: 450,
    duration: '7h 15m',
  },
  {
    id: '2',
    from: 'Paris',
    to: 'Tokyo',
    departureDate: '2025-06-15T10:00:00',
    arrivalDate: '2025-06-16T06:30:00',
    airline: 'Air France',
    price: 780,
    duration: '12h 30m',
  },
  {
    id: '3',
    from: 'Singapore',
    to: 'Sydney',
    departureDate: '2025-06-20T23:45:00',
    arrivalDate: '2025-06-21T09:30:00',
    airline: 'Singapore Airlines',
    price: 520,
    duration: '8h 45m',
  },
  {
    id: '4',
    from: 'Dubai',
    to: 'Rome',
    departureDate: '2025-06-18T14:20:00',
    arrivalDate: '2025-06-18T18:45:00',
    airline: 'Emirates',
    price: 380,
    duration: '6h 25m',
  },
];

export const popularItineraries: Itinerary[] = [
  {
    id: '1',
    title: 'Romantic Paris Getaway',
    destination: 'Paris, France',
    duration: '5 days',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=500',
    description: 'Experience the magic of Paris with this romantic 5-day itinerary covering all the iconic landmarks.',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre', 'Notre Dame Cathedral'],
    startDate: '2025-06-15',
    endDate: '2025-06-20',
  },
  {
    id: '2',
    title: 'Bali Beach Paradise',
    destination: 'Bali, Indonesia',
    duration: '7 days',
    price: 950,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&h=500',
    description: 'Relax and rejuvenate in the tropical paradise of Bali with beautiful beaches and cultural experiences.',
    highlights: ['Kuta Beach', 'Ubud Monkey Forest', 'Tanah Lot Temple', 'Mount Batur', 'Tegallalang Rice Terraces'],
    startDate: '2025-07-01',
    endDate: '2025-07-08',
  },
  {
    id: '3',
    title: 'New York City Explorer',
    destination: 'New York, USA',
    duration: '6 days',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&h=500',
    description: 'Discover the vibrant city of New York with this action-packed 6-day itinerary.',
    highlights: ['Times Square', 'Central Park', 'Statue of Liberty', 'Brooklyn Bridge', 'Empire State Building'],
    startDate: '2025-06-25',
    endDate: '2025-07-01',
  },
  {
    id: '4',
    title: 'Tokyo Cultural Experience',
    destination: 'Tokyo, Japan',
    duration: '8 days',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&h=500',
    description: 'Immerse yourself in the unique blend of traditional and modern culture in Tokyo.',
    highlights: ['Shibuya Crossing', 'Tokyo Skytree', 'Meiji Shrine', 'Akihabara', 'Shinjuku Gyoen Park'],
    startDate: '2025-07-15',
    endDate: '2025-07-23',
  },
];

export const weatherAlerts = [
  {
    id: '1',
    location: 'Bali, Indonesia',
    date: '2025-06-15',
    alert: 'Heavy rainfall expected',
    severity: 'moderate',
  },
  {
    id: '2',
    location: 'Paris, France',
    date: '2025-06-20',
    alert: 'Heatwave warning',
    severity: 'high',
  },
  {
    id: '3',
    location: 'New York, USA',
    date: '2025-06-18',
    alert: 'Thunderstorms in the afternoon',
    severity: 'moderate',
  },
];

export const localEvents = [
  {
    id: '1',
    name: 'Paris Fashion Week',
    location: 'Paris, France',
    date: '2025-06-22',
    description: 'The world-famous fashion event featuring top designers.',
  },
  {
    id: '2',
    name: 'Bali Arts Festival',
    location: 'Bali, Indonesia',
    date: '2025-06-15',
    description: 'Annual festival showcasing Balinese arts and culture.',
  },
  {
    id: '3',
    name: 'New York Film Festival',
    location: 'New York, USA',
    date: '2025-06-25',
    description: 'Premiere screenings of new films from around the world.',
  },
];

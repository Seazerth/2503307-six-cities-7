export type Offer = {
  id: string;
  city: string;
  image: string;
  images: string[];
  price: number;
  title: string;
  type: string;
  rating: number;
  bedrooms: number;
  maxAdults: number;
  isPremium?: boolean;
  isFavorite?: boolean;
};

const offers: Offer[] = [
  {
    id: 'beautiful-luxurious-apartment',
    city: 'Amsterdam',
    image: 'apartment-01.jpg',
    images: ['room.jpg', 'apartment-01.jpg', 'apartment-02.jpg'],
    price: 120,
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    rating: 4.8,
    bedrooms: 3,
    maxAdults: 4,
    isPremium: true,
  },
  {
    id: 'wood-and-stone-place',
    city: 'Amsterdam',
    image: 'room.jpg',
    images: ['room.jpg', 'studio-01.jpg'],
    price: 80,
    title: 'Wood and stone place',
    type: 'Room',
    rating: 4.1,
    bedrooms: 1,
    maxAdults: 2,
    isFavorite: true,
  },
  {
    id: 'canal-view-prinsengracht',
    city: 'Amsterdam',
    image: 'apartment-02.jpg',
    images: ['apartment-02.jpg', 'apartment-03.jpg'],
    price: 132,
    title: 'Canal View Prinsengracht',
    type: 'Apartment',
    rating: 4.6,
    bedrooms: 2,
    maxAdults: 3,
  },
  {
    id: 'nice-cozy-warm-apartment',
    city: 'Amsterdam',
    image: 'apartment-03.jpg',
    images: ['apartment-03.jpg', 'apartment-01.jpg'],
    price: 180,
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    rating: 4.9,
    bedrooms: 2,
    maxAdults: 4,
    isPremium: true,
    isFavorite: true,
  },
];

export default offers;

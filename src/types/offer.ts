export type OfferLocation = {
  latitude: number;
  longitude: number;
};

export type Offer = {
  id: string;
  city: string;
  location: OfferLocation;
  image: string;
  images: string[];
  price: number;
  title: string;
  type: string;
  rating: number;
  bedrooms: number;
  maxAdults: number;
  isPremium: boolean;
  isFavorite: boolean;
};

export type ApiOffer = Omit<Offer, 'city' | 'image' | 'images'> & {
  city: {
    name: string;
  };
  previewImage: string;
  images?: string[];
};

export type OfferLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type CityLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type Host = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

export type Offer = {
  id: string;
  city: string;
  cityLocation: CityLocation;
  location: OfferLocation;
  image: string;
  images: string[];
  price: number;
  title: string;
  type: string;
  rating: number;
  bedrooms?: number;
  maxAdults?: number;
  description?: string;
  goods?: string[];
  host?: Host;
  isPremium: boolean;
  isFavorite: boolean;
};

export type ApiOffer = Omit<Offer, 'city' | 'cityLocation' | 'image' | 'images'> & {
  city: {
    name: string;
    location: CityLocation;
  };
  previewImage?: string;
  images?: string[];
};

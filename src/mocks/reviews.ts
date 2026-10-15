export type Review = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
};

const reviews: Review[] = [
  {
    id: 'amsterdam-review-max',
    date: '2025-04-24T12:00:00.000Z',
    user: {
      name: 'Max',
      avatarUrl: 'avatar-max.jpg',
      isPro: false,
    },
    comment: 'A quiet, cozy and picturesque place with a beautiful view over Amsterdam. The apartment was clean and comfortable.',
    rating: 4,
  },
  {
    id: 'amsterdam-review-angelina',
    date: '2025-03-15T12:00:00.000Z',
    user: {
      name: 'Angelina',
      avatarUrl: 'avatar-angelina.jpg',
      isPro: true,
    },
    comment: 'We had a lovely stay. The location is convenient, the apartment is well equipped, and the host was very helpful.',
    rating: 5,
  },
  {
    id: 'amsterdam-review-jack',
    date: '2025-02-08T12:00:00.000Z',
    user: {
      name: 'Jack',
      avatarUrl: 'avatar.svg',
      isPro: false,
    },
    comment: 'Great value for money and easy to reach from the city centre. I would happily stay here again.',
    rating: 4,
  },
];

export default reviews;

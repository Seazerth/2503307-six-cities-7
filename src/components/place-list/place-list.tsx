import {memo} from 'react';
import PlaceCard from '../place-card/place-card';
import type {Offer} from '../../types/offer';

type PlaceListProps = {
  offers: Offer[];
  onOfferHover: (offerId: string | null) => void;
};

const PlaceList = memo(({offers, onOfferHover}: PlaceListProps) => (
  <div className="cities__places-list places__list tabs__content">
    {offers.map((offer) => <PlaceCard offer={offer} key={offer.id} onOfferHover={onOfferHover} />)}
  </div>
));

PlaceList.displayName = 'PlaceList';
export default PlaceList;

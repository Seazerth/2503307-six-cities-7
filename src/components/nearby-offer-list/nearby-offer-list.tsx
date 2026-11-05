import {memo} from 'react';
import PlaceCard from '../place-card/place-card';
import type {Offer} from '../../types/offer';

type NearbyOfferListProps = {
  offers: Offer[];
};

const NearbyOfferList = memo(({offers}: NearbyOfferListProps) => (
  <div className="near-places__list places__list">
    {offers.map((offer) => (
      <PlaceCard
        offer={offer}
        cardClassName="near-places__card"
        imageWrapperClassName="near-places__image-wrapper"
        key={offer.id}
      />
    ))}
  </div>
));

NearbyOfferList.displayName = 'NearbyOfferList';
export default NearbyOfferList;

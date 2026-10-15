import PlaceCard from '../place-card/place-card';
import type {Offer} from '../../mocks/offers';

type NearbyOfferListProps = {
  offers: Offer[];
};

function NearbyOfferList({offers}: NearbyOfferListProps) {
  return (
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
  );
}

export default NearbyOfferList;

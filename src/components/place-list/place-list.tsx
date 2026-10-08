import PlaceCard from '../place-card/place-card';
import {Offer} from '../../mocks/offers';

type PlaceListProps = {
  offers: Offer[];
  onOfferHover: (offerId: string) => void;
};

function PlaceList({offers, onOfferHover}: PlaceListProps) {
  return <div className="cities__places-list places__list tabs__content">{offers.map((offer) => <PlaceCard offer={offer} key={offer.id} onMouseEnter={() => onOfferHover(offer.id)} />)}</div>;
}

export default PlaceList;

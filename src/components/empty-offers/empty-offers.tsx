import {memo} from 'react';

type EmptyOffersProps = {
  city: string;
};

const EmptyOffers = memo(({city}: EmptyOffersProps) => (
  <section className="cities__no-places">
    <div className="cities__status-wrapper tabs__content">
      <b className="cities__status">No places to stay available</b>
      <p className="cities__status-description">
        We could not find any property available at the moment in {city}
      </p>
    </div>
  </section>
));

EmptyOffers.displayName = 'EmptyOffers';

export default EmptyOffers;

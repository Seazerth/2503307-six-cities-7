import {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link, Navigate, useParams} from 'react-router-dom';
import CityMap from '../../components/map/map';
import NearbyOfferList from '../../components/nearby-offer-list/nearby-offer-list';
import ReviewList from '../../components/review-list/review-list';
import ReviewForm from '../../components/review-form/review-form';
import FavoriteButton from '../../components/favorite-button/favorite-button';
import Spinner from '../../components/spinner/spinner';
import {DEFAULT_MAP_CENTER, RATING_PERCENTAGE_FACTOR} from '../../constants';
import {AuthorizationStatus} from '../../store/authorization-status';
import type {AppDispatch, RootState} from '../../store';
import {fetchOfferData} from '../../store/action';
import {
  selectActiveOffer,
  selectAuthorizationStatus,
  selectIsOfferDataLoading,
  selectIsOfferNotFound,
  selectNearbyOffers,
  selectOfferDataError,
  selectOfferDataId,
  selectRawActiveOffer,
  selectRawNearbyOffers,
  selectSortedReviews,
} from '../../store/selectors';

const MAX_NEARBY_OFFERS = 3;
const MAX_REVIEWS = 10;
const MAX_GALLERY_IMAGES = 6;

function OfferPage() {
  const {id} = useParams<{id: string}>();
  const dispatch = useDispatch<AppDispatch>();
  const offer = useSelector((state: RootState) => selectActiveOffer(state));
  const nearbyOffers = useSelector((state: RootState) => selectNearbyOffers(state));
  const rawOffer = useSelector((state: RootState) => selectRawActiveOffer(state));
  const rawNearbyOffers = useSelector((state: RootState) => selectRawNearbyOffers(state));
  const sortedReviews = useSelector((state: RootState) => selectSortedReviews(state));
  const offerDataId = useSelector((state: RootState) => selectOfferDataId(state));
  const isOfferDataLoading = useSelector((state: RootState) => selectIsOfferDataLoading(state));
  const offerDataError = useSelector((state: RootState) => selectOfferDataError(state));
  const isOfferNotFound = useSelector((state: RootState) => selectIsOfferNotFound(state));
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));
  const displayedNearbyOffers = useMemo(() => nearbyOffers.slice(0, MAX_NEARBY_OFFERS), [nearbyOffers]);
  const displayedReviews = useMemo(() => sortedReviews.slice(0, MAX_REVIEWS), [sortedReviews]);
  const mapOffers = useMemo(() => rawOffer ? [rawOffer, ...rawNearbyOffers.slice(0, MAX_NEARBY_OFFERS)] : [], [rawNearbyOffers, rawOffer]);
  const offerLatitude = offer?.cityLocation.latitude;
  const offerLongitude = offer?.cityLocation.longitude;
  const mapCenter = useMemo<[number, number]>(
    () => offerLatitude !== undefined && offerLongitude !== undefined
      ? [offerLatitude, offerLongitude]
      : DEFAULT_MAP_CENTER,
    [offerLatitude, offerLongitude]
  );

  useEffect(() => {
    if (id) {
      void dispatch(fetchOfferData(id));
    }
  }, [dispatch, id]);

  if (!id || (offerDataId === id && isOfferNotFound)) {
    return <Navigate to="/404" replace />;
  }

  if (offerDataId !== id || isOfferDataLoading) {
    return <Spinner />;
  }

  if (offerDataError || !offer) {
    return (
      <main className="page__main">
        <p role="alert">{offerDataError ?? 'Could not load this offer.'}</p>
        <Link to="/">Return to the main page</Link>
      </main>
    );
  }

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <div className="offer__gallery-container container">
          <div className="offer__gallery">
            {offer.images.slice(0, MAX_GALLERY_IMAGES).map((image) => (
              <div className="offer__image-wrapper" key={image}>
                <img className="offer__image" src={image} alt={offer.title} />
              </div>
            ))}
          </div>
        </div>
        <div className="offer__container container">
          <div className="offer__wrapper">
            {offer.isPremium && <div className="offer__mark"><span>Premium</span></div>}
            <div className="offer__name-wrapper">
              <h1 className="offer__name">{offer.title}</h1>
              <FavoriteButton
                offerId={offer.id}
                isFavorite={offer.isFavorite}
                className="offer__bookmark-button"
                iconClassName="offer__bookmark-icon"
                iconWidth={31}
                iconHeight={33}
              />
            </div>
            <div className="offer__rating rating">
              <div className="offer__stars rating__stars"><span style={{width: `${Math.round(offer.rating) * RATING_PERCENTAGE_FACTOR}%`}} /></div>
              <span className="offer__rating-value rating__value">{offer.rating}</span>
            </div>
            <ul className="offer__features">
              <li className="offer__feature offer__feature--entire">
                {offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}
              </li>
              {offer.bedrooms !== undefined && (
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} {offer.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </li>
              )}
              {offer.maxAdults !== undefined && (
                <li className="offer__feature offer__feature--adults">
                    Max {offer.maxAdults} {offer.maxAdults === 1 ? 'adult' : 'adults'}
                </li>
              )}
            </ul>
            <div className="offer__price">
              <b className="offer__price-value">&euro;{offer.price}</b>
              <span className="offer__price-text"> night</span>
            </div>
            <div className="offer__inside">
              <h2 className="offer__inside-title">What&apos;s inside</h2>
              <ul className="offer__inside-list">
                {offer.goods?.map((good) => <li className="offer__inside-item" key={good}>{good}</li>)}
              </ul>
            </div>
            {offer.host && (
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper user__avatar-wrapper${offer.host.isPro ? ' offer__avatar-wrapper--pro' : ''}`}>
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt={`${offer.host.name}'s avatar`} />
                  </div>
                  <span className="offer__user-name">{offer.host.name}</span>
                  {offer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
              </div>
            )}
            {offer.description && (
              <div className="offer__description">
                <p className="offer__text">{offer.description}</p>
              </div>
            )}
            <section className="offer__reviews reviews">
              <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{sortedReviews.length}</span></h2>
              <ReviewList reviews={displayedReviews} />
              {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={offer.id} />}
            </section>
          </div>
        </div>
        <CityMap
          offers={mapOffers}
          activeOfferId={offer.id}
          center={mapCenter}
          zoom={offer.cityLocation.zoom}
          mapClassName="offer__map map"
        />
      </section>
      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">Other places in the neighbourhood</h2>
          <NearbyOfferList offers={displayedNearbyOffers} />
        </section>
      </div>
    </main>
  );
}

export default OfferPage;

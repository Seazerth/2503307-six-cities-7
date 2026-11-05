import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSearchParams} from 'react-router-dom';
import CityMap from '../../components/map/map';
import CityList from '../../components/city-list/city-list';
import EmptyOffers from '../../components/empty-offers/empty-offers';
import PlaceList from '../../components/place-list/place-list';
import SortOptions from '../../components/sort-options/sort-options';
import {SortType} from '../../components/sort-options/sort-type';
import {CITIES} from '../../mocks/cities';
import type {Offer} from '../../types/offer';
import {changeCity} from '../../store/action';
import type {AppDispatch, RootState} from '../../store';
import Spinner from '../../components/spinner/spinner';
import {selectCity, selectIsOffersDataLoading, selectOffersForCity, selectOffersLoadingError, selectRawOffersForCity} from '../../store/selectors';

function getSortedOffers(offers: Offer[], sortType: SortType): Offer[] {
  switch (sortType) {
    case SortType.PriceLowToHigh:
      return [...offers].sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price);
    case SortType.PriceHighToLow:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.price - firstOffer.price);
    case SortType.TopRatedFirst:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.rating - firstOffer.rating);
    case SortType.Popular:
      return offers;
  }
}

function MainPage() {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [sortType, setSortType] = useState(SortType.Popular);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const activeCity = useSelector((state: RootState) => selectCity(state));
  const cityOffers = useSelector((state: RootState) => selectOffersForCity(state));
  const rawCityOffers = useSelector((state: RootState) => selectRawOffersForCity(state));
  const isOffersDataLoading = useSelector((state: RootState) => selectIsOffersDataLoading(state));
  const offersLoadingError = useSelector((state: RootState) => selectOffersLoadingError(state));
  const sortedOffers = useMemo(() => getSortedOffers(cityOffers, sortType), [cityOffers, sortType]);
  const cityLocation = rawCityOffers[0]?.cityLocation;
  const cityLatitude = cityLocation?.latitude;
  const cityLongitude = cityLocation?.longitude;
  const mapCenter = useMemo<[number, number]>(
    () => cityLatitude !== undefined && cityLongitude !== undefined
      ? [cityLatitude, cityLongitude]
      : [48.85661, 2.351499],
    [cityLatitude, cityLongitude]
  );

  useEffect(() => {
    const cityFromUrl = searchParams.get('city');
    if (cityFromUrl && CITIES.includes(cityFromUrl) && cityFromUrl !== activeCity) {
      dispatch(changeCity(cityFromUrl));
    }
  }, [activeCity, dispatch, searchParams]);

  const handleCityChange = useCallback((city: string) => {
    dispatch(changeCity(city));
    setSearchParams({city});
  }, [dispatch, setSearchParams]);

  const handleOfferHover = useCallback((offerId: string) => {
    setActiveOfferId(offerId);
  }, []);

  return (
    <div className="page page--gray page--main">
      <main className={`page__main page__main--index${!isOffersDataLoading && !offersLoadingError && cityOffers.length === 0 ? ' page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CityList cities={CITIES} activeCity={activeCity} onCityChange={handleCityChange} />
          </section>
        </div>
        <div className="cities">
          <div className={`cities__places-container${!isOffersDataLoading && !offersLoadingError && cityOffers.length === 0 ? ' cities__places-container--empty' : ''} container`}>
            {isOffersDataLoading && <section className="cities__places places"><Spinner /></section>}
            {!isOffersDataLoading && offersLoadingError && <section className="cities__places places"><p role="alert">Could not load offers: {offersLoadingError}</p></section>}
            {!isOffersDataLoading && !offersLoadingError && cityOffers.length === 0 && (
              <EmptyOffers city={activeCity} />
            )}
            {!isOffersDataLoading && !offersLoadingError && cityOffers.length > 0 && (
              <section className="cities__places places" data-active-offer={activeOfferId ?? undefined}>
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{cityOffers.length} places to stay in {activeCity}</b>
                <SortOptions sortType={sortType} onSortChange={setSortType} />
                <PlaceList offers={sortedOffers} onOfferHover={handleOfferHover} />
              </section>
            )}
            {cityOffers.length > 0 && (
              <div className="cities__right-section">
                <CityMap
                  offers={rawCityOffers}
                  activeOfferId={activeOfferId}
                  center={mapCenter}
                  zoom={cityLocation?.zoom ?? 13}
                />
              </div>
            )}
            {cityOffers.length === 0 && <div className="cities__right-section" />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

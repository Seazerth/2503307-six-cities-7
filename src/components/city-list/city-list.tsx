import {memo} from 'react';
import {Link} from 'react-router-dom';

type CityListProps = {
  cities: string[];
  activeCity: string;
  onCityChange: (city: string) => void;
};

const CityList = memo(({cities, activeCity, onCityChange}: CityListProps) => (
  <ul className="locations__list tabs__list">
    {cities.map((city) => {
      const handleCityLinkClick = () => onCityChange(city);

      return (
        <li className="locations__item" key={city}>
          <Link
            className={`locations__item-link tabs__item${city === activeCity ? ' tabs__item--active' : ''}`}
            to={`/?city=${encodeURIComponent(city)}`}
            onClick={handleCityLinkClick}
          >
            <span>{city}</span>
          </Link>
        </li>
      );
    })}
  </ul>
));

CityList.displayName = 'CityList';
export default CityList;

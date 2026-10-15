import {Link} from 'react-router-dom';

type CityListProps = {
  cities: string[];
  activeCity: string;
  onCityChange: (city: string) => void;
};

function CityList({cities, activeCity, onCityChange}: CityListProps) {
  return (
    <ul className="locations__list tabs__list">
      {cities.map((city) => (
        <li className="locations__item" key={city}>
          <Link
            className={`locations__item-link tabs__item${city === activeCity ? ' tabs__item--active' : ''}`}
            to={`/?city=${encodeURIComponent(city)}`}
            onClick={() => onCityChange(city)}
          >
            <span>{city}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default CityList;

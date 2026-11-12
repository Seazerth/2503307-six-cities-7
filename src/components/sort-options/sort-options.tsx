import {memo, useState} from 'react';
import type {KeyboardEvent} from 'react';
import {SortType} from './sort-type';

const SORT_TYPES = Object.values(SortType);

type SortOptionsProps = {
  sortType: SortType;
  onSortChange: (sortType: SortType) => void;
};

const SortOptions = memo(({sortType, onSortChange}: SortOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortToggleClick = () => {
    setIsOpen((isMenuOpen) => !isMenuOpen);
  };

  const handleSortOptionClick = (option: SortType) => {
    onSortChange(option);
    setIsOpen(false);
  };

  const handleSortOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, option: SortType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSortOptionClick(option);
    }
  };

  const handleSortToggleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSortToggleClick();
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="places__sorting">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={handleSortToggleClick}
        onKeyDown={handleSortToggleKeyDown}
      >
        {sortType}
        <svg className="places__sorting-arrow" width="7" height="4"><use xlinkHref="#icon-arrow-select" /></svg>
      </span>
      <ul className={`places__options places__options--custom${isOpen ? ' places__options--opened' : ''}`} role="listbox">
        {SORT_TYPES.map((option) => {
          const handleSortOptionClickEvent = () => handleSortOptionClick(option);
          const handleSortOptionKeyDownEvent = (event: KeyboardEvent<HTMLLIElement>) => {
            handleSortOptionKeyDown(event, option);
          };

          return (
            <li
              className={`places__option${option === sortType ? ' places__option--active' : ''}`}
              key={option}
              role="option"
              aria-selected={option === sortType}
              tabIndex={0}
              onClick={handleSortOptionClickEvent}
              onKeyDown={handleSortOptionKeyDownEvent}
            >
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

SortOptions.displayName = 'SortOptions';
export default SortOptions;

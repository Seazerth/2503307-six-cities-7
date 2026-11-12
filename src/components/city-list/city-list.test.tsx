import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {renderWithProviders} from '../../test-utils';
import CityList from './city-list';

describe('CityList', () => {
  it('renders each city and marks the active city', () => {
    renderWithProviders(
      <CityList cities={['Paris', 'Amsterdam']} activeCity="Amsterdam" onCityChange={vi.fn()} />
    );

    expect(screen.getByRole('link', {name: 'Paris'})).toHaveAttribute('href', '/?city=Paris');
    expect(screen.getByRole('link', {name: 'Amsterdam'})).toHaveClass('tabs__item--active');
  });

  it('calls the city selection callback when a city link is clicked', async () => {
    const user = userEvent.setup();
    const onCityChange = vi.fn();
    renderWithProviders(
      <CityList cities={['Paris', 'Amsterdam']} activeCity="Paris" onCityChange={onCityChange} />
    );

    await user.click(screen.getByRole('link', {name: 'Amsterdam'}));

    expect(onCityChange).toHaveBeenCalledWith('Amsterdam');
  });
});

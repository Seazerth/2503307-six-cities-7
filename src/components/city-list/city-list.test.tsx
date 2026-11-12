import {screen} from '@testing-library/react';
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
});

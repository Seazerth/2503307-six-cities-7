import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithProviders} from '../../test-utils';
import Header from './header';

describe('Header', () => {
  it('renders the logo and sign-in link for a guest', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('link', {name: '6 cities logo'})).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', {name: 'Sign in'})).toHaveAttribute('href', '/login');
  });
});

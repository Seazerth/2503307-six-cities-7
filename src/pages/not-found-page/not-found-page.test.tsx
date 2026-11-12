import {screen, render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {describe, expect, it} from 'vitest';
import NotFoundPage from './not-found-page';

describe('NotFoundPage', () => {
  it('renders the not-found message and home link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', {name: '404 Not Found'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Go to the main page'})).toHaveAttribute('href', '/');
  });
});

import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {renderWithProviders} from '../../test-utils';
import ReviewForm from './review-form';

describe('ReviewForm', () => {
  it('renders rating choices, review input and submit guidance', () => {
    renderWithProviders(<ReviewForm offerId="offer-1" />);

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'Your review'})).toHaveAttribute('minLength', '50');
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
    expect(screen.getByText('50 characters')).toBeInTheDocument();
  });
});

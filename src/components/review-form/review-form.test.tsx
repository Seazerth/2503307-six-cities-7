import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import api from '../../services/api';
import {setOfferDataLoading} from '../../store/action';
import {createTestStore, renderWithProviders, testReview} from '../../test-utils';
import ReviewForm from './review-form';

describe('ReviewForm', () => {
  const mockApi = new MockAdapter(api);

  beforeEach(() => {
    mockApi.reset();
  });

  afterEach(() => {
    mockApi.reset();
  });

  it('renders rating choices, review input and submit guidance', () => {
    renderWithProviders(<ReviewForm offerId="offer-1" />);

    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'Your review'})).toHaveAttribute('minLength', '50');
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
    expect(screen.getByText('50 characters')).toBeInTheDocument();
  });

  it('submits the selected rating and review and resets after success', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(setOfferDataLoading('offer-1'));
    mockApi.onPost('/comments/offer-1').reply(200, testReview);
    renderWithProviders(<ReviewForm offerId="offer-1" />, {store});

    await user.click(screen.getByTitle('5 stars'));
    await user.type(
      screen.getByRole('textbox', {name: 'Your review'}),
      'A thoughtful review with more than fifty characters to satisfy the form validation.'
    );
    await user.click(screen.getByRole('button', {name: 'Submit'}));

    await waitFor(() => {
      expect(store.getState().offer.reviews).toEqual([testReview]);
    });
    expect(screen.getByRole('textbox', {name: 'Your review'})).toHaveValue('');
    expect(screen.getByDisplayValue('5')).not.toBeChecked();
  });

  it('shows an error and keeps the review text when the server rejects the submission', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(setOfferDataLoading('offer-1'));
    mockApi.onPost('/comments/offer-1').reply(400, {message: 'Invalid review'});
    renderWithProviders(<ReviewForm offerId="offer-1" />, {store});
    const reviewText = 'A thoughtful review with more than fifty characters to satisfy the form validation.';

    await user.click(screen.getByTitle('5 stars'));
    await user.type(screen.getByRole('textbox', {name: 'Your review'}), reviewText);
    await user.click(screen.getByRole('button', {name: 'Submit'}));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid review');
    expect(screen.getByRole('textbox', {name: 'Your review'})).toHaveValue(reviewText);
  });
});

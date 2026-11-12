import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {testReview} from '../../test-utils';
import ReviewList from './review-list';

describe('ReviewList', () => {
  it('renders all reviews', () => {
    const reviews = [testReview, {...testReview, id: 'review-2', comment: 'Another review.'}];
    render(<ReviewList reviews={reviews} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText(testReview.comment)).toBeInTheDocument();
    expect(screen.getByText('Another review.')).toBeInTheDocument();
  });
});

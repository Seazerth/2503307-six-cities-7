import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {testReview} from '../../test-utils';
import ReviewItem from './review-item';

describe('ReviewItem', () => {
  it('renders review author, comment, rating and date', () => {
    render(<ReviewItem review={testReview} />);

    expect(screen.getByText(testReview.user.name)).toBeInTheDocument();
    expect(screen.getByText(testReview.comment)).toBeInTheDocument();
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByRole('img', {name: 'Alex\'s avatar'})).toHaveAttribute('src', testReview.user.avatarUrl);
  });
});

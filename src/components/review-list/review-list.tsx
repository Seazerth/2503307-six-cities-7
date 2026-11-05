import {memo} from 'react';
import ReviewItem from '../review-item/review-item';
import type {Review} from '../../types/review';

type ReviewListProps = {
  reviews: Review[];
};

const ReviewList = memo(({reviews}: ReviewListProps) => (
  <ul className="reviews__list">
    {reviews.map((review) => <ReviewItem review={review} key={review.id} />)}
  </ul>
));

ReviewList.displayName = 'ReviewList';
export default ReviewList;

import {useState} from 'react';
import type {ChangeEvent, FormEvent} from 'react';

const MIN_REVIEW_LENGTH = 50;
const RATINGS = [5, 4, 3, 2, 1];

function ReviewForm() {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const isValid = rating !== '' && review.length >= MIN_REVIEW_LENGTH;

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid) {
      setReview('');
      setRating('');
    }
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {RATINGS.map((value) => (
          <span key={value}>
            <input className="form__rating-input visually-hidden" name="rating" value={value} id={`${value}-stars`} type="radio" checked={rating === String(value)} onChange={handleRatingChange} />
            <label htmlFor={`${value}-stars`} className="reviews__rating-label form__rating-label" title={`${value} stars`}><svg className="form__star-image" width="37" height="33"><use xlinkHref="#icon-star" /></svg></label>
          </span>
        ))}
      </div>
      <textarea className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved" value={review} onChange={handleReviewChange} />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{MIN_REVIEW_LENGTH} characters</b>.</p>
        <button className="reviews__submit form__submit button" type="submit" disabled={!isValid}>Submit</button>
      </div>
    </form>
  );
}

export default ReviewForm;

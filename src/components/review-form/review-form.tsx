import {useState} from 'react';
import type {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../../store';
import {postReview} from '../../store/action';
import {selectIsReviewSending, selectReviewSendingError} from '../../store/selectors';

const MIN_REVIEW_LENGTH = 50;
const MAX_REVIEW_LENGTH = 300;
const RATINGS = [5, 4, 3, 2, 1];

type ReviewFormProps = {
  offerId: string;
};

function ReviewForm({offerId}: ReviewFormProps) {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isSending = useSelector((state: RootState) => selectIsReviewSending(state));
  const sendingError = useSelector((state: RootState) => selectReviewSendingError(state));
  const isValid = rating !== ''
    && review.length >= MIN_REVIEW_LENGTH
    && review.length <= MAX_REVIEW_LENGTH;

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isSending) {
      return;
    }

    const isSubmitted = await dispatch(postReview({
      offerId,
      comment: review,
      rating: Number(rating),
    }));

    if (isSubmitted) {
      setReview('');
      setRating('');
    }
  };

  return (
    <form
      className="reviews__form form"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {RATINGS.map((value) => (
          <span key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              checked={rating === String(value)}
              onChange={handleRatingChange}
              disabled={isSending}
            />
            <label htmlFor={`${value}-stars`} className="reviews__rating-label form__rating-label" title={`${value} stars`}>
              <svg className="form__star-image" width="37" height="33"><use xlinkHref="#icon-star" /></svg>
            </label>
          </span>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={review}
        onChange={handleReviewChange}
        minLength={MIN_REVIEW_LENGTH}
        maxLength={MAX_REVIEW_LENGTH}
        disabled={isSending}
      />
      {sendingError && <p role="alert">{sendingError}</p>}
      <div className="reviews__button-wrapper">
        <p className="reviews__help">To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{MIN_REVIEW_LENGTH} characters</b>.</p>
        <button className="reviews__submit form__submit button" type="submit" disabled={!isValid || isSending}>
          {isSending ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;

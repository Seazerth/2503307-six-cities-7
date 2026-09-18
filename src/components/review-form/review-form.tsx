import {FormEvent, useState} from 'react';

function ReviewForm() {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const isValid = rating !== '' && review.length >= 50;

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
        {[5, 4, 3, 2, 1].map((value) => <span key={value}><input className="form__rating-input visually-hidden" name="rating" value={value} id={`${value}-stars`} type="radio" checked={rating === String(value)} onChange={(event) => setRating(event.target.value)} /><label htmlFor={`${value}-stars`} className="reviews__rating-label form__rating-label" title={`${value} stars`}><svg className="form__star-image" width="37" height="33"><use xlinkHref="#icon-star" /></svg></label></span>)}
      </div>
      <textarea className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved" value={review} onChange={(event) => setReview(event.target.value)} />
      <div className="reviews__button-wrapper"><p className="reviews__help">To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.</p><button className="reviews__submit form__submit button" type="submit" disabled={!isValid}>Submit</button></div>
    </form>
  );
}

export default ReviewForm;

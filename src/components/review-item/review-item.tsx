import type {Review} from '../../mocks/reviews';

type ReviewItemProps = {
  review: Review;
};

function ReviewItem({review}: ReviewItemProps) {
  const reviewDate = new Date(review.date);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(reviewDate);

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className={`reviews__avatar-wrapper user__avatar-wrapper${review.user.isPro ? ' reviews__avatar-wrapper--pro' : ''}`}>
          <img className="reviews__avatar user__avatar" src={`img/${review.user.avatarUrl}`} width="54" height="54" alt={`${review.user.name}'s avatar`} />
        </div>
        <span className="reviews__user-name">{review.user.name}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{width: `${review.rating * 20}%`}} />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{review.comment}</p>
        <time className="reviews__time" dateTime={review.date}>{formattedDate}</time>
      </div>
    </li>
  );
}

export default ReviewItem;

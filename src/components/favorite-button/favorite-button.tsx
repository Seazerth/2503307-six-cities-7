import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import type {AppDispatch, RootState} from '../../store';
import {AuthorizationStatus} from '../../store/authorization-status';
import {toggleFavorite} from '../../store/action';
import {selectAuthorizationStatus} from '../../store/selectors';

type FavoriteButtonProps = {
  offerId: string;
  isFavorite: boolean;
  className: string;
  iconClassName: string;
  iconWidth: number;
  iconHeight: number;
};

function FavoriteButton({offerId, isFavorite, className, iconClassName, iconWidth, iconHeight}: FavoriteButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));

  const handleFavoriteButtonClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate('/login');
      return;
    }

    void dispatch(toggleFavorite(offerId));
  };

  return (
    <button
      className={`${className}${isFavorite ? ` ${className}--active` : ''} button`}
      type="button"
      aria-pressed={isFavorite}
      onClick={handleFavoriteButtonClick}
    >
      <svg className={iconClassName} width={iconWidth} height={iconHeight}>
        <use xlinkHref="#icon-bookmark" />
      </svg>
      <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
    </button>
  );
}

export default FavoriteButton;

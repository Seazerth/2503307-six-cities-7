import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../../store';
import {logout} from '../../store/action';
import {AuthorizationStatus} from '../../store/authorization-status';
import {
  selectAuthorizationError,
  selectAuthorizationStatus,
  selectFavoriteCount,
  selectFavoriteError,
  selectUserEmail,
} from '../../store/selectors';

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));
  const userEmail = useSelector((state: RootState) => selectUserEmail(state));
  const favoriteCount = useSelector((state: RootState) => selectFavoriteCount(state));
  const authorizationError = useSelector((state: RootState) => selectAuthorizationError(state));
  const favoriteError = useSelector((state: RootState) => selectFavoriteError(state));

  const handleLogoutClick = () => {
    void dispatch(logout());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link" to="/">
              <img className="header__logo" src="/img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {authorizationStatus === AuthorizationStatus.Auth ? (
                <>
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                      <div className="header__avatar-wrapper user__avatar-wrapper" />
                      <span className="header__user-name user__name">{userEmail}</span>
                      <span className="header__favorite-count">{favoriteCount}</span>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <button className="header__nav-link button" type="button" onClick={handleLogoutClick}>
                      <span className="header__signout">Sign out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="header__nav-item">
                  <Link className="header__nav-link" to="/login">Sign in</Link>
                </li>
              )}
            </ul>
          </nav>
          {(authorizationError || favoriteError) && (
            <p role="alert">{authorizationError ?? favoriteError}</p>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

import {Link, Navigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import type {FormEvent} from 'react';
import type {AppDispatch, RootState} from '../../store';
import {login} from '../../store/action';
import {AuthorizationStatus} from '../../store/authorization-status';
import {selectAuthorizationError, selectAuthorizationStatus} from '../../store/selectors';
import {CITIES} from '../../mocks/cities';

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const authorizationStatus = useSelector((state: RootState) => selectAuthorizationStatus(state));
  const authorizationError = useSelector((state: RootState) => selectAuthorizationError(state));
  const [randomCity] = useState(() => CITIES[Math.floor(Math.random() * CITIES.length)] ?? CITIES[0]);

  const handleLoginFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    dispatch(login({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    }));
  };

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page__main page__main--login">
      <div className="page__login-container container">
        <section className="login">
          <h1 className="login__title">Sign in</h1>
          <form className="login__form form" onSubmit={handleLoginFormSubmit}>
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden" htmlFor="email">E-mail</label>
              <input className="login__input form__input" id="email" type="email" name="email" placeholder="Email" required />
            </div>
            <div className="login__input-wrapper form__input-wrapper">
              <label className="visually-hidden" htmlFor="password">Password</label>
              <input className="login__input form__input" id="password" type="password" name="password" placeholder="Password" pattern="(?=.*[A-Za-z])(?=.*[0-9]).+" title="Password must contain at least one letter and one number." required />
            </div>
            {authorizationError && <p role="alert">{authorizationError}</p>}
            <button className="login__submit form__submit button" type="submit" disabled={authorizationStatus === AuthorizationStatus.Unknown}>Sign in</button>
          </form>
        </section>
        <section className="locations locations--login locations--current">
          <div className="locations__item"><Link className="locations__item-link" to={`/?city=${encodeURIComponent(randomCity)}`}><span>{randomCity}</span></Link></div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;

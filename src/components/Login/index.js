import React from 'react';
import './style.scss';

export default function Login(props) {        
    return (
        <form>
        <label className="mdc-text-field mdc-text-field--filled username">
          <span className="mdc-text-field__ripple"></span>
          <input type="text" className="mdc-text-field__input" aria-labelledby="username-label" name="username" />
          <span className="mdc-floating-label" id="username-label">Username</span>
          <span className="mdc-line-ripple"></span>
        </label>
        <label className="mdc-text-field mdc-text-field--filled password">
          <span className="mdc-text-field__ripple"></span>
          <input type="password" className="mdc-text-field__input" aria-labelledby="password-label" name="password" />
          <span className="mdc-floating-label" id="password-label">Password</span>
          <span className="mdc-line-ripple"></span>
        </label>
      </form>
    );
};
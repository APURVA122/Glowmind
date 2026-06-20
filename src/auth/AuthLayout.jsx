import React from 'react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';


export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="gm-root gm-auth" data-theme="pink">
      <div className="gm-auth__orb gm-auth__orb--1" aria-hidden="true" />
      <div className="gm-auth__orb gm-auth__orb--2" aria-hidden="true" />
      <div className="gm-auth__orb gm-auth__orb--3" aria-hidden="true" />

      <div className="gm-auth__card">
        <Link to="/" className="gm-auth__logo">
          <span aria-hidden="true">✨</span> GlowMind AI
        </Link>

        <h1 className="gm-auth__title">{title}</h1>
        {subtitle && <p className="gm-auth__subtitle">{subtitle}</p>}

        {children}

        {footer && <div className="gm-auth__footer">{footer}</div>}
      </div>
    </div>
  );
}

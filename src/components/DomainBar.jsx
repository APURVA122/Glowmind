import React, { useState, useMemo } from 'react';
import { getAllDomains, addDomain, removeDomain } from '../utils/storage';
import { extractDomain } from '../utils/url';
import { DEFAULT_DOMAINS } from '../utils/constants';
import './DomainBar.css';


export default function DomainBar({ userId, domain, onDomainChange }) {
  const [siteInput, setSiteInput] = useState('');
  const [error, setError] = useState(null);

  const knownDomains = useMemo(() => {
    if (!userId) return DEFAULT_DOMAINS;
    const stored = getAllDomains(userId);
    return Array.from(new Set([...DEFAULT_DOMAINS, ...stored, domain]));
  }, [userId, domain]);

  const isDefaultDomain = DEFAULT_DOMAINS.includes(domain);

  const handleAddSite = (event) => {
    event.preventDefault();
    if (!userId) return;

    const cleanDomain = extractDomain(siteInput);

    if (!cleanDomain) {
      setError('Enter a valid URL, like notion.so or https://example.com');
      return;
    }

    addDomain(userId, cleanDomain);
    onDomainChange(cleanDomain);
    setSiteInput('');
    setError(null);
  };

  const handleRemoveDomain = () => {
    if (!userId) return;
    removeDomain(userId, domain);
    onDomainChange(DEFAULT_DOMAINS[0]);
  };

  return (
    <div className="gm-domain-bar">
      <div className="gm-domain-bar__row">
        <span className="gm-domain-bar__label">📍 Notes for</span>
        <select
          className="gm-domain-bar__select"
          value={domain}
          onChange={(e) => onDomainChange(e.target.value)}
        >
          {knownDomains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {!isDefaultDomain && (
          <button
            type="button"
            className="gm-domain-bar__remove"
            onClick={handleRemoveDomain}
            title="Remove this site and its notes"
            aria-label="Remove this site and its notes"
          >
            ✕
          </button>
        )}
      </div>

      <form className="gm-domain-bar__add" onSubmit={handleAddSite}>
        <input
          type="text"
          className="gm-domain-bar__input"
          placeholder="Add a site… e.g. wikipedia.org"
          value={siteInput}
          onChange={(e) => {
            setSiteInput(e.target.value);
            if (error) setError(null);
          }}
        />
        <button type="submit" className="gm-mini-btn">add</button>
      </form>

      {error && <p className="gm-domain-bar__error">{error}</p>}
    </div>
  );
}

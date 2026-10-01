export function Bowl({ full }) {
  return (
    <svg className="prop bowl" width="70" height="46" viewBox="0 0 70 46" aria-hidden="true">
      {full && (
        <g>
          <path d="M20 18c5-8 16-9 22-3l7-4v14l-7-4c-6 6-17 5-22-3z" fill="#F08A3C" />
          <circle cx="27" cy="16.5" r="1.6" fill="#3B2C4A" />
        </g>
      )}
      <path d="M4 22h62c0 12-13 20-31 20S4 34 4 22z" fill="#E8577A" />
      <rect x="2" y="19" width="66" height="6" rx="3" fill="#F48AA3" />
    </svg>
  );
}

export function Tray({ dirty }) {
  return (
    <svg className="prop tray" width="78" height="46" viewBox="0 0 78 46" aria-hidden="true">
      {dirty && (
        <path d="M28 14c-3-4 3-6 0-10M39 12c-3-4 3-6 0-10M50 14c-3-4 3-6 0-10"
          stroke="#7E8C5A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      <rect x="6" y="20" width="66" height="8" rx="3" fill="#E9DCC4" />
      <path d="M2 24h74l-6 20H8z" fill="#8C7AC4" />
      <rect x="0" y="21" width="78" height="6" rx="3" fill="#A796DA" />
    </svg>
  );
}

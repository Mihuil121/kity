const PATHS = {
  fish: <><path d="M2.5 12c3.2-5 9.5-6.2 13.5-2l5-3v10l-5-3c-4 4.2-10.3 3-13.5-2z" /><circle cx="8" cy="11" r="1" fill="currentColor" /></>,
  bubbles: <><circle cx="9" cy="14" r="5" /><circle cx="17" cy="7" r="3" /><circle cx="18.5" cy="15.5" r="2" /><path d="M6.5 12.5a2.5 2.5 0 0 1 2-2" /></>,
  broom: <><path d="M15 2.5 11 11" /><path d="M6.5 11h9l2 10h-13z" /><path d="M9.5 15v6M13 15v6" /></>,
  heart: <path d="M12 20.5S3.5 15.5 3.5 9.3A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8.5 1.9c0 6.2-8.5 11.2-8.5 11.2z" fill="currentColor" />,
  sparkle: <path d="M12 2.5l2.2 6.8 6.8 2.2-6.8 2.2L12 20.5l-2.2-6.8L3 11.5l6.8-2.2z" fill="currentColor" />,
  drop: <path d="M12 3c4 4.8 6.5 8.2 6.5 11.3a6.5 6.5 0 0 1-13 0C5.5 11.2 8 7.8 12 3z" fill="currentColor" />,
  paw: <g fill="currentColor"><ellipse cx="12" cy="16" rx="4.6" ry="3.9" /><circle cx="5.8" cy="10.6" r="2.1" /><circle cx="9.6" cy="6.6" r="2.1" /><circle cx="14.4" cy="6.6" r="2.1" /><circle cx="18.2" cy="10.6" r="2.1" /></g>,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  glass: <><path d="M7 3h10l-.8 6.5a4.2 4.2 0 0 1-8.4 0z" /><path d="M12 13.8V20M8.5 21h7" /></>,
  sliders: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
};

export const FX_COLOR = { heart: "#E8577A", sparkle: "#F2B530", fish: "#F08A3C", bubbles: "#5BB4E5", drop: "#5BB4E5" };

export default function Icon({ n, s = 24 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[n]}
    </svg>
  );
}

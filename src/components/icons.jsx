const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true }

export const Icons = {
  pedals: (p) => (
    <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
      <rect x="6" y="2.5" width="12" height="19" rx="2" />
      <circle cx="12" cy="16" r="2.2" />
      <path d="M9 7.5h6" />
    </svg>
  ),
  amp: (p) => (
    <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
      <rect x="2.5" y="7" width="19" height="12" rx="2" />
      <path d="M9 7V4.5h6V7" />
      <path d="M5.5 15.5h13" />
    </svg>
  ),
  cab: (p) => (
    <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
      <rect x="4" y="2.5" width="16" height="19" rx="2" />
      <circle cx="12" cy="8.5" r="3" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  ),
  eq: (p) => (
    <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
      <path d="M6 3v18M12 3v18M18 3v18" />
      <circle cx="6" cy="14" r="2" fill="#D3D7EE" />
      <circle cx="12" cy="8" r="2" fill="#D3D7EE" />
      <circle cx="18" cy="16" r="2" fill="#D3D7EE" />
    </svg>
  ),
  fx: (p) => (
    <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M9 6.5h6l-3 5.5 3 5.5H9l3-5.5z" />
    </svg>
  ),
  arrowLeft: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  chevron: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  dots: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  ),
  close: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  link: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  ),
  speaker: ({ muted, ...p }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" {...base} strokeWidth={1.6} {...p}>
      <path d="M4 9h4l5-4v14l-5-4H4z" />
      <path d="M16.5 9.5a4 4 0 0 1 0 5M19 7a7.5 7.5 0 0 1 0 10" />
      {muted && <path d="M3 21L21 3" />}
    </svg>
  ),
  power: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p}>
      <path d="M12 3v9" />
      <path d="M6.3 6.8a8 8 0 1 0 11.4 0" />
    </svg>
  ),
  play: (p) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M7 4l13 8-13 8z" />
    </svg>
  ),
  pause: (p) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  ),
  check: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" {...p}>
      <path d="M5 12l5 5 9-10" />
    </svg>
  ),
  logo: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...p}>
      <path d="M4 21V11a8 8 0 0 1 16 0v10" />
      <path d="M12 19c-2 0-3.2-1.4-3.2-3 0-2.2 3.2-3.6 3.2-6.4 0 2.8 3.2 4.2 3.2 6.4 0 1.6-1.2 3-3.2 3z" fill="currentColor" />
    </svg>
  ),
}

// Icon components for quick actions
export function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#2563eb"/>
      <rect x="7" y="2" width="2" height="4" rx="1" fill="#fff"/>
      <rect x="15" y="2" width="2" height="4" rx="1" fill="#fff"/>
      <rect x="3" y="9" width="18" height="1" fill="#fff"/>
      <rect x="7" y="13" width="2" height="2" rx="1" fill="#fff"/>
    </svg>
  );
}

export function AlarmIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="14" r="7" fill="#22c55e"/>
      <rect x="11" y="10" width="2" height="5" rx="1" fill="#fff"/>
      <rect x="11" y="15" width="4" height="2" rx="1" fill="#fff"/>
    </svg>
  );
}

export function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="10" r="4" fill="#a21caf"/>
      <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" fill="#a21caf"/>
      <circle cx="12" cy="10" r="2" fill="#fff"/>
    </svg>
  );
}

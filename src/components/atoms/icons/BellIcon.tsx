import React from "react";

export default function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 10a6 6 0 1 0-12 0c0 4-1.5 5.5-1.5 5.5h15S18 14 18 10Z" />
      <path d="M9.75 18a2.25 2.25 0 0 0 4.5 0" />
    </svg>
  );
}

import React from "react";

export default function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3.75 10.5 12 3l8.25 7.5" />
      <path d="M5.25 9.25v9a1.25 1.25 0 0 0 1.25 1.25H9.5v-5.25h5V19.5h3a1.25 1.25 0 0 0 1.25-1.25v-9" />
    </svg>
  );
}

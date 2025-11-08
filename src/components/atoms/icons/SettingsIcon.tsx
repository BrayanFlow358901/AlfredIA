import React from "react";

export default function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
      <path d="M19.25 12a7.25 7.25 0 0 0-.08-1.07l2.05-1.6-1.54-2.67-2.54.78a7.22 7.22 0 0 0-1.86-1.07l-.38-2.62h-3.08l-.38 2.62a7.22 7.22 0 0 0-1.86 1.07l-2.54-.78-1.54 2.67 2.05 1.6A7.25 7.25 0 0 0 4.75 12c0 .36.03.71.08 1.07l-2.05 1.6 1.54 2.67 2.54-.78a7.22 7.22 0 0 0 1.86 1.07l.38 2.62h3.08l.38-2.62a7.22 7.22 0 0 0 1.86-1.07l2.54.78 1.54-2.67-2.05-1.6c.05-.35.08-.7.08-1.07Z" />
    </svg>
  );
}

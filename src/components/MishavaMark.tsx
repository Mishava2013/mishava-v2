export function MishavaMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 5.5v31.8c0 6.2-3.7 11.7-9.4 14.1L11.9 56"
        stroke="url(#mishava-mark-gradient)"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M18.5 22.5H45"
        stroke="url(#mishava-mark-gradient)"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M32 5.5c14.6 0 26.5 11.6 26.5 26 0 9.5-5 17.7-12.7 22.3-1.9 1.1-4.1-.7-3.5-2.8 1.9-6.6.6-11.9-4.1-14.4-6.8-3.6-13 4.9-24.4-3.7C6.2 27.2 3.9 19.8 7 13.5"
        stroke="url(#mishava-mark-gradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <defs>
        <linearGradient
          id="mishava-mark-gradient"
          x1="5"
          x2="58"
          y1="8"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2F6F4E" />
          <stop offset="1" stopColor="#2D7C83" />
        </linearGradient>
      </defs>
    </svg>
  );
}

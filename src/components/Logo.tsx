export function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HairBloom"
    >
      <circle cx="32" cy="32" r="32" fill="var(--caramel)" />
      <g fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
        {/* hair strand forming a bloom */}
        <path d="M32 50 C32 50, 30 38, 32 28" />
        <ellipse cx="32" cy="22" rx="4" ry="7" fill="white" stroke="none" />
        <ellipse cx="26" cy="25" rx="3.5" ry="6" transform="rotate(-35 26 25)" fill="white" stroke="none" opacity="0.9" />
        <ellipse cx="38" cy="25" rx="3.5" ry="6" transform="rotate(35 38 25)" fill="white" stroke="none" opacity="0.9" />
        <ellipse cx="24" cy="32" rx="3" ry="5.5" transform="rotate(-70 24 32)" fill="white" stroke="none" opacity="0.75" />
        <ellipse cx="40" cy="32" rx="3" ry="5.5" transform="rotate(70 40 32)" fill="white" stroke="none" opacity="0.75" />
        <circle cx="32" cy="26" r="2" fill="var(--caramel)" stroke="none" />
      </g>
    </svg>
  );
}
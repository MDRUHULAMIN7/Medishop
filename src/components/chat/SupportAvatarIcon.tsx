import React from 'react';

interface SupportAvatarIconProps {
  className?: string;
  size?: number | string;
  showOnlineDot?: boolean;
}

export function SupportAvatarIcon({
  className = 'h-7 w-7',
  size,
  showOnlineDot = false,
}: SupportAvatarIconProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={style}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full select-none"
      >
        {/* Head / Face */}
        <ellipse cx="24" cy="22" rx="12" ry="13" fill="#FED7AA" />

        {/* Hair - Back & Sides */}
        <path
          d="M11 22C11 13 16 7 24 7C32 7 37 13 37 22C37 26 35.5 30 35 31C34 25 31 20 24 20C17 20 14 25 13 31C12.5 30 11 26 11 22Z"
          fill="#1E293B"
        />

        {/* Hair Front Bangs */}
        <path
          d="M14 17C17.5 13 23 15 25 18C28 14.5 33 14.5 34 18C33 12.5 29.5 9 24 9C18.5 9 15 12.5 14 17Z"
          fill="#0F172A"
        />

        {/* Eyes */}
        <circle cx="19.5" cy="21.5" r="1.6" fill="#0F172A" />
        <circle cx="28.5" cy="21.5" r="1.6" fill="#0F172A" />

        {/* Cheeks */}
        <circle cx="17" cy="24.5" r="1.8" fill="#F87171" fillOpacity="0.75" />
        <circle cx="31" cy="24.5" r="1.8" fill="#F87171" fillOpacity="0.75" />

        {/* Friendly Smile */}
        <path
          d="M21 26C22 28 26 28 27 26"
          stroke="#DC2626"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Uniform / Shoulders */}
        <path
          d="M8 45C8 36 14.5 32 24 32C33.5 32 40 36 40 45"
          fill="#059669"
          stroke="#047857"
          strokeWidth="1.5"
        />
        {/* Uniform Collar */}
        <path
          d="M20 32L24 37L28 32"
          stroke="#A7F3D0"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Headset Arc Band */}
        <path
          d="M10 23C10 12 15.5 5 24 5C32.5 5 38 12 38 23"
          stroke="#38BDF8"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Left Ear Cushion */}
        <rect
          x="7.5"
          y="18.5"
          width="4.8"
          height="9"
          rx="2.4"
          fill="#0284C7"
          stroke="#0369A1"
          strokeWidth="1.2"
        />

        {/* Right Ear Cushion */}
        <rect
          x="35.7"
          y="18.5"
          width="4.8"
          height="9"
          rx="2.4"
          fill="#0284C7"
          stroke="#0369A1"
          strokeWidth="1.2"
        />

        {/* Microphone boom */}
        <path
          d="M37 25.5C37 32 32.5 35 28 35H25"
          stroke="#0369A1"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Mic Tip */}
        <rect x="22.5" y="33.5" width="4.5" height="3.2" rx="1.6" fill="#0284C7" />
        <circle cx="24.5" cy="35.1" r="0.8" fill="#38BDF8" />
      </svg>

      {showOnlineDot && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs" />
        </span>
      )}
    </div>
  );
}

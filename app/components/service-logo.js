export default function ServiceLogo({ className = "w-12 h-12" }) {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="url(#gradient)"
          stroke="currentColor"
          strokeWidth="1"
          className="text-blue-200/30"
        />

        {/* Main gear */}
        <g className="text-blue-600">
          <circle cx="24" cy="24" r="8" fill="currentColor" />
          <circle cx="24" cy="24" r="4" fill="white" />

          {/* Gear teeth */}
          <rect x="22" y="10" width="4" height="6" fill="currentColor" />
          <rect x="22" y="32" width="4" height="6" fill="currentColor" />
          <rect x="10" y="22" width="6" height="4" fill="currentColor" />
          <rect x="32" y="22" width="6" height="4" fill="currentColor" />

          {/* Diagonal teeth */}
          <rect x="31" y="13" width="4" height="4" fill="currentColor" transform="rotate(45 33 15)" />
          <rect x="31" y="31" width="4" height="4" fill="currentColor" transform="rotate(45 33 33)" />
          <rect x="13" y="13" width="4" height="4" fill="currentColor" transform="rotate(45 15 15)" />
          <rect x="13" y="31" width="4" height="4" fill="currentColor" transform="rotate(45 15 33)" />
        </g>

        {/* Wrench tool */}
        <g className="text-orange-500">
          <path d="M35 8 L40 13 L37 16 L32 11 Z" fill="currentColor" />
          <rect x="30" y="10" width="2" height="12" fill="currentColor" transform="rotate(45 31 16)" />
        </g>

        {/* Network nodes */}
        <g className="text-green-500">
          <circle cx="8" cy="8" r="2" fill="currentColor" />
          <circle cx="40" cy="40" r="2" fill="currentColor" />
          <circle cx="8" cy="40" r="2" fill="currentColor" />

          {/* Connection lines */}
          <line x1="8" y1="8" x2="22" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="8" y1="40" x2="22" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="40" x2="32" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

import { type ReactNode } from "react";

type IllustrationProps = { className?: string };

export function CauliflowerIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cf-bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#dcfce7" />
        </radialGradient>
        <radialGradient id="cf-head" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fefce8" />
          <stop offset="100%" stopColor="#eaeac0" />
        </radialGradient>
        <radialGradient id="cf-floret" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#fdf6c8" />
          <stop offset="100%" stopColor="#d9d293" />
        </radialGradient>
        <linearGradient id="cf-leaf-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="55%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="cf-leaf-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="cf-leaf-back" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      {/* background */}
      <rect width="400" height="400" fill="url(#cf-bg)" />

      {/* ground shadow */}
      <ellipse cx="200" cy="340" rx="135" ry="14" fill="#000" opacity="0.12" />

      {/* back leaf */}
      <path
        d="M200 200
           C 130 140, 120 80, 175 50
           C 195 75, 215 130, 210 200 Z"
        fill="url(#cf-leaf-back)"
        opacity="0.95"
      />
      <path
        d="M188 65 C 195 110, 198 160, 202 195"
        stroke="#14532d"
        strokeWidth="2"
        fill="none"
        opacity="0.45"
      />

      {/* left big leaf */}
      <path
        d="M150 220
           C 60 215, 35 150, 70 95
           C 110 110, 165 165, 175 230 Z"
        fill="url(#cf-leaf-l)"
      />
      <path
        d="M78 110 C 110 145, 145 185, 170 220"
        stroke="#14532d"
        strokeWidth="2.5"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M95 130 C 105 140, 115 148, 125 155 M115 155 C 122 162, 130 168, 138 173 M85 160 C 100 168, 115 175, 130 180"
        stroke="#14532d"
        strokeWidth="1.2"
        fill="none"
        opacity="0.4"
      />

      {/* right big leaf */}
      <path
        d="M250 220
           C 340 220, 370 155, 335 95
           C 290 115, 240 165, 230 230 Z"
        fill="url(#cf-leaf-r)"
      />
      <path
        d="M325 110 C 295 145, 260 185, 235 220"
        stroke="#14532d"
        strokeWidth="2.5"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M305 130 C 295 140, 285 148, 275 155 M285 155 C 278 162, 270 168, 262 173 M315 160 C 300 168, 285 175, 270 180"
        stroke="#14532d"
        strokeWidth="1.2"
        fill="none"
        opacity="0.4"
      />

      {/* small front leaves */}
      <path
        d="M170 245
           C 130 260, 110 235, 120 205
           C 145 215, 165 230, 175 248 Z"
        fill="url(#cf-leaf-l)"
        opacity="0.95"
      />
      <path
        d="M230 245
           C 270 260, 290 235, 280 205
           C 255 215, 235 230, 225 248 Z"
        fill="url(#cf-leaf-r)"
        opacity="0.95"
      />

      {/* main cauliflower head — slightly squashed dome */}
      <ellipse cx="200" cy="215" rx="115" ry="92" fill="url(#cf-head)" />

      {/* florets — bumpy curd cluster */}
      <g>
        {/* top row */}
        <circle cx="160" cy="155" r="22" fill="url(#cf-floret)" />
        <circle cx="195" cy="142" r="26" fill="url(#cf-floret)" />
        <circle cx="232" cy="152" r="23" fill="url(#cf-floret)" />
        <circle cx="260" cy="170" r="20" fill="url(#cf-floret)" />
        <circle cx="138" cy="170" r="20" fill="url(#cf-floret)" />

        {/* middle row */}
        <circle cx="125" cy="200" r="22" fill="url(#cf-floret)" />
        <circle cx="158" cy="190" r="24" fill="url(#cf-floret)" />
        <circle cx="195" cy="180" r="28" fill="url(#cf-floret)" />
        <circle cx="232" cy="188" r="25" fill="url(#cf-floret)" />
        <circle cx="268" cy="200" r="22" fill="url(#cf-floret)" />

        {/* lower row */}
        <circle cx="145" cy="225" r="24" fill="url(#cf-floret)" />
        <circle cx="180" cy="220" r="26" fill="url(#cf-floret)" />
        <circle cx="218" cy="222" r="26" fill="url(#cf-floret)" />
        <circle cx="252" cy="230" r="22" fill="url(#cf-floret)" />

        {/* bottom edge */}
        <circle cx="170" cy="250" r="22" fill="url(#cf-floret)" />
        <circle cx="208" cy="252" r="24" fill="url(#cf-floret)" />
        <circle cx="240" cy="250" r="20" fill="url(#cf-floret)" />
        <circle cx="125" cy="232" r="18" fill="url(#cf-floret)" />
        <circle cx="278" cy="225" r="18" fill="url(#cf-floret)" />
      </g>

      {/* tiny floret bumps for texture */}
      <g opacity="0.65">
        <circle cx="178" cy="170" r="6" fill="#fffbe6" />
        <circle cx="210" cy="160" r="7" fill="#fffbe6" />
        <circle cx="245" cy="172" r="6" fill="#fffbe6" />
        <circle cx="148" cy="200" r="6" fill="#fffbe6" />
        <circle cx="190" cy="205" r="7" fill="#fffbe6" />
        <circle cx="225" cy="205" r="6" fill="#fffbe6" />
        <circle cx="263" cy="218" r="5" fill="#fffbe6" />
        <circle cx="160" cy="240" r="6" fill="#fffbe6" />
        <circle cx="198" cy="235" r="6" fill="#fffbe6" />
        <circle cx="232" cy="240" r="5" fill="#fffbe6" />
      </g>

      {/* speckles / freckles */}
      <g fill="#a8a37a" opacity="0.55">
        <circle cx="172" cy="178" r="0.9" />
        <circle cx="200" cy="170" r="0.9" />
        <circle cx="218" cy="195" r="0.9" />
        <circle cx="160" cy="215" r="0.9" />
        <circle cx="195" cy="220" r="0.9" />
        <circle cx="240" cy="208" r="0.9" />
        <circle cx="180" cy="245" r="0.9" />
        <circle cx="215" cy="240" r="0.9" />
      </g>

      {/* glossy highlight on head */}
      <ellipse cx="170" cy="165" rx="38" ry="14" fill="#ffffff" opacity="0.45" transform="rotate(-22 170 165)" />
      <ellipse cx="148" cy="195" rx="14" ry="6" fill="#ffffff" opacity="0.5" transform="rotate(-30 148 195)" />

      {/* shadow under head */}
      <ellipse cx="200" cy="295" rx="100" ry="14" fill="#000" opacity="0.08" />
    </svg>
  );
}

export function PumpkinIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pk-bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </radialGradient>
        <radialGradient id="pk-lobe" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="pk-lobe-side" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <linearGradient id="pk-stem" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#65a30d" />
          <stop offset="100%" stopColor="#365314" />
        </linearGradient>
        <linearGradient id="pk-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="url(#pk-bg)" />
      <ellipse cx="200" cy="345" rx="140" ry="14" fill="#000" opacity="0.15" />

      {/* curly tendril */}
      <path
        d="M250 110 C 270 95, 285 105, 280 125 C 275 145, 295 145, 300 130"
        stroke="#65a30d"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* leaf */}
      <path
        d="M160 120
           C 110 95, 80 115, 95 155
           C 125 165, 160 150, 175 130 Z"
        fill="url(#pk-leaf)"
      />
      <path
        d="M100 145 C 130 140, 155 135, 172 128"
        stroke="#14532d"
        strokeWidth="2"
        fill="none"
        opacity="0.55"
      />

      {/* outer side lobes */}
      <ellipse cx="105" cy="225" rx="55" ry="100" fill="url(#pk-lobe-side)" />
      <ellipse cx="295" cy="225" rx="55" ry="100" fill="url(#pk-lobe-side)" />

      {/* middle lobes */}
      <ellipse cx="150" cy="220" rx="60" ry="115" fill="url(#pk-lobe)" />
      <ellipse cx="250" cy="220" rx="60" ry="115" fill="url(#pk-lobe)" />

      {/* center lobe */}
      <ellipse cx="200" cy="215" rx="70" ry="125" fill="url(#pk-lobe)" />

      {/* lobe ridges */}
      <path d="M165 110 C 158 200, 158 250, 168 320" stroke="#7c2d12" strokeWidth="2.5" fill="none" opacity="0.55" />
      <path d="M235 110 C 242 200, 242 250, 232 320" stroke="#7c2d12" strokeWidth="2.5" fill="none" opacity="0.55" />
      <path d="M115 145 C 110 215, 112 270, 122 315" stroke="#7c2d12" strokeWidth="2" fill="none" opacity="0.45" />
      <path d="M285 145 C 290 215, 288 270, 278 315" stroke="#7c2d12" strokeWidth="2" fill="none" opacity="0.45" />

      {/* highlights */}
      <ellipse cx="180" cy="160" rx="22" ry="50" fill="#ffffff" opacity="0.25" />
      <ellipse cx="135" cy="180" rx="10" ry="30" fill="#ffffff" opacity="0.2" />

      {/* stem */}
      <path
        d="M188 105 L 195 75 C 198 65, 210 65, 213 75 L 218 108 Z"
        fill="url(#pk-stem)"
      />
      <path d="M200 78 L 200 105" stroke="#1a2e05" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

export const VEGETABLE_ILLUSTRATIONS: Record<string, (props: IllustrationProps) => ReactNode> = {
  cauliflower: CauliflowerIllustration,
  pumpkin: PumpkinIllustration,
};

export function getIllustration(name?: string) {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  return VEGETABLE_ILLUSTRATIONS[key] ?? null;
}

export function ProductImage({
  product,
  className,
  imgClassName,
}: {
  product: { name?: string; imageUrl?: string | null };
  className?: string;
  imgClassName?: string;
}) {
  const Illustration = getIllustration(product.name);
  if (Illustration) {
    return (
      <div className={className}>
        <Illustration className="w-full h-full object-cover" />
      </div>
    );
  }
  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name ?? ""}
        className={imgClassName ?? className}
      />
    );
  }
  return <div className={className} />;
}

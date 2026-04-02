export default function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-5"
      style={{ mixBlendMode: 'overlay' }}
    >
      <svg className="absolute inset-0 h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)"
          opacity="1"
        ></rect>
      </svg>
    </div>
  );
}

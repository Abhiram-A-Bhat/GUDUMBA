type BrandLoaderProps = {
  label?: string;
  compact?: boolean;
};

/** A bespoke, stitched-line loading mark for GUDUMBA's editorial storefront. */
export default function BrandLoader({
  label = "PREPARING THE NEXT DROP",
  compact = false,
}: BrandLoaderProps) {
  return (
    <div className={`brand-loader${compact ? " brand-loader--compact" : ""}`} role="status" aria-live="polite">
      <svg className="brand-loader__mark" viewBox="0 0 72 72" aria-hidden="true">
        <circle className="brand-loader__orbit" cx="36" cy="36" r="28" />
        <path className="brand-loader__needle" d="M36 8v56M8 36h56M23 18l26 36M49 18 23 54" />
        <path className="brand-loader__glyph" d="M42 16c-12 0-20 8-20 20s8 20 20 20M30 36h22" />
        <circle className="brand-loader__stitch" cx="36" cy="8" r="2" />
      </svg>
      <span className="brand-loader__label">{label}</span>
      <span className="sr-only">Loading</span>
    </div>
  );
}

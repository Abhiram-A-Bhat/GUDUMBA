import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#100f0d] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[#b59a68] text-xs font-mono uppercase tracking-[0.3em] font-bold block mb-4">
        Error 404 // Lost In The Noise
      </span>
      <h1
        className="g-display text-7xl sm:text-9xl text-[#f2f0ed] mb-4"
        style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
      >
        OUT OF BOUNDS.
      </h1>
      <p className="text-sm sm:text-base text-[#888] max-w-md mx-auto mb-8 leading-relaxed">
        This path doesn&apos;t exist. But you&apos;re not the type to follow standard paths anyway. Return to the drop and own the presence.
      </p>

      <div className="flex gap-4">
        <Link href="/" className="btn-primary">
          Back to Entrance →
        </Link>
        <Link href="/shop" className="btn-ghost">
          Explore Archive
        </Link>
      </div>
    </div>
  );
}

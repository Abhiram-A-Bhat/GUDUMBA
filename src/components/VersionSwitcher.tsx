"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Sparkles, Flame } from "lucide-react";

export default function VersionSwitcher() {
  const pathname = usePathname();
  const isClassic = pathname === "/classic" || pathname === "/v1";

  const targetHref = isClassic ? "/" : "/classic";
  const targetLabel = isClassic ? "Switch to Runway V2" : "Switch to Classic V1";
  const currentBadge = isClassic ? "V1 Classic" : "V2 Runway";

  return (
    <aside
      aria-label="Frontend Version Switcher"
      className="fixed bottom-6 left-6 z-40 flex items-center"
    >
      <Link
        href={targetHref}
        className="group relative flex items-center gap-2.5 rounded-full border border-[#3d3830] bg-[#12110e]/95 px-3.5 py-2 text-white shadow-[0_8px_30px_rgb(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-[#b59a68] hover:bg-[#1c1a15] hover:shadow-[0_0_20px_rgba(181,154,104,0.3)] active:scale-95"
        title={
          isClassic
            ? "Currently on Classic Underground V1. Click to view Runway Architectural V2."
            : "Currently on Runway Architectural V2. Click to view Classic Underground V1."
        }
      >
        {/* Pulsing Micro-Indicator */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8410a] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c8410a]" />
        </span>

        {/* Current Active Pill */}
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-[#8e8578] sm:inline">
          [{currentBadge}]
        </span>

        {/* Switch Action Label */}
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#eee9df] group-hover:text-white sm:text-[11px]">
          {targetLabel}
        </span>

        {/* Icon */}
        {isClassic ? (
          <Sparkles
            size={13}
            className="text-[#b59a68] transition-transform duration-300 group-hover:rotate-12"
          />
        ) : (
          <Flame
            size={13}
            className="text-[#c8410a] transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </Link>
    </aside>
  );
}

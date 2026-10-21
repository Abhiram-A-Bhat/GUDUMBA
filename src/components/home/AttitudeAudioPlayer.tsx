"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Zap, Volume2, VolumeX, ShieldCheck, Flame, ArrowRight } from "lucide-react";

export default function AttitudeAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);

  const drops = [
    { title: "HYDERABAD NOIR // 01", bpm: "140 BPM", vibe: "Heavy Industrial Bass" },
    { title: "UNAPOLOGETIC RUNWAY // 02", bpm: "128 BPM", vibe: "Dark Drill Electro" },
    { title: "CHAOS & CHARACTER // 03", bpm: "150 BPM", vibe: "Street Cyberpunk" },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 bg-[#0a0a0a] border-b border-[#222]">
      <div className="max-w-[1440px] mx-auto bg-gradient-to-r from-[#141414] via-[#1a1412] to-[#141414] border border-[#ff4800]/30 rounded-sm p-6 sm:p-10 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff4800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#ff4800] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-2">
              <Zap size={14} className="fill-[#ff4800]" />
              <span>THE GUDUMBA DIFFERENTIATOR: ATTITUDE RADIO</span>
            </div>
            <h2
              className="font-heading text-3xl sm:text-5xl text-white mb-2"
              style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
            >
              WEAR THE SOUND. OWN THE SCENE.
            </h2>
            <p className="text-xs sm:text-sm text-[#999] max-w-xl">
              Streetwear is audio-visual. Experience the raw soundtrack curated for Drop 01 while browsing our cuts.
            </p>
          </div>

          {/* Interactive Radio Player Component */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="bg-black/80 border border-[#333] rounded-xs p-3.5 flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-[#ff4800] text-black font-extrabold flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                aria-label={isPlaying ? "Pause Beat" : "Play Beat"}
              >
                {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>

              <div className="font-mono text-left">
                <span className="text-[10px] text-[#ff4800] font-bold block">
                  {isPlaying ? "NOW STREAMING //" : "SELECT DROP SOUNDTRACK //"}
                </span>
                <span className="text-xs text-white font-bold block">
                  {drops[audioIndex].title}
                </span>
                <span className="text-[10px] text-[#777]">
                  {drops[audioIndex].vibe} • {drops[audioIndex].bpm}
                </span>
              </div>

              {/* Fake Equalizer Bars */}
              <div className="flex items-end gap-1 h-6 ml-2">
                {[40, 90, 60, 100, 30, 80].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-[#ff4800] rounded-full transition-all duration-300 ${
                      isPlaying ? "animate-pulse" : "opacity-30"
                    }`}
                    style={{ height: isPlaying ? `${h}%` : "20%" }}
                  />
                ))}
              </div>
            </div>

            <Link href="/shop" className="btn-primary text-xs whitespace-nowrap w-full sm:w-auto text-center">
              COP THE FIT <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — GUDUMBA®",
  description: "Gudumba started with one simple belief: A man should never have to change who he is to fit in. Born Different. Stay Unapologetic.",
};

export default function OurStoryPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#100f0d]">
      {/* Hero Banner */}
      <section className="relative h-[65vh] min-h-[460px] flex items-center justify-center overflow-hidden border-b border-[#23201a]">
        <Image
          src="/brand/brand_asset_2.jpeg"
          alt="Gudumba Runway Story"
          fill
          priority
          className="object-cover filter brightness-40 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100f0d] via-[#100f0d]/40 to-transparent" />

        <div className="relative z-10 text-center max-w-3xl px-6">
          <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.3em] font-bold block mb-4">
            The Philosophy
          </span>
          <h1
            className="g-display text-5xl sm:text-7xl md:text-8xl text-[#f2f0ed] leading-[0.9]"
            style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
          >
            BORN DIFFERENT.<br />STAY UNAPOLOGETIC.
          </h1>
          <p className="text-sm sm:text-base text-[#ccc] mt-6 max-w-xl mx-auto font-light">
            For the men who don&apos;t ask for approval. Rugged by nature. Proud by choice. Unapologetic by attitude.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 px-6 max-w-[900px] mx-auto text-[#aaa] space-y-12 leading-relaxed">
        <div>
          <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
            Origins
          </span>
          <h2 className="g-display text-3xl sm:text-5xl text-[#f2f0ed] mb-6">
            OUR STORY
          </h2>
          <p className="text-base sm:text-lg text-[#ccc] leading-relaxed mb-6">
            Gudumba started with one simple belief: <strong className="text-[#f2f0ed]">A man should never have to change who he is to fit in.</strong>
          </p>
          <p className="text-base text-[#888] leading-relaxed mb-6">
            The world will always have an opinion. Too loud. Too bold. Too confident. Too different.
            <br />
            <strong className="text-[#c8410a]">We say — so what?</strong>
          </p>
          <p className="text-base text-[#aaa] leading-relaxed">
            Our clothes are inspired by the men who choose their own standards, build their own identity, and stand behind every decision they make. From the streets to the boardroom. From the gym to the night out. From ambition to adversity. Every piece is designed for a man who carries himself with confidence and doesn&apos;t need someone else&apos;s approval to know his worth.
          </p>
        </div>

        {/* Attitude Block */}
        <div className="p-8 sm:p-12 bg-[#141310] border border-[#222] rounded-xs my-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8410a]/5 rounded-full blur-2xl" />
          <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
            The Mindset
          </span>
          <h3 className="g-display text-3xl sm:text-4xl text-[#f2f0ed] mb-6">
            THE ATTITUDE
          </h3>
          <div className="space-y-4 text-sm sm:text-base text-[#ccc]">
            <p>You don&apos;t need to prove you&apos;re different. <strong className="text-white">Be different.</strong></p>
            <p>You don&apos;t need to demand respect. <strong className="text-white">Carry yourself like you deserve it.</strong></p>
            <p>You don&apos;t need to follow the crowd. <strong className="text-white">Let the crowd follow.</strong></p>
            <p className="italic text-[#888] pt-4 border-t border-[#26231d]">
              &quot;Because confidence isn&apos;t about being louder than everyone else. It&apos;s about being comfortable standing alone.&quot;
            </p>
          </div>
        </div>

        {/* The Code */}
        <div>
          <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
            Core Creed
          </span>
          <h3 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">
            OUR CODE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-[#ccc]">
            <div className="p-4 bg-[#171512] border border-[#222] flex items-center gap-3">
              <span className="text-[#c8410a] font-bold">01</span>
              <span>WORK HARD. STAND TALL.</span>
            </div>
            <div className="p-4 bg-[#171512] border border-[#222] flex items-center gap-3">
              <span className="text-[#c8410a] font-bold">02</span>
              <span>TAKE RISKS. OWN YOUR CHOICES.</span>
            </div>
            <div className="p-4 bg-[#171512] border border-[#222] flex items-center gap-3">
              <span className="text-[#c8410a] font-bold">03</span>
              <span>PROTECT YOUR STANDARDS.</span>
            </div>
            <div className="p-4 bg-[#171512] border border-[#222] flex items-center gap-3">
              <span className="text-[#c8410a] font-bold">04</span>
              <span>NEVER SHRINK TO FIT IN.</span>
            </div>
          </div>
        </div>

        {/* End CTA */}
        <div className="pt-12 text-center">
          <Link href="/shop" className="btn-primary">
            Wear The Attitude — Shop Drop 01 →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

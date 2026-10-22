"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check, Copy, RefreshCw, Smartphone, ShieldCheck, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface YoupiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  amount: number;
  qrCodeDataUrl: string;
  upiString: string;
  vpa: string;
}

export default function YoupiPaymentModal({
  isOpen,
  onClose,
  orderNumber,
  amount,
  qrCodeDataUrl,
  upiString,
  vpa,
}: YoupiPaymentModalProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [checking, setChecking] = useState(false);

  // Copy VPA to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 5 minute countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Real-time polling to verify payment
  useEffect(() => {
    if (!isOpen || !orderNumber) return;

    const pollInterval = setInterval(async () => {
      try {
        setChecking(true);
        const res = await fetch(`/api/payments/youpi/status?orderNumber=${encodeURIComponent(orderNumber)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isPaid) {
            clearInterval(pollInterval);
            router.push(`/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&status=youpi&txnid=${encodeURIComponent(data.utr || "UPI_VERIFIED")}`);
          }
        }
      } catch {
        // ignore polling network errors
      } finally {
        setChecking(false);
      }
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [isOpen, orderNumber, router]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#100f0d] border border-[#23201a] rounded-xs shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#777] hover:text-white transition-colors"
          aria-label="Close UPI Modal"
        >
          <X size={20} />
        </button>

        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold tracking-wider uppercase">
            <Zap size={11} /> 0% Fee Direct UPI
          </span>
          <span className="text-[11px] font-mono text-[#888]">
            {formattedTime}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl tracking-wider text-[#f5f5f5] mb-1">
          SCAN & PAY VIA UPI
        </h3>
        <p className="text-xs text-[#888] font-mono mb-4">
          ORDER {orderNumber} • AMOUNT {formatPrice(amount)}
        </p>

        {/* Dynamic QR Code Box */}
        <div className="relative p-3 bg-white rounded-sm shadow-xl mb-4 group">
          <Image
            src={qrCodeDataUrl}
            alt="UPI QR Code"
            width={240}
            height={240}
            className="w-56 h-56 object-contain"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/95 transition-opacity rounded-sm">
            <p className="text-xs font-bold text-black uppercase tracking-wider px-4 text-center">
              Scan with GPay, PhonePe, Paytm, or CRED
            </p>
          </div>
        </div>

        {/* Merchant VPA & Copy Button */}
        <div className="w-full flex items-center justify-between p-2.5 bg-[#171512] border border-[#23201a] rounded-xs mb-4">
          <div className="text-left font-mono">
            <span className="text-[9px] uppercase tracking-wider text-[#666] block">
              Direct Receiving UPI ID
            </span>
            <span className="text-xs font-bold text-[#f5f5f5]">{vpa}</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#23201a] hover:bg-[#2c2821] text-xs font-mono text-white rounded-xs transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Mobile UPI App Intent Launcher (Visible on Mobile) */}
        <div className="w-full space-y-2 mb-4">
          <a
            href={upiString}
            className="w-full btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Smartphone size={15} /> Open in Any UPI App
          </a>
        </div>

        {/* Real-time Status Footer */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-[#777]">
          <RefreshCw size={12} className={`text-[#b59a68] ${checking ? "animate-spin" : ""}`} />
          <span>Listening for bank credit notification...</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#555]">
          <ShieldCheck size={13} className="text-[#b59a68]" />
          <span>Direct peer-to-merchant settlement • Zero intermediary cut</span>
        </div>
      </div>
    </div>
  );
}

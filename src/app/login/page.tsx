"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toaster";
import { signInWithGoogle, sendPhoneOtp, verifyPhoneOtp } from "@/lib/supabase";
import Footer from "@/components/Footer";
import { Loader2, Phone, Mail, ArrowRight } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Email form state
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
      }
    } catch {
      setErrorMsg("Failed to initiate Google sign in. Configure NEXT_PUBLIC_SUPABASE_URL in .env");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await sendPhoneOtp(phone);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setOtpSent(true);
        toast(`Verification OTP dispatched to ${phone}`, "success");
      }
    } catch {
      setErrorMsg("Phone OTP requires configured Supabase SMS provider (Twilio).");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await verifyPhoneOtp(phone, otp);
      if (error) {
        setErrorMsg(error.message);
      } else {
        toast("Verified successfully! Welcome to Gudumba.", "success");
        router.push("/account");
      }
    } catch {
      setErrorMsg("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailForm),
        });
        const data = await res.json();
        if (res.ok) {
          toast("Account created successfully! Welcome to Gudumba.", "success");
          router.push("/account");
        } else {
          setErrorMsg(data.error || "Failed to create account.");
        }
      } else {
        const res = await login(emailForm.email, emailForm.password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          toast("Welcome back.", "success");
          router.push("/account");
        }
      }
    } catch {
      setErrorMsg("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#050505] flex flex-col justify-between">
      <div className="max-w-md mx-auto px-6 w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#666] block mb-2">
            GUDUMBA® CLIENT ACCESS
          </span>
          <h1
            className="font-display text-4xl sm:text-5xl text-white tracking-wider"
            style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
          >
            IDENTIFY YOURSELF
          </h1>
        </div>

        {/* 1-Click Google OAuth (Fastest D2C Signup) */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#111111] hover:bg-[#181818] border border-[#262626] hover:border-[#444] text-white text-xs font-semibold uppercase tracking-wider rounded-none flex items-center justify-center gap-3 transition-all mb-6 cursor-pointer"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-[#1c1c1c]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-[#555] uppercase tracking-widest">
            or use
          </span>
          <div className="flex-grow border-t border-[#1c1c1c]"></div>
        </div>

        {/* Method Toggle: Email vs Phone OTP */}
        <div className="flex border-b border-[#222] mb-6">
          <button
            onClick={() => { setAuthMethod("email"); setErrorMsg(""); }}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
              authMethod === "email" ? "text-white border-b-2 border-white font-bold" : "text-[#555]"
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => { setAuthMethod("phone"); setErrorMsg(""); }}
            className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors ${
              authMethod === "phone" ? "text-white border-b-2 border-white font-bold" : "text-[#555]"
            }`}
          >
            Phone OTP (+91)
          </button>
        </div>

        {/* PHONE OTP TAB */}
        {authMethod === "phone" ? (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-[#777] uppercase tracking-wider block mb-1">
                    Mobile Phone Number (India)
                  </label>
                  <div className="flex bg-[#111] border border-[#222] focus-within:border-white">
                    <span className="px-3 py-2.5 text-xs font-mono text-[#777] border-r border-[#222]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-white px-3 py-2 text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                {errorMsg && <p className="text-xs text-red-500 font-mono">{errorMsg}</p>}

                <button type="submit" disabled={loading} className="w-full btn-luxury-primary py-3.5 text-xs">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "DISPATCH SMS OTP →"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-[#777] uppercase tracking-wider block mb-1">
                    Enter 6-Digit OTP sent to +91 {phone}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] focus:border-white text-white px-3 py-2.5 text-base font-mono tracking-widest text-center outline-none"
                  />
                </div>

                {errorMsg && <p className="text-xs text-red-500 font-mono">{errorMsg}</p>}

                <button type="submit" disabled={loading} className="w-full btn-luxury-primary py-3.5 text-xs">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "VERIFY & ENTER →"}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-[10px] font-mono text-[#666] hover:text-white uppercase tracking-wider pt-2"
                >
                  ← Edit Phone Number
                </button>
              </form>
            )}
          </div>
        ) : (
          /* EMAIL & PASSWORD TAB */
          <div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="text-[10px] font-mono text-[#777] uppercase tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                    placeholder="Adarsh Sharma"
                    className="w-full bg-[#111] border border-[#222] focus:border-white text-white px-3 py-2 text-xs outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono text-[#777] uppercase tracking-wider block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-[#111] border border-[#222] focus:border-white text-white px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#777] uppercase tracking-wider block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111] border border-[#222] focus:border-white text-white px-3 py-2 text-xs outline-none"
                />
              </div>

              {errorMsg && <p className="text-xs text-red-500 font-mono">{errorMsg}</p>}

              <button type="submit" disabled={loading} className="w-full btn-luxury-primary py-3.5 text-xs">
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isRegister ? (
                  "REGISTER ACCOUNT →"
                ) : (
                  "SIGN IN →"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setErrorMsg(""); }}
                className="text-[11px] font-mono text-[#777] hover:text-white uppercase tracking-wider"
              >
                {isRegister
                  ? "Already have an account? Sign In"
                  : "New to Gudumba? Create an Account"}
              </button>
            </div>
          </div>
        )}

        {/* Demo credentials hint */}
        <div className="mt-8 p-3 bg-[#0d0d0d] border border-[#1a1a1a] text-[10px] font-mono text-[#666]">
          <span className="text-[#c8410a] font-bold block mb-0.5">ADMIN OVERRIDE:</span>
          admin@gudumba.in / Gudumba@2026!
        </div>
      </div>

      <Footer />
    </div>
  );
}

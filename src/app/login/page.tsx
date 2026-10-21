"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/Toaster";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          toast("Account created successfully! Welcome to Gudumba.", "success");
          router.push("/account");
        } else {
          setErrorMsg(data.error || "Failed to create account.");
        }
      } else {
        const res = await login(form.email, form.password);
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
    <div className="pt-32 pb-24 min-h-screen bg-[#050505] flex flex-col justify-between">
      <div className="max-w-md mx-auto px-6 w-full">
        {/* Toggle Mode */}
        <div className="flex border-b border-[#222] mb-8">
          <button
            onClick={() => { setIsRegister(false); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] border-b-2 transition-colors ${
              !isRegister ? "border-[#c8410a] text-white" : "border-transparent text-[#666]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsRegister(true); setErrorMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] border-b-2 transition-colors ${
              isRegister ? "border-[#c8410a] text-white" : "border-transparent text-[#666]"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="g-display text-4xl sm:text-5xl text-[#f2f0ed] mb-2">
            {isRegister ? "JOIN THE CIRCLE" : "WELCOME BACK"}
          </h1>
          <p className="text-xs text-[#777] uppercase tracking-wider font-mono">
            {isRegister
              ? "Track your orders, save items, get early drop access."
              : "Access your orders, saved addresses, and profile."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Adarsh Sharma"
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#c8410a] text-[#f2f0ed] px-3 py-2.5 text-xs rounded-xs outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#c8410a] text-[#f2f0ed] px-3 py-2.5 text-xs rounded-xs outline-none"
            />
          </div>

          {isRegister && (
            <div>
              <label className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#c8410a] text-[#f2f0ed] px-3 py-2.5 text-xs rounded-xs outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] text-[#777] uppercase tracking-wider block mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-[#121212] border border-[#2a2a2a] focus:border-[#c8410a] text-[#f2f0ed] px-3 py-2.5 text-xs rounded-xs outline-none"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-mono py-1">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-xs tracking-[0.2em] py-3.5 mt-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRegister ? (
              "REGISTER ACCOUNT →"
            ) : (
              "ENTER STORE →"
            )}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

import Footer from "@/components/Footer";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#100f0d] text-[#ccc]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <span className="text-[#b59a68] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">Get in touch</span>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">CONTACT</h1>
        <p className="text-sm leading-relaxed text-[#999]">The business owner has not provided a verified customer support address or phone number yet. Add a monitored contact channel before publishing this page or accepting orders.</p>
      </div>
      <Footer />
    </div>
  );
}

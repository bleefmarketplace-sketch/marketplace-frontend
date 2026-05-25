"use client";
import LandingPagesNav from "@/components/LandingPagesNav";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, CheckCircle, Shield, Sprout, Users, Star,
  TrendingUp, Package, BookOpen, MapPin, Truck, X,
  MessageCircle, Mail, ChevronRight, Play, Award, Leaf,
  BarChart2, ShieldCheck, HelpCircle
} from "lucide-react";
import Footer from "@/components/Marketplace/Footer";

/* ─────────────────────────────────────────────
   Newsletter / CTA Popup
   Overhauled to Sharp flat B2B aesthetic
───────────────────────────────────────────── */
function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const seen = sessionStorage.getItem("nl_seen");
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("nl_seen", "1");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success || data.data?.success) {
        setSubmitted(true);
        setTimeout(dismiss, 5000);
      } else {
        setError(data.message || "This email might already be subscribed.");
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative bg-white rounded-none shadow-md border border-zinc-300 max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-98 duration-300">
        
        {/* Header Block - Dark Terminal */}
        <div className="bg-zinc-950 p-6 text-white relative overflow-hidden border-b border-zinc-800">
          <button onClick={dismiss} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-all hover:rotate-90 duration-300">
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="relative z-10 space-y-3 font-mono">
            <div className="w-10 h-10 bg-green-900 border border-green-700 flex items-center justify-center rounded-none">
              <Sprout size={20} className="text-green-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-green-500 font-bold block">Secure Direct Trade</span>
              <h2 className="text-xl font-bold tracking-tight uppercase leading-tight mt-0.5">
                Weekly Commodity Indices
              </h2>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 font-mono text-xs">
          {!submitted ? (
            <>
              <p className="text-zinc-600 font-sans leading-relaxed">
                Join <strong className="text-green-800 font-bold">4,000+ agribusiness leaders</strong> receiving weekly terminal price indexes, market intelligence, and verified logistics reports.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="ENTER ENTERPRISE EMAIL"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-none px-4 py-3 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-green-600 focus:bg-white focus:ring-1 focus:ring-green-600/30 transition-all font-mono"
                />
                {error && <p className="text-red-600 font-bold text-[10px]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-3 rounded-none transition-colors flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  {loading ? "PROCESSING..." : "REGISTER FOR REPORT"}
                </button>
              </form>
              <button onClick={dismiss} className="w-full text-center text-[9px] font-bold text-zinc-400 hover:text-green-700 transition-colors tracking-widest uppercase">
                Skip Registry Feed
              </button>
            </>
          ) : (
            <div className="text-center py-6 space-y-4 font-mono animate-in zoom-in-98">
              <div className="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto rounded-none">
                <CheckCircle size={32} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-950 uppercase">REGISTRY COMPLETED</h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-sans">Verification code transmitted to your corporate mailbox.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WhatsApp Floating CTA
───────────────────────────────────────────── */
function WhatsAppCTA() {
  const [tooltip, setTooltip] = useState(true);
  const phone = "+2348133012510";
  const message = encodeURIComponent("Hi Bleefy! I'd like to learn more about your agricultural marketplace.");
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group select-none"
      aria-label="Chat on WhatsApp"
    >
      {tooltip && (
        <div className="bg-white shadow-md rounded-none px-3.5 py-2 text-[10px] font-mono font-bold text-zinc-800 border border-zinc-200 flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
          <span>💬 TERMINAL CONTACT</span>
          <button onClick={e => { e.preventDefault(); setTooltip(false); }}
            className="text-zinc-400 hover:text-zinc-600 ml-1">
            <X size={12} />
          </button>
        </div>
      )}
      <div className="w-12 h-12 rounded-none bg-[#25D366] border border-green-600 flex items-center justify-center shadow-md hover:scale-105 transition-transform">
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Stats Strip - Line separated Monospace
───────────────────────────────────────────── */
const STATS = [
  { label: "Active Farmers Registered", value: "12,000+", icon: Users },
  { label: "Commodities Cataloged", value: "45,000+", icon: Package },
  { label: "Geopolitical States Covered", value: "36 States", icon: MapPin },
  { label: "Verified Enterprise Sellers", value: "2,400+", icon: ShieldCheck },
];

/* ─────────────────────────────────────────────
   Category Pills - Flat Upper-case B2B pills
───────────────────────────────────────────── */
const CATEGORIES = [
  { label: "Grains & Cereals", emoji: "🌾", href: "/marketplace?category=grains" },
  { label: "Livestock Input", emoji: "🐄", href: "/marketplace?category=livestock" },
  { label: "Vegetable Crops", emoji: "🥦", href: "/marketplace?category=vegetables" },
  { label: "Seeds & Inputs", emoji: "🌱", href: "/marketplace?category=seeds" },
  { label: "Heavy Equipment", emoji: "🚜", href: "/marketplace?category=equipment" },
  { label: "Fish & Seafood", emoji: "🐟", href: "/marketplace?category=fish" },
  { label: "Agronomy Courses", emoji: "📚", href: "/marketplace?category=digital" },
  { label: "Fertilizer Complex", emoji: "🧪", href: "/marketplace?category=fertilizers" },
];

/* ─────────────────────────────────────────────
   Main Home Component
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col selection:bg-green-700 selection:text-white">
      <NewsletterPopup />
      <WhatsAppCTA />
      <LandingPagesNav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center border-b border-zinc-300">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80"
            alt="Farm landscape"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/75 backdrop-blur-xs border border-zinc-800 text-[10px] font-mono font-bold tracking-widest text-green-400 uppercase rounded-none select-none">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-none animate-pulse" />
              NIGERIA&apos;S SOVEREIGN AGRI-COMMODITIES INDEX
            </div>
            <h1 className="text-4xl md:text-6xl font-mono font-black tracking-tight leading-[1.1] uppercase">
              Direct Broadacre<br />
              <span className="text-green-400">Trade Escrow.</span>
            </h1>
            <p className="text-sm font-sans text-zinc-300 leading-relaxed max-w-lg">
              Procure crop lots directly from verified Nigerian agricultural cooperatives. Secure physical custody lines using neutral, locked escrow structures. Link enterprise buyers with agronomic intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/marketplace"
                className="px-6 py-3 bg-green-700 border border-green-700 text-white font-mono text-xs uppercase tracking-wider font-black hover:bg-green-800 hover:border-green-850 transition-colors flex items-center justify-center gap-2 rounded-none shadow-xs">
                SHOP COMMODITY INDEX <ArrowRight size={14} />
              </Link>
              <Link href="/auth/signup"
                className="px-6 py-3 bg-zinc-950/50 backdrop-blur-xs border border-zinc-700 text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-zinc-900/50 transition-colors text-center rounded-none">
                REGISTER AS MERCHANT
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
              {["Escrow-Protected Payments", "Cooperatives Verified", "Carrier Shipment Logs"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-green-400" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-zinc-950 text-white border-b border-zinc-800 py-8 select-none font-mono text-xs uppercase tracking-tight">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 border-r last:border-r-0 border-zinc-800">
              <Icon size={18} className="text-green-500 shrink-0" />
              <p className="text-2xl font-black tracking-tight text-white">{value}</p>
              <p className="text-zinc-500 text-[9px] font-bold tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-mono font-black tracking-tight text-zinc-950 uppercase">Browse Commodity registry</h2>
              <p className="text-zinc-500 text-xs font-sans">Physical produce and industrial inputs cataloged statefully across Nigeria</p>
            </div>
            <Link href="/marketplace" className="text-green-700 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1 hover:underline shrink-0">
              All Registries <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href={cat.href}
                className="flex flex-col items-center gap-2.5 p-4 bg-white border border-zinc-200 hover:border-green-600 hover:shadow-xs transition-all group text-center rounded-none">
                <span className="text-2xl group-hover:scale-105 transition-transform select-none">{cat.emoji}</span>
                <span className="text-[10px] font-mono font-bold text-zinc-700 group-hover:text-zinc-950 leading-tight block uppercase tracking-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BLEEFY vs COMPETITORS ── */}
      <section className="py-16 bg-white border-t border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-green-700 font-mono font-bold text-[10px] uppercase tracking-widest">COVENANT B2B CAPABILITIES</span>
            <h2 className="text-2xl font-mono font-black text-zinc-950 uppercase">More than just a standard catalog</h2>
            <p className="text-zinc-500 text-xs font-sans mt-1">We unite sovereign escrow payments, automated AI content verification, and a professional broadacre farmer network—features consumer lists cannot support.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                color: "bg-green-50 text-green-800 border-green-200",
                title: "Escrow-Protected Payments",
                desc: "Enterprise transaction funds remain held in neutral vault layers until physical arrival validation. Restricts default risks completely.",
                badge: "Unique Escrow Lock"
              },
              {
                icon: BookOpen,
                color: "bg-zinc-100 text-zinc-800 border-zinc-300",
                title: "Agri Learning Platform",
                desc: "Expert-certified digital tutorials and soil guides published by academic specialists. Focuses on broadacre optimization.",
                badge: "Educational Vault"
              },
              {
                icon: BarChart2,
                color: "bg-zinc-100 text-zinc-800 border-zinc-300",
                title: "AI Technical Spec Audit",
                desc: "All dynamic listings and crop tutorials are checked automatically by neural compliance bots for dry-weight indices.",
                badge: "AI Compliance Check"
              },
              {
                icon: Truck,
                color: "bg-zinc-100 text-zinc-800 border-zinc-300",
                title: "Carrier Logistics Tracking",
                desc: "Monitor freight carrier routes, train cargo schedules, and terminal drop-offs. Releases escrow upon confirmation.",
                badge: "Real-time Carriage"
              },
              {
                icon: Award,
                color: "bg-zinc-100 text-zinc-800 border-zinc-300",
                title: "Verified Registry Badging",
                desc: "Cooperative sellers undergo systematic academic and legal verification. Only validated lots enter the trade index.",
                badge: "Sovereign Registry"
              },
              {
                icon: TrendingUp,
                color: "bg-zinc-100 text-zinc-800 border-zinc-300",
                title: "Merchant Analytics Overlay",
                desc: "Review crop batch yield potentials, seasonal pricing curves, and monthly procurement indexes within clean dashboards.",
                badge: "Trading Intelligence"
              },
            ].map(f => (
              <div key={f.title} className="bg-white border border-zinc-200 p-6 rounded-none hover:border-zinc-400 shadow-xs space-y-4 text-left">
                <div className={`w-10 h-10 border rounded-none flex items-center justify-center ${f.color}`}>
                  <f.icon size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-mono font-bold text-zinc-950 text-sm uppercase">{f.title}</h3>
                  <p className="text-zinc-500 text-xs font-sans leading-relaxed">{f.desc}</p>
                </div>
                <span className="inline-block text-[9px] font-mono font-bold text-green-800 bg-green-50 px-2 py-0.5 border border-green-200 uppercase tracking-tight">{f.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 space-y-1">
            <h2 className="text-xl font-mono font-black text-zinc-950 uppercase">Covenant Sowing & Trade Process</h2>
            <p className="text-zinc-500 text-xs font-sans">Initialize broadacre crop trade contracts in minutes</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4 relative">
            {[
              { step: "01", title: "Corporate Registry", desc: "Select role scope (Buyer Portal vs Merchant Command vs Educator Studio) and verify details.", icon: Users },
              { step: "02", title: "Index Batches", desc: "Browse USDA/NGA grade specifications or register physical crop inventory lot records.", icon: Sprout },
              { step: "03", title: "Lock Escrow Line", desc: "Settle payments through paystack integration. Capital remains locked in neutral escrow structures.", icon: Shield },
              { step: "04", title: "Release & Freight", desc: "Verify physical carrier discharge parameters to release secure liquidity directly to farmers.", icon: TrendingUp },
            ].map((s, i) => (
              <div key={s.step} className="relative text-left">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px border-t border-dashed border-zinc-300 z-0 translate-x-[-50%]" />
                )}
                <div className="bg-white border border-zinc-200 p-5 rounded-none hover:shadow-xs transition-all relative z-10 space-y-3 font-mono">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-green-700 text-white flex items-center justify-center rounded-none">
                      <s.icon size={18} />
                    </div>
                    <span className="text-2xl font-black text-zinc-200 leading-none">{s.step}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-950 text-xs uppercase">{s.title}</h3>
                    <p className="text-zinc-500 text-[11px] font-sans leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL LEARNING CTA ── */}
      <section className="py-16 bg-zinc-950 text-white overflow-hidden relative border-b border-zinc-800">
        <div className="absolute inset-0 opacity-10">
          <Image fill src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=60" alt="" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 font-mono">
            <span className="text-green-400 font-bold text-[10px] uppercase tracking-widest block">Educator Studio Access</span>
            <h2 className="text-3xl font-black uppercase leading-tight text-white">
              Sponsor Research. <br />Monetize Agronomy.
            </h2>
            <p className="text-zinc-400 font-sans text-xs leading-relaxed">
              Are you a licensed agronomist, plant genetic specialist, or heavy machinery distributor? Publish digital crop tutorial modules and verified laboratory findings. Earn passive B2B royalties safely under complete AI verification checks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto font-mono">
            <Link href="/auth/signup"
              className="px-6 py-3 bg-white text-zinc-950 border border-white font-black text-xs uppercase tracking-wider hover:bg-zinc-100 transition-colors text-center rounded-none">
              Become Educator
            </Link>
            <Link href="/learning"
              className="px-6 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-900/50 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 rounded-none">
              <Play size={12} /> Browse tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 space-y-1">
            <h2 className="text-xl font-mono font-black text-zinc-950 uppercase">Verified Cooperative Testimonials</h2>
            <p className="text-zinc-500 text-xs font-sans">Active feedback loops from registered Nigerian agribusiness operations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "BOLA ADEYEMI", role: "Maize Cooperative Lead, Oyo", quote: "We loaded our physical maize batch-lot into logistics carriers within 3 days. Escrow protection eliminated merchant payment defaults.", avatar: "BA" },
              { name: "CHIAMAKA OBI", role: "Fisheries Supplier, Anambra", quote: "Agri-cooperative verification badges built immediate buyer trust. Transactions flow smoothly with zero WhatsApp coordinate drops.", avatar: "CO" },
              { name: "DR. TUNDE FASHOLA", role: "Soil Scientist, Lagos Division", quote: "Uploaded three split-nitrogen research tutorials. Cooperative royalties provide substantial passive income, completely verified.", avatar: "TF" },
            ].map(t => (
              <div key={t.name} className="bg-zinc-50 border border-zinc-200 p-6 rounded-none space-y-4 text-left">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-zinc-600 italic font-sans text-xs leading-relaxed">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3 border-t border-zinc-200 pt-3 font-mono">
                  <div className="w-8 h-8 rounded-none border border-zinc-300 bg-zinc-150 flex items-center justify-center text-zinc-800 font-bold text-xs shrink-0">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-zinc-950 text-xs uppercase">{t.name}</p>
                    <p className="text-zinc-400 text-[9px] uppercase font-bold tracking-tight">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 bg-zinc-100 border-t border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-mono font-black text-zinc-950 uppercase leading-tight">
            Ready to secure your crop supply line?
          </h2>
          <p className="text-zinc-600 text-xs font-sans max-w-lg mx-auto">
            Join thousands of modern agribusiness cooperatives and enterprise buyers settling crop trade allocations on Nigeria&apos;s most secure agronomic exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 font-mono">
            <Link href="/auth/signup"
              className="px-8 py-3 bg-green-700 border border-green-700 text-white font-black text-xs uppercase tracking-wider hover:bg-green-800 hover:border-green-850 transition-colors flex items-center justify-center gap-2 rounded-none">
              Register Free <ArrowRight size={14} />
            </Link>
            <Link href="/marketplace"
              className="px-8 py-3 border border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-400 font-bold text-xs uppercase tracking-wider text-center rounded-none">
              Browse Trade Index
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

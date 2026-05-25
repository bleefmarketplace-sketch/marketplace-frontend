"use client";
import LandingPagesNav from "@/components/LandingPagesNav";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, CheckCircle, Shield, Sprout, Users, Star,
  TrendingUp, Package, BookOpen, MapPin, Truck, X,
  MessageCircle, Mail, ChevronRight, Play, Award, Leaf,
  BarChart2, ShieldCheck
} from "lucide-react";
import Footer from "@/components/Marketplace/Footer";

/* ─────────────────────────────────────────────
   Newsletter / CTA Popup
   Overhauled: Sharp, Monospace, Technical Terminal Look
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
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-zinc-950/65 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative bg-white rounded-none border border-zinc-950 shadow-none max-w-md w-full overflow-hidden font-mono animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        
        {/* Banner Block */}
        <div className="bg-green-700 border-b border-green-800 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-none bg-green-600/30 blur-xl" />
          <div className="absolute -left-8 -bottom-8 w-20 h-20 rounded-none bg-green-800/40 blur-lg" />

          <button onClick={dismiss} className="absolute top-4 right-4 text-white/70 hover:text-white transition-all hover:rotate-90 duration-200 cursor-pointer">
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="relative z-10">
            <div className="w-10 h-10 bg-green-900/30 border border-green-600/40 rounded-none flex items-center justify-center mb-3">
              <Sprout size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight leading-tight">
              FRESH DEALS,<br />
              <span className="text-green-200">DIRECT FROM FARMS.</span>
            </h2>
          </div>
        </div>

        <div className="p-6">
          {!submitted ? (
            <>
              <p className="text-zinc-650 text-xs leading-relaxed mb-4 font-sans font-medium">
                Join <strong className="text-green-750 font-bold">4,000+ farmers & buyers</strong> receiving weekly price updates and exclusive agri-tips.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3 font-mono">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-zinc-350 rounded-none px-4 py-3 text-xs placeholder-zinc-400 focus:outline-none focus:border-green-600 transition-colors"
                  />
                </div>
                {error && <p className="text-red-700 text-[10px] font-bold px-1">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-none border border-green-700 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-xs cursor-pointer disabled:opacity-60"
                >
                  {loading ? "PROCESSING..." : <>CLAIM YOUR 5% DISCOUNT <ArrowRight size={14} /></>}
                </button>
              </form>
              <button onClick={dismiss} className="w-full text-center text-[10px] font-bold text-zinc-400 mt-4 hover:text-green-700 transition-colors tracking-widest uppercase cursor-pointer">
                I prefer paying full price
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-50 border border-green-150 rounded-none flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-700" />
              </div>
              <h3 className="font-bold text-md text-zinc-950 uppercase tracking-tight">YOU&apos;RE ALL SET! 🎉</h3>
              <p className="text-zinc-550 text-xs font-sans mt-1">Check your inbox for your exclusive code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WhatsApp Floating CTA
   Overhauled: Compact Technical Flat Widget
 ───────────────────────────────────────────── */
function WhatsAppCTA() {
  const [tooltip, setTooltip] = useState(true);

  const phone = "+2348133012510";
  const message = encodeURIComponent("Hi Bleefy! I'd like to learn more about your agricultural marketplace.");
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {tooltip && (
        <div className="bg-white border border-zinc-200 px-3 py-2 text-[10px] font-mono font-bold text-zinc-800 border-r-0 rounded-none shadow-none flex items-center gap-1.5">
          <span>💬 CHAT WITH US</span>
          <button onClick={e => { e.preventDefault(); setTooltip(false); }}
            className="text-zinc-450 hover:text-zinc-950 ml-1 cursor-pointer">
            <X size={12} />
          </button>
        </div>
      )}
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-none bg-[#25D366] flex items-center justify-center border border-emerald-600 hover:bg-green-500 hover:border-green-600 transition-colors cursor-pointer shadow-none"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </Link>
    </div>
  );
}

const STATS = [
  { label: "Active Farmers", value: "12,000+", icon: Users },
  { label: "Products Listed", value: "45,000+", icon: Package },
  { label: "States Covered", value: "36", icon: MapPin },
  { label: "Verified Sellers", value: "2,400+", icon: ShieldCheck },
];

const CATEGORIES = [
  { label: "Grains & Cereals", emoji: "🌾", href: "/marketplace?category=grains" },
  { label: "Livestock", emoji: "🐄", href: "/marketplace?category=livestock" },
  { label: "Vegetables", emoji: "🥦", href: "/marketplace?category=vegetables" },
  { label: "Seeds & Inputs", emoji: "🌱", href: "/marketplace?category=seeds" },
  { label: "Equipment", emoji: "🚜", href: "/marketplace?category=equipment" },
  { label: "Fish & Seafood", emoji: "🐟", href: "/marketplace?category=fish" },
  { label: "Digital Courses", emoji: "📚", href: "/marketplace?category=digital" },
  { label: "Fertilizers", emoji: "🧪", href: "/marketplace?category=fertilizers" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col antialiased">
      <NewsletterPopup />
      <WhatsAppCTA />
      <LandingPagesNav />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center border-b border-zinc-200">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80"
            alt="Farm landscape"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-zinc-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-zinc-950/90 text-white border border-zinc-800 font-mono uppercase font-bold text-[10px] tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-none animate-pulse" />
              NIGERIA&apos;S #1 AGRICULTURAL MARKETPLACE
            </div>
            <h1 className="text-4xl md:text-6xl font-mono font-black tracking-tight mb-6 uppercase leading-tight">
              FROM FARM<br />
              <span className="text-green-600">TO YOUR TABLE.</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-300 mb-8 leading-relaxed max-w-lg font-sans">
              Buy directly from verified Nigerian farmers. Sell your harvest nationwide.
              Learn from expert agri-educators — all secured by escrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 font-mono text-xs font-bold uppercase tracking-wider">
              <Link href="/marketplace"
                className="px-6 py-4 bg-green-700 text-white border border-green-700 hover:bg-green-800 transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer">
                SHOP THE MARKETPLACE <ArrowRight size={16} />
              </Link>
              <Link href="/auth/signup"
                className="px-6 py-4 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-center text-white rounded-none cursor-pointer">
                START SELLING FREE
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-bold">
              {["Escrow-Protected Payments", "Verified Farmers", "Nationwide Delivery"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-700" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/35 font-mono text-[9px] uppercase tracking-widest animate-bounce">
          <span>SCROLL</span>
          <div className="w-px h-6 bg-white/20" />
        </div>
      </section>

      {/* ── STATS STRIP SECTION ── */}
      <section className="bg-zinc-950 text-white py-12 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon size={20} className="text-green-600" />
              <p className="text-2xl font-black text-zinc-50">{value}</p>
              <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ── */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 font-mono">
            <div>
              <span className="text-[10px] tracking-widest text-green-700 font-bold uppercase">GOODS CATALOG</span>
              <h2 className="text-2xl font-black text-zinc-950 uppercase mt-1">BROWSE BY CATEGORY</h2>
              <p className="text-zinc-500 text-xs font-sans mt-1">Fresh produce and agri-goods from across Nigeria</p>
            </div>
            <Link href="/marketplace" className="text-green-700 hover:text-green-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1 border border-zinc-250 hover:bg-zinc-100/50 py-1.5 px-3">
              ALL CATEGORIES <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-[10px] uppercase font-bold tracking-wider">
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href={cat.href}
                className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-none border border-zinc-200 hover:border-green-700 hover:bg-zinc-50 transition-colors group text-center cursor-pointer">
                <span className="text-2xl group-hover:scale-105 transition-transform">{cat.emoji}</span>
                <span className="text-zinc-700 leading-tight block">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BLEEFY FEATURES GRID ── */}
      <section className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 font-mono">
            <span className="px-2.5 py-1 text-[9px] bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-wider">
              BLEEFY TRUST ARCHITECTURE
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-950 uppercase mt-4">MORE THAN JUST A MARKETPLACE</h2>
            <p className="text-zinc-500 text-xs font-sans mt-2">We combine secure escrow payments, AI content verification, and a vibrant farming community — features competitors simply don&apos;t offer.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 font-mono">
            {[
              {
                icon: ShieldCheck,
                color: "bg-green-50 border-green-200 text-green-700",
                title: "ESCROW-PROTECTED PAYMENTS",
                desc: "Your money is held securely until you confirm delivery. No risk, no fraud — your funds never leave escrow until you're satisfied.",
                badge: "Unique to Bleefy"
              },
              {
                icon: BookOpen,
                color: "bg-zinc-50 border-zinc-200 text-zinc-650",
                title: "AGRI LEARNING PLATFORM",
                desc: "Expert-verified digital courses and guides from Nigerian agricultural specialists. Learn crop science, livestock management and more.",
                badge: "20+ Courses"
              },
              {
                icon: BarChart2,
                color: "bg-zinc-50 border-zinc-200 text-zinc-650",
                title: "AI CONTENT AUDIT",
                desc: "Every digital product is automatically scored by our AI for accuracy and safety before it reaches buyers. Quality guaranteed.",
                badge: "AI-Powered"
              },
              {
                icon: Truck,
                color: "bg-zinc-50 border-zinc-200 text-zinc-650",
                title: "REAL-TIME ORDER TRACKING",
                desc: "Track your farm produce from seller to doorstep. Sellers get notified instantly, buyers confirm delivery with one tap.",
                badge: "End-to-End"
              },
              {
                icon: Award,
                color: "bg-zinc-50 border-zinc-200 text-zinc-650",
                title: "VERIFIED SELLER BADGES",
                desc: "Every seller goes through our admin verification process. Only approved, legitimate farms and suppliers can list products.",
                badge: "Trust System"
              },
              {
                icon: TrendingUp,
                color: "bg-zinc-50 border-zinc-200 text-zinc-650",
                title: "SELLER ANALYTICS DASHBOARD",
                desc: "Know your top products, revenue trends, and customer engagement — all in a clean dashboard built for farm businesses.",
                badge: "Business Intelligence"
              },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-none border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-350 transition-colors">
                <div>
                  <div className={`w-10 h-10 border rounded-none flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon size={18} />
                  </div>
                  <h3 className="font-bold text-zinc-950 text-xs mb-2 tracking-wide uppercase">{f.title}</h3>
                  <p className="text-zinc-500 text-xs font-sans leading-relaxed mb-4">{f.desc}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-150 uppercase tracking-wider">{f.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS STEPS ── */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 font-mono">
            <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">TRANSACTION MATRIX</span>
            <h2 className="text-2xl font-black text-zinc-950 mt-1 uppercase">HOW BLEEFY WORKS</h2>
            <p className="text-zinc-500 text-xs font-sans mt-1">Start buying or selling Nigerian farm products in minutes</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4 font-mono text-left">
            {[
              { step: "01", title: "CREATE FREE ACCOUNT", desc: "Sign up in 60 seconds. Choose your role — buyer, seller or creator.", icon: Users },
              { step: "02", title: "BROWSE OR LIST", desc: "Explore thousands of farm products or list your own harvest for sale.", icon: Sprout },
              { step: "03", title: "PAY SECURELY", desc: "Checkout via Paystack or Flutterwave. Funds held in escrow until delivery.", icon: Shield },
              { step: "04", title: "CONFIRM & GROW", desc: "Confirm delivery to release payment. Leave a review and keep growing.", icon: TrendingUp },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-none p-5 border border-zinc-200 flex flex-col justify-between hover:border-zinc-350 transition-colors">
                <div>
                  <div className="w-10 h-10 bg-green-700 text-white rounded-none flex items-center justify-center mb-4">
                    <s.icon size={18} />
                  </div>
                  <span className="text-2xl font-black text-zinc-300 block leading-none mb-1">{s.step}</span>
                  <h3 className="font-bold text-zinc-950 text-xs mb-1.5 uppercase">{s.title}</h3>
                  <p className="text-zinc-500 text-[11px] font-sans leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL LEARNING CTA ── */}
      <section className="py-20 bg-green-950 text-white overflow-hidden relative border-b border-green-900">
        <div className="absolute inset-0 opacity-10 z-0">
          <Image fill src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=60" alt="" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 font-mono">
          <div className="max-w-xl">
            <span className="text-green-500 font-bold text-[10px] uppercase tracking-widest">CREATOR PLATFORM</span>
            <h2 className="text-3xl font-black mt-2 mb-4 leading-tight uppercase">
              TEACH WHAT YOU KNOW. <br />EARN WHAT YOU DESERVE.
            </h2>
            <p className="text-zinc-300 text-xs font-sans leading-relaxed">
              Are you an agronomist, livestock expert or farming consultant?
              Upload courses, guides or eBooks and earn passive income — while our AI validates your content for credibility.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto font-mono text-xs font-bold uppercase tracking-wider">
            <Link href="/auth/signup"
              className="px-6 py-3.5 bg-white text-green-900 hover:bg-zinc-100 transition-colors rounded-none text-center cursor-pointer shadow-none">
              BECOME A CREATOR
            </Link>
            <Link href="/learning"
              className="px-6 py-3.5 border border-green-800 text-green-400 hover:bg-green-900/40 transition-colors rounded-none text-center flex items-center justify-center gap-2 cursor-pointer">
              <Play size={14} className="fill-green-400 text-green-400" /> BROWSE COURSES
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF SECTION ── */}
      <section className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 font-mono">
          <div className="text-center mb-12">
            <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">VERIFIED SUCCESS DATA</span>
            <h2 className="text-2xl font-black text-zinc-950 mt-1 uppercase">TRUSTED BY NIGERIAN FARMERS</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { name: "Bola Adeyemi", role: "Maize Farmer, Oyo", quote: "I sold my first harvest within 3 days of listing. The escrow gave my buyers confidence to pay without hesitation.", avatar: "BA" },
              { name: "Chiamaka Obi", role: "Catfish Seller, Anambra", quote: "Bleefy's verification badge made customers trust me instantly. My revenue doubled in 2 months compared to WhatsApp sales.", avatar: "CO" },
              { name: "Dr. Tunde Fashola", role: "Agri Educator, Lagos", quote: "I uploaded 3 courses and earn ₦80,000 monthly passively. The AI audit system is brilliant — it keeps quality high.", avatar: "TF" },
            ].map(t => (
              <div key={t.name} className="bg-zinc-50 border border-zinc-200 p-6 rounded-none flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-500 text-amber-500" />)}
                  </div>
                  <p className="text-zinc-700 italic text-xs leading-relaxed font-sans mb-6">&quot;{t.quote}&quot;</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none bg-green-700 text-white flex items-center justify-center font-bold text-xs shrink-0">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-zinc-900 text-xs uppercase block">{t.name}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase block mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION ── */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 text-center font-mono">
          <span className="px-2.5 py-1 text-[9px] bg-green-50 text-green-800 border border-green-200 font-bold uppercase tracking-wider inline-block mb-4">
            GROW YOUR AGRONOMY CHANNELS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-950 mb-3 uppercase leading-tight">
            READY TO GROW YOUR FARM BUSINESS?
          </h2>
          <p className="text-zinc-500 text-xs font-sans mb-8 leading-relaxed max-w-lg mx-auto">
            Join thousands of Nigerian farmers buying and selling on the most trusted agri-marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-xs font-bold uppercase tracking-wider">
            <Link href="/auth/signup"
              className="px-8 py-3.5 bg-green-700 text-white hover:bg-green-800 transition-colors border border-green-700 rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-none">
              JOIN FOR FREE <ArrowRight size={16} />
            </Link>
            <Link href="/marketplace"
              className="px-8 py-3.5 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition-colors rounded-none text-center cursor-pointer">
              BROWSE MARKETPLACE
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

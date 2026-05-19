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
        setTimeout(dismiss, 5000); // Give user time to read success message
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
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] max-w-md w-full overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-500 border border-white/20">
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-emerald-400/30 blur-xl" />
          
          <button onClick={dismiss} className="absolute top-5 right-5 text-white/60 hover:text-white transition-all hover:rotate-90 duration-300">
            <X size={24} strokeWidth={3} />
          </button>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/30">
              <Sprout size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-black leading-[1.1] tracking-tight">
              Fresh Deals,<br />
              <span className="text-emerald-100">Direct From Farms.</span>
            </h2>
          </div>
        </div>
        <div className="p-8 pt-6">
          {!submitted ? (
            <>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                Join <strong className="text-emerald-600 font-bold">4,000+ farmers & buyers</strong> receiving weekly price updates and exclusive agri-tips.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 group-hover:border-gray-200"
                  />
                </div>
                {error && <p className="text-rose-500 text-xs font-bold px-1 animate-pulse">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 text-base"
                >
                  {loading ? "Processing..." : <>Claim Your 5% Discount <ArrowRight size={18} strokeWidth={3} /></>}
                </button>
              </form>
              <button onClick={dismiss} className="w-full text-center text-xs font-bold text-gray-400 mt-6 hover:text-emerald-600 transition-colors tracking-wide uppercase">
                I prefer paying full price
              </button>
            </>
          ) : (
            <div className="text-center py-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h3 className="font-black text-2xl text-gray-900 tracking-tight">You&apos;re All Set! 🎉</h3>
              <p className="text-gray-500 text-sm mt-2 font-medium">Check your inbox for your exclusive code.</p>
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

  // Replace with your actual WhatsApp number (no +, no spaces)
  const phone = "2348000000000";
  const message = encodeURIComponent("Hi Bleefy! I'd like to learn more about your agricultural marketplace.");
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      aria-label="Chat on WhatsApp"
    >
      {tooltip && (
        <div className="bg-white shadow-xl rounded-2xl px-4 py-2.5 text-sm font-bold text-gray-800 animate-in slide-in-from-right-4 duration-300 border border-gray-100 flex items-center gap-2">
          <span>💬 Chat with us</span>
          <button onClick={e => { e.preventDefault(); setTooltip(false); }}
            className="text-gray-400 hover:text-gray-600 ml-1">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xl shadow-green-400/40 hover:scale-110 transition-transform">
        {/* WhatsApp icon SVG */}
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Stats Strip
───────────────────────────────────────────── */
const STATS = [
  { label: "Active Farmers", value: "12,000+", icon: Users },
  { label: "Products Listed", value: "45,000+", icon: Package },
  { label: "States Covered", value: "36", icon: MapPin },
  { label: "Verified Sellers", value: "2,400+", icon: ShieldCheck },
];

/* ─────────────────────────────────────────────
   Category Pills
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <NewsletterPopup />
      <WhatsAppCTA />
      <LandingPagesNav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2532&q=80"
            alt="Farm landscape"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-sm font-bold mb-6 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Nigeria&apos;s #1 Agricultural Marketplace
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
              From Farm<br />
              <span className="text-emerald-400">To Your Table.</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
              Buy directly from verified Nigerian farmers. Sell your harvest nationwide.
              Learn from expert agri-educators — all secured by escrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace"
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/30">
                Shop the Marketplace <ArrowRight size={20} />
              </Link>
              <Link href="/auth/signup"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all text-center">
                Start Selling Free
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-sm font-medium text-gray-300">
              {["Escrow-Protected Payments", "Verified Farmers", "Nationwide Delivery"].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce">
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-white/20" />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-emerald-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={24} className="text-emerald-400" />
              <p className="text-3xl font-black">{value}</p>
              <p className="text-emerald-300 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Browse by Category</h2>
              <p className="text-gray-500 mt-1">Fresh produce and agri-goods from across Nigeria</p>
            </div>
            <Link href="/marketplace" className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
              All Categories <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.label} href={cat.href}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group text-center">
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <span className="text-xs font-bold text-gray-700 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BLEEFY vs COMPETITORS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest">Why Choose Bleefy</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">More than just a marketplace</h2>
            <p className="text-gray-500 mt-3">We combine secure escrow payments, AI content verification, and a vibrant farming community — features competitors simply don&apos;t offer.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                color: "bg-emerald-50 text-emerald-600",
                title: "Escrow-Protected Payments",
                desc: "Your money is held securely until you confirm delivery. No risk, no fraud — your funds never leave escrow until you're satisfied.",
                badge: "Unique to Bleefy"
              },
              {
                icon: BookOpen,
                color: "bg-blue-50 text-blue-600",
                title: "Agri Learning Platform",
                desc: "Expert-verified digital courses and guides from Nigerian agricultural specialists. Learn crop science, livestock management and more.",
                badge: "20+ Courses"
              },
              {
                icon: BarChart2,
                color: "bg-purple-50 text-purple-600",
                title: "AI Content Audit",
                desc: "Every digital product is automatically scored by our AI for accuracy and safety before it reaches buyers. Quality guaranteed.",
                badge: "AI-Powered"
              },
              {
                icon: Truck,
                color: "bg-orange-50 text-orange-600",
                title: "Real-Time Order Tracking",
                desc: "Track your farm produce from seller to doorstep. Sellers get notified instantly, buyers confirm delivery with one tap.",
                badge: "End-to-End"
              },
              {
                icon: Award,
                color: "bg-amber-50 text-amber-600",
                title: "Verified Seller Badges",
                desc: "Every seller goes through our admin verification process. Only approved, legitimate farms and suppliers can list products.",
                badge: "Trust System"
              },
              {
                icon: TrendingUp,
                color: "bg-rose-50 text-rose-600",
                title: "Seller Analytics Dashboard",
                desc: "Know your top products, revenue trends, and customer engagement — all in a clean dashboard built for farm businesses.",
                badge: "Business Intelligence"
              },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{f.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{f.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How Bleefy Works</h2>
            <p className="text-gray-500">Start buying or selling Nigerian farm products in minutes</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Create Free Account", desc: "Sign up in 60 seconds. Choose your role — buyer, seller or creator.", icon: Users },
              { step: "02", title: "Browse or List", desc: "Explore thousands of farm products or list your own harvest for sale.", icon: Sprout },
              { step: "03", title: "Pay Securely", desc: "Checkout via Paystack or Flutterwave. Funds held in escrow until delivery.", icon: Shield },
              { step: "04", title: "Confirm & Grow", desc: "Confirm delivery to release payment. Leave a review and keep growing.", icon: TrendingUp },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-gray-200 z-0 translate-x-[-50%]" />
                )}
                <div className="bg-white rounded-3xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow relative z-10">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                    <s.icon size={26} />
                  </div>
                  <span className="text-4xl font-black text-gray-100">{s.step}</span>
                  <h3 className="font-black text-gray-900 mt-1 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL LEARNING CTA ── */}
      <section className="py-20 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <Image fill src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=60" alt="" className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Creator Platform</span>
            <h2 className="text-4xl font-black mt-2 mb-4 leading-snug">
              Teach What You Know. <br />Earn What You Deserve.
            </h2>
            <p className="text-emerald-200 leading-relaxed">
              Are you an agronomist, livestock expert or farming consultant?
              Upload courses, guides or eBooks and earn passive income — while our AI validates your content for credibility.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Link href="/auth/signup"
              className="px-8 py-4 bg-white text-emerald-800 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all text-center shadow-xl">
              Become a Creator
            </Link>
            <Link href="/learning"
              className="px-8 py-4 border border-emerald-600 text-emerald-300 rounded-2xl font-bold hover:bg-emerald-800/50 transition-all text-center flex items-center justify-center gap-2">
              <Play size={18} /> Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12">Trusted by Nigerian Farmers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Bola Adeyemi", role: "Maize Farmer, Oyo", quote: "I sold my first harvest within 3 days of listing. The escrow gave my buyers confidence to pay without hesitation.", avatar: "BA" },
              { name: "Chiamaka Obi", role: "Catfish Seller, Anambra", quote: "Bleefy's verification badge made customers trust me instantly. My revenue doubled in 2 months compared to WhatsApp sales.", avatar: "CO" },
              { name: "Dr. Tunde Fashola", role: "Agri Educator, Lagos", quote: "I uploaded 3 courses and earn ₦80,000 monthly passively. The AI audit system is brilliant — it keeps quality high.", avatar: "TF" },
            ].map(t => (
              <div key={t.name} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-700 italic leading-relaxed mb-6">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Ready to grow your farm business?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of Nigerian farmers buying and selling on the most trusted agri-marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup"
              className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2">
              Join for Free <ArrowRight size={20} />
            </Link>
            <Link href="/marketplace"
              className="px-10 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-emerald-500 transition-all text-center">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

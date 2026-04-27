"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart, Lock, Shield, Users } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";

const stats = [
  { label: "Total Invested", value: "$42.7M" },
  { label: "Active Users", value: "18,400+" },
  { label: "Average ROI", value: "11.8%" },
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonials = [
    {
      quote: "Fast onboarding, clear metrics, and elegant dashboard tools.",
      author: "Amelia R.",
      role: "Private Investor",
    },
    {
      quote: "The plan structure and risk visibility make decisions simpler every week.",
      author: "Marco D.",
      role: "Portfolio Manager",
    },
    {
      quote: "The premium UX gives confidence every time I check my portfolio.",
      author: "Priya N.",
      role: "Growth Partner",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length), 4500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(42,75,156,0.4),transparent_45%)]" />
      <div className="particle-layer">
        {Array.from({ length: 18 }).map((_, idx) => (
          <span
            key={idx}
            className="particle"
            style={{
              width: `${6 + ((idx * 7) % 10)}px`,
              height: `${6 + ((idx * 7) % 10)}px`,
              left: `${(idx * 13) % 100}%`,
              bottom: `${-20 - ((idx * 17) % 120)}px`,
              animationDuration: `${8 + (idx % 6)}s`,
              animationDelay: `${(idx % 7) * 0.7}s`,
            }}
          />
        ))}
      </div>
      <PageShell className="space-y-12 md:space-y-14 xl:space-y-16">
        <section className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="content-rhythm">
            <p className="section-kicker">Precision Wealth Platform</p>
            <h1 className="font-heading text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]">
              Premium Investing, <span className="text-gold">Built for Confidence</span>
            </h1>
            <p className="body-lead max-w-xl">
              Speed Global Trade helps you grow wealth with curated plans, transparent performance, and a modern
              experience.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/signup" className="gold-button">
                Start Investing
              </Link>
              <Link href="/plans" className="rounded-full border border-white/20 px-5 py-2.5 transition hover:-translate-y-0.5 hover:border-gold hover:bg-white/5">
                View Plans
              </Link>
            </div>
          </motion.div>
          <div className="glass glow-ring p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
              {stats.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="hover-lift rounded-xl bg-white/5 p-3.5 sm:p-4"
                >
                  <p className="text-[0.68rem] uppercase tracking-wide text-mutedText">{item.label}</p>
                  <p className="mt-1.5 text-xl font-semibold leading-tight text-gold sm:text-[1.38rem]">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {[{ i: Shield, t: "Secure Architecture" }, { i: BarChart, t: "Smart Analytics" }, { i: Users, t: "Expert Team" }].map(
            (item) => (
              <motion.div
                key={item.t}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass hover-lift glow-ring p-4 md:p-5"
              >
                <item.i className="h-6 w-6 text-gold transition-transform duration-300 group-hover:scale-105" />
                <h3 className="mt-2.5 font-heading text-[1.15rem] leading-tight md:text-xl">{item.t}</h3>
                <p className="mt-1.5 text-sm leading-6 text-mutedText">Designed for trust, performance, and smooth growth.</p>
              </motion.div>
            ),
          )}
        </section>
        <section className="space-y-3 md:space-y-4">
          <h2 className="section-title">How It Works</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            {["Create account", "Fund wallet", "Choose plan & grow"].map((step, idx) => (
              <motion.div key={step} whileHover={{ y: -4, scale: 1.01 }} className="glass hover-lift p-4 md:p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold/90">Step {idx + 1}</p>
                <p className="mt-1.5 text-[1.05rem] leading-snug md:text-lg">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="glass glow-ring p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl">Investor Testimonials</h2>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous testimonial"
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="rounded-full border border-white/20 p-2 transition hover:border-gold hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next testimonial"
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="rounded-full border border-white/20 p-2 transition hover:border-gold hover:bg-white/10"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 min-h-[136px] md:mt-5">
            {testimonials.map((item, index) => (
              <motion.blockquote
                key={item.author}
                initial={false}
                animate={{
                  opacity: testimonialIndex === index ? 1 : 0,
                  y: testimonialIndex === index ? 0 : 10,
                  position: testimonialIndex === index ? "relative" : "absolute",
                }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
              >
                <p className="text-[1.01rem] leading-7 text-white md:text-base">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-4 text-sm text-mutedText">
                  <span className="font-medium text-gold">{item.author}</span> — {item.role}
                </footer>
              </motion.blockquote>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            {testimonials.map((item, index) => (
              <button
                key={item.author}
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => setTestimonialIndex(index)}
                className={`h-2.5 rounded-full transition-all ${testimonialIndex === index ? "w-8 bg-gold" : "w-2.5 bg-white/25 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </section>
        <section className="glass glow-ring p-5 md:p-6">
          <div className="flex items-center gap-2 text-gold">
            <Lock className="h-4 w-4" />
            Trusted by global investors and strategic partners.
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm text-mutedText sm:grid-cols-3 md:grid-cols-5 md:gap-3">
            {["FinTrust", "NovaPay", "BlueVault", "SecureX", "QuantDesk"].map((name) => (
              <div key={name} className="hover-lift rounded-xl bg-white/5 px-3 py-2 text-center leading-tight">
                {name}
              </div>
            ))}
          </div>
        </section>
      </PageShell>
    </div>
  );
}

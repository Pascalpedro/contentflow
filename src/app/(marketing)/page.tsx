"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, BarChart3, Settings, PenTool, LayoutDashboard, Globe, MessageSquare } from "lucide-react";

export default function MarketingPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="overflow-hidden">
      {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section id="home" className="pt-40 pb-20 px-6 relative max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-50 rounded-full blur-[100px] -z-10 opacity-70" />

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
            The Smarter Way to <br className="hidden md:block" />
            Manage Content with <span className="text-brand-900">ContentFlow</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Give your clients a premium dashboard to order, track, and approve written content—all in one place.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-20">
            <Link href="/signup" className="bg-brand-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-950 transition-colors shadow-lg">
              Get Started
            </Link>
            <Link href="/login" className="bg-white text-slate-900 border border-slate-200 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              Try Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating Hero Elements matching the reference design */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-5xl mx-auto h-[400px]"
        >
          {/* Card 1: Image / Dashboard Snippet */}
          <div className="absolute left-0 top-10 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl bg-brand-800 z-10 border-4 border-white">
            <div className="w-full h-full bg-gradient-to-br from-brand-700 to-brand-900 opacity-80" />
            {/* Mock abstract geometric shapes simulating the factory pipes in reference */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-400 rounded-full blur-2xl opacity-40" />
            <div className="absolute top-4 left-4 right-4 h-4 rounded-full bg-white/20" />
            <div className="absolute top-12 left-4 right-12 h-4 rounded-full bg-white/20" />
            <div className="absolute top-20 left-4 right-8 h-4 rounded-full bg-white/20" />
          </div>

          {/* Card 2: 100+ Active Clients */}
          <div className="absolute left-48 top-32 w-48 bg-brand-900 text-white p-6 rounded-3xl shadow-xl z-20 hidden md:block border-2 border-white">
            <h3 className="text-4xl font-bold mb-1">100+</h3>
            <p className="text-sm text-teal-100">Active Content<br/>Teams</p>
          </div>

          {/* Card 3: Rating (Top Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 bg-white px-6 py-3 rounded-full shadow-md z-20 flex items-center gap-2 border border-slate-100">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
            </div>
            <span className="font-bold text-sm text-slate-800">4.9</span>
            <span className="text-sm text-slate-500">from 500+ reviews</span>
          </div>

          {/* Card 4: Dashboard mock center */}
          <div className="absolute left-1/2 -translate-x-1/2 top-16 w-80 bg-white p-6 rounded-3xl shadow-2xl z-30 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-brand-900" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Total Words Delivered</div>
                  <div className="font-bold text-lg">24,591+</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</div>
            </div>
            {/* Mini chart mock */}
            <div className="flex items-end gap-2 h-16 w-full mb-2">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-brand-800 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
            </div>
          </div>

          {/* Card 5: Experience */}
          <div className="absolute right-40 top-24 w-32 bg-brand-100 p-6 rounded-3xl shadow-lg z-20 hidden md:block text-center border border-brand-200">
            <h3 className="text-4xl font-bold text-brand-900 mb-1">6+</h3>
            <p className="text-xs text-brand-800 font-medium">Years in<br/>Content Ops</p>
          </div>

          {/* Card 6: Dark Card Right */}
          <div className="absolute right-0 top-10 w-64 h-72 bg-brand-950 rounded-3xl shadow-2xl z-10 p-8 flex flex-col justify-end text-left border-4 border-white">
            <Globe className="w-8 h-8 text-teal-400 mb-4" />
            <h4 className="text-white font-bold text-lg leading-tight mb-2">Global Scale Content Production</h4>
            <div className="w-12 h-1 bg-teal-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES SECTION (Dark Green) ──────────────────────────────────────── */}
      <section id="features" className="py-24 bg-[#0a1e1a] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            >
              Efficient and Integrated Content Services
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-teal-100/70"
            >
              Everything you need to run a high-volume content operation effortlessly.
            </motion.p>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              { icon: PenTool, title: "Smart Order Briefs", desc: "Guided forms capture exact requirements so writers deliver right first time." },
              { icon: Settings, title: "Custom Workflows", desc: "Adapt status flows from New to Delivered based on your team's needs." },
              { icon: Check, title: "Quality Control", desc: "One-click approvals and direct revision requests integrated into the dashboard." },
              { icon: MessageSquare, title: "Direct Messaging", desc: "Chat directly with assigned writers per order thread. No email chains." },
              { icon: LayoutDashboard, title: "Client Dashboard", desc: "A premium white-label portal for your clients to track their content ROI." },
              { icon: BarChart3, title: "Spend Analytics", desc: "See your completion rates, monthly spend trends, and content-type breakdown." },
            ].map((f, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                className="bg-[#0f2e26] p-8 rounded-3xl border border-[#1a4238] hover:bg-[#13382e] transition-colors group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3 h-3 text-teal-400 -rotate-45" />
                </div>
                <f.icon className="w-8 h-8 text-teal-400 mb-6 stroke-[1.5]" />
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-teal-100/60 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── BENEFITS SECTION (White) ───────────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-brand-50 rounded-[3rem] -z-10" />
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
              {/* Dashboard visual representation */}
              <div className="space-y-4">
                <div className="h-8 w-1/3 bg-slate-100 rounded-lg mb-8" />
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-brand-600" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-40 bg-slate-100 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-emerald-100 rounded-full" />
                  </div>
                ))}
              </div>
              
              {/* Floating stats card over dashboard */}
              <div className="absolute -right-12 -bottom-8 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 w-64">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Monthly Volume</div>
                    <div className="font-bold text-xl text-slate-900">1,951+</div>
                  </div>
                </div>
                <div className="flex items-end gap-1 h-12">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand-800 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Key Benefits of Our System for Your Business Efficiency
            </h2>
            <p className="text-slate-500 mb-10 text-lg">
              Our system simplifies content delivery workflows so you can scale your agency without the operational headache.
            </p>

            <div className="space-y-8">
              {[
                { title: "Boost Output with Ease", desc: "Manage 10x more content orders by giving clients a self-serve portal that handles requirements gathering." },
                { title: "Optimize Production Process", "desc": "Standardize every stage of production from new order to final delivery, ensuring no task falls through the cracks." },
                { title: "Data-Driven Production", "desc": "Leverage built-in analytics to understand what content types your clients order most and optimize your writer allocation." }
              ].map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{b.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING SECTION (Dark) ─────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[#0a0a0a] text-white relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tailored Plans for Your Content Scale</h2>
            <p className="text-slate-400">Flexible pricing for teams of all sizes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Starter Plan */}
            <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 hover:border-[#404040] transition-colors">
              <h3 className="text-xl font-medium text-slate-300 mb-2">Starter</h3>
              <p className="text-sm text-slate-500 mb-6">Perfect for small teams and solo founders.</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-bold">$39</span>
                <span className="text-slate-500 mb-1">/ month</span>
              </div>
              <button className="w-full py-3 rounded-full border border-[#262626] text-white font-medium hover:bg-white hover:text-black transition-colors mb-8">
                Get Started
              </button>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Includes</div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> 5 orders / month</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> 1,500 words per order</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> Standard dashboard access</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> Email support</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 hover:border-[#404040] transition-colors">
              <h3 className="text-xl font-medium text-slate-300 mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 mb-6">For scaling businesses that need consistent content.</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-slate-500 mb-1">/ month</span>
              </div>
              <button className="w-full py-3 rounded-full bg-white text-black font-medium hover:bg-slate-200 transition-colors mb-8">
                Get Started
              </button>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Includes</div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> Unlimited orders</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> Custom workflow states</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> Dedicated account manager</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-teal-500" /> Priority support</li>
              </ul>
            </div>
          </div>

          {/* Professional Banner */}
          <div className="bg-gradient-to-r from-[#0f2e26] to-[#042f2e] border border-[#134e4a] rounded-3xl p-8 text-center">
            <h3 className="text-xl font-medium text-white mb-2">Professional</h3>
            <p className="text-sm text-teal-100/70 mb-6 max-w-md mx-auto">
              We provide custom enterprise integrations and advanced permissions for large scale content teams.
            </p>
            <button className="px-8 py-2.5 rounded-full bg-white text-brand-900 font-medium hover:bg-slate-100 transition-colors text-sm">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS SECTION (Light Green) ─────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight max-w-md">
              Empowering Top Companies with Seamless Integrations
            </h2>
            <p className="text-slate-500 mb-8 max-w-md">
              ContentFlow plugs right into your existing stack. Export to CMS platforms, trigger Zapier automations, and sync with your billing tools.
            </p>
            <button className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm flex items-center gap-2">
              View All Integrations <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative h-[400px]">
            <div className="absolute inset-0 bg-[#eaffe4] rounded-3xl flex items-center justify-center">
              {/* Abstract network graphic */}
              <div className="relative w-64 h-64">
                {/* Concentric circles */}
                <div className="absolute inset-0 border border-[#bbf7d0] rounded-full" />
                <div className="absolute inset-8 border border-[#86efac] rounded-full" />
                <div className="absolute inset-16 border border-[#4ade80] rounded-full" />
                
                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-brand-900 rounded-full" />
                </div>

                {/* Satellite Nodes (Mock logos) */}
                {[
                  { top: '-10%', left: '40%', color: 'bg-blue-500' },
                  { top: '20%', right: '-10%', color: 'bg-purple-500' },
                  { bottom: '10%', right: '10%', color: 'bg-orange-500' },
                  { bottom: '-10%', left: '30%', color: 'bg-cyan-500' },
                  { top: '30%', left: '-10%', color: 'bg-pink-500' },
                ].map((pos, i) => (
                  <div key={i} className="absolute w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" style={pos}>
                    <div className={`w-4 h-4 rounded-md ${pos.color}`} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA (Dark Green) ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a1e1a] relative overflow-hidden text-center">
        {/* Background Grid Lines Mockup */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#134e4a 1px, transparent 1px), linear-gradient(90deg, #134e4a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">From Idea to Production in Days</h2>
            <p className="text-teal-100/70 mb-10">
              Launch your client portal today. No complex setup. Start managing content operations smoothly.
            </p>
            <Link href="/signup" className="inline-block bg-[#eaffe4] text-[#042f2e] px-8 py-3.5 rounded-full font-bold hover:bg-white transition-colors shadow-[0_0_30px_rgba(234,255,228,0.2)]">
              Book a Demo
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

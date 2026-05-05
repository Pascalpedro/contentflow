import { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-200">
      {/* Navbar matching the reference image style */}
      <nav className="absolute top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center overflow-hidden relative">
              <div className="w-4 h-4 bg-teal-400 rounded-full mix-blend-screen absolute -top-1 -right-1 opacity-80 blur-[2px]" />
              <div className="w-5 h-5 bg-teal-500 rounded-full" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-xl">ContentFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#home" className="hover:text-brand-900 transition-colors">Home</Link>
            <Link href="#features" className="hover:text-brand-900 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-brand-900 transition-colors">Pricing</Link>
            <Link href="#contact" className="hover:text-brand-900 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-brand-900 hidden sm:block">Sign In</Link>
            <Link href="/signup" className="text-sm font-semibold text-white bg-brand-900 hover:bg-brand-950 px-6 py-2.5 rounded-full transition-all shadow-sm">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer matching reference design */}
      <footer className="bg-[#0a1118] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-brand-900 flex items-center justify-center overflow-hidden relative">
                  <div className="w-4 h-4 bg-teal-400 rounded-full mix-blend-screen absolute -top-1 -right-1 opacity-80 blur-[2px]" />
                  <div className="w-5 h-5 bg-teal-500 rounded-full" />
                </div>
                <span className="font-extrabold text-white tracking-tight text-xl">ContentFlow</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Your end-to-end content management workspace. Bring clients, writers, and orders into one seamless flow.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">News</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Events</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Industries</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">B2B SaaS</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">E-commerce</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Agencies</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Startups</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Client Dashboard</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Order Management</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Real-time Messaging</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">API & Integrations</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ContentFlow LLC. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

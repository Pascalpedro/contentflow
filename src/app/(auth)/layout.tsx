import { PenTool } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Brand mark */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)' }}
        >
          <PenTool size={14} className="text-white" />
        </div>
        <span className="font-bold text-[15px] text-slate-800 tracking-tight">ContentFlow</span>
      </div>

      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

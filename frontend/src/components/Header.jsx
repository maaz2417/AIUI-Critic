function Header() {
  return (
    <header className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-500 rounded-xl text-white shadow-sm shadow-brand-500/50">
            <i data-lucide="sparkles" className="w-6 h-6"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">
            AI UI Critic
          </h1>
        </div>
        <div>
          <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            v2.0 Pro
          </span>
        </div>
      </div>
    </header>
  );
}

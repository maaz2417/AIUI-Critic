function AnalysisDashboard({ 
  previewUrl, file, isAnalyzing, analysisResult, 
  isImproving, improvedCode, onAnalyze, onImprove, onReset 
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl overflow-hidden relative shadow-sm border border-slate-200 group">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button 
                onClick={onReset}
                className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-lg shadow-sm hover:bg-white transition-colors"
                title="Upload new image"
              >
                <i data-lucide="x" className="w-5 h-5"></i>
              </button>
            </div>
            <img src={previewUrl} alt="UI Preview" className="w-full h-auto object-contain max-h-[70vh]" />
            
            {/* Overlay simulated layout bounds if analyzed */}
            {analysisResult && !isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none bg-indigo-500/5 mix-blend-multiply"></div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {!analysisResult ? (
              <button 
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 active:scale-[0.98]'}`}
              >
                {isAnalyzing ? (
                  <><i data-lucide="loader-2" className="w-6 h-6 animate-spin"></i> Analyzing AI...</>
                ) : (
                  <><i data-lucide="scan-line" className="w-6 h-6"></i> Run UX Analysis</>
                )}
              </button>
            ) : (
              <button 
                onClick={onImprove}
                disabled={isImproving}
                className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isImproving ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 active:scale-[0.98]'}`}
              >
                {isImproving ? (
                  <><i data-lucide="loader-2" className="w-6 h-6 animate-spin"></i> Generating Improved UI...</>
                ) : (
                  <><i data-lucide="wand-2" className="w-6 h-6"></i> Auto-Fix UI</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Feedback Sidebar */}
        <div className="lg:col-span-1">
          {isAnalyzing ? (
            <div className="glass-panel rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Evaluating Design</h3>
              <p className="text-sm text-slate-500">Checking contrast, layout structure, and overall accessibility...</p>
            </div>
          ) : analysisResult ? (
            <div className="glass-panel rounded-2xl h-full overflow-y-auto border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-white/50">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-800">UX Score</h2>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white" style={{
                    backgroundColor: analysisResult.ux_score >= 8 ? '#10b981' : analysisResult.ux_score >= 5 ? '#f59e0b' : '#ef4444'
                  }}>
                    {analysisResult.ux_score}/10
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">"{analysisResult.general_feedback}"</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Layout Issues */}
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-indigo-700 mb-4 border-b pb-2">
                    <i data-lucide="layout-template" className="w-5 h-5"></i> Layout Issues
                  </h3>
                  {analysisResult.layout_issues?.length > 0 ? (
                    <ul className="space-y-4">
                      {analysisResult.layout_issues.map((issue, idx) => (
                        <li key={idx} className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                          <div className="font-medium text-sm text-slate-800 mb-1">{issue.element}</div>
                          <div className="text-sm text-red-600 mb-2">{issue.issue}</div>
                          <div className="text-xs text-indigo-600 flex items-start gap-1">
                            <i data-lucide="lightbulb" className="w-4 h-4 flex-shrink-0"></i>
                            {issue.recommendation}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-emerald-600 flex items-center gap-2"><i data-lucide="check-circle-2" className="w-4 h-4"></i> No layout issues detected!</div>
                  )}
                </div>

                {/* Contrast Issues */}
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-rose-700 mb-4 border-b pb-2">
                    <i data-lucide="palette" className="w-5 h-5"></i> Contrast & Accessibility
                  </h3>
                  {analysisResult.contrast_issues?.length > 0 ? (
                    <ul className="space-y-4">
                      {analysisResult.contrast_issues.map((issue, idx) => (
                        <li key={idx} className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                          <div className="font-medium text-sm text-slate-800 mb-1">{issue.element}</div>
                          <div className="text-sm text-rose-600 mb-2">{issue.issue}</div>
                          <div className="text-xs text-emerald-600 flex items-start gap-1">
                            <i data-lucide="check" className="w-4 h-4 flex-shrink-0"></i>
                            {issue.recommendation}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-emerald-600 flex items-center gap-2"><i data-lucide="check-circle-2" className="w-4 h-4"></i> Good contrast!</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center space-y-4 border border-slate-200 bg-white/30">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400">
                <i data-lucide="file-search" className="w-8 h-8"></i>
              </div>
              <h3 className="text-lg font-medium text-slate-700">Ready for Analysis</h3>
              <p className="text-sm text-slate-500">Wait a moment, automatically scanning your UI...</p>
            </div>
          )}
        </div>
      </div>

      {/* Improved Image Section */}
      {improvedImageUrl && (
        <div className="mt-8 glass-panel rounded-2xl overflow-hidden border border-emerald-200">
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
              <i data-lucide="sparkles" className="w-5 h-5"></i> AI-Improved Design Concept
            </h2>
            <a 
              href={improvedImageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm bg-white border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1"
            >
              <i data-lucide="external-link" className="w-4 h-4"></i> View Full Image
            </a>
          </div>
          <div className="p-6 bg-white flex justify-center">
            <img 
              src={improvedImageUrl} 
              alt="Improved UI Concept" 
              className="max-w-full h-auto rounded-xl shadow-2xl border border-slate-100"
            />
          </div>
          <div className="bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500 italic">
              This concept was generated by DALL-E 3 based on the UX analysis of your original screenshot.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const { useState, useEffect, useRef } = React;

// --- Components ---

function Header({ onLogoClick }) {
  return (
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onLogoClick}
        >
          <div className="p-2 bg-sky-500 rounded-xl text-white shadow-lg shadow-sky-500/30">
            <i data-lucide="sparkles" className="w-6 h-6"></i>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
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

function UploadArea({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div 
        className="max-w-2xl w-full bg-white/70 backdrop-blur-md rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 hover:border-sky-500 transition-all duration-300 cursor-pointer group shadow-xl"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange} 
        />
        <div className="mx-auto w-24 h-24 mb-6 bg-sky-50 rounded-full flex items-center justify-center group-hover:bg-sky-100 transition-colors">
          <i data-lucide="upload-cloud" className="w-12 h-12 text-sky-500"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload your UI Design</h3>
        <p className="text-slate-500 mb-8 text-lg">Drag and drop your screenshot here, or click to browse.</p>
        <button className="px-8 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/40 hover:bg-sky-700 transition-all active:scale-95 flex items-center gap-3 mx-auto text-lg">
          <i data-lucide="image" className="w-6 h-6"></i>
          Select Image
        </button>
      </div>
    </div>
  );
}

function AnalysisDashboard({ 
  previewUrl, isAnalyzing, analysisResult, 
  isImproving, improvedImageUrl, onAnalyze, onImprove, onReset 
}) {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden relative shadow-2xl border border-slate-200">
            <div className="absolute top-4 left-4 z-10">
              <button 
                onClick={onReset}
                className="bg-white/90 backdrop-blur text-slate-700 p-3 rounded-xl shadow-lg hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                title="Start Over"
              >
                <i data-lucide="rotate-ccw" className="w-5 h-5"></i>
              </button>
            </div>
            <img src={previewUrl} alt="UI Preview" className="w-full h-auto object-contain max-h-[75vh]" />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {!analysisResult ? (
              <button 
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className={`flex-1 py-5 rounded-2xl font-bold text-white text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 active:scale-[0.98]'}`}
              >
                {isAnalyzing ? (
                  <><i data-lucide="loader-2" className="w-6 h-6 animate-spin"></i> AI is thinking...</>
                ) : (
                  <><i data-lucide="zap" className="w-6 h-6"></i> Run UX Analysis</>
                )}
              </button>
            ) : (
              <button 
                onClick={onImprove}
                disabled={isImproving}
                className={`flex-1 py-5 rounded-2xl font-bold text-white text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${isImproving ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 active:scale-[0.98]'}`}
              >
                {isImproving ? (
                  <><i data-lucide="loader-2" className="w-6 h-6 animate-spin"></i> Re-imagining UI...</>
                ) : (
                  <><i data-lucide="wand-2" className="w-6 h-6"></i> Auto-Fix UI (DALL-E 3)</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Feedback Sidebar */}
        <div className="lg:col-span-1">
          {isAnalyzing ? (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 h-full flex flex-col items-center justify-center text-center space-y-6 shadow-xl border border-slate-200">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Design</h3>
                <p className="text-slate-500">Checking accessibility, visual hierarchy, and layout structure...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="bg-white/70 backdrop-blur-md rounded-3xl h-full flex flex-col shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-white/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">UX Score</h2>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg" style={{
                    backgroundColor: analysisResult.ux_score >= 8 ? '#10b981' : analysisResult.ux_score >= 5 ? '#f59e0b' : '#ef4444'
                  }}>
                    {analysisResult.ux_score}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed italic text-lg">"{analysisResult.general_feedback}"</p>
              </div>
              
              <div className="p-8 space-y-8 overflow-y-auto">
                {/* Layout Issues */}
                <div>
                  <h3 className="font-bold flex items-center gap-2 text-indigo-700 mb-4 text-lg">
                    <i data-lucide="layout" className="w-6 h-6"></i> Layout Issues
                  </h3>
                  {analysisResult.layout_issues?.length > 0 ? (
                    <div className="space-y-4">
                      {analysisResult.layout_issues.map((issue, idx) => (
                        <div key={idx} className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                          <div className="font-bold text-slate-800 mb-1">{issue.element}</div>
                          <div className="text-red-600 mb-3 text-sm font-medium">{issue.issue}</div>
                          <div className="text-indigo-700 bg-white p-3 rounded-xl text-xs flex items-start gap-2 shadow-sm">
                            <i data-lucide="lightbulb" className="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                            {issue.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-emerald-600 font-medium flex items-center gap-2"><i data-lucide="check-circle" className="w-5 h-5"></i> Perfection!</div>
                  )}
                </div>

                {/* Contrast Issues */}
                <div>
                  <h3 className="font-bold flex items-center gap-2 text-rose-700 mb-4 text-lg">
                    <i data-lucide="palette" className="w-6 h-6"></i> Accessibility
                  </h3>
                  {analysisResult.contrast_issues?.length > 0 ? (
                    <div className="space-y-4">
                      {analysisResult.contrast_issues.map((issue, idx) => (
                        <div key={idx} className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                          <div className="font-bold text-slate-800 mb-1">{issue.element}</div>
                          <div className="text-rose-600 mb-3 text-sm font-medium">{issue.issue}</div>
                          <div className="text-emerald-700 bg-white p-3 rounded-xl text-xs flex items-start gap-2 shadow-sm">
                            <i data-lucide="check" className="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                            {issue.recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-emerald-600 font-medium flex items-center gap-2"><i data-lucide="check-circle" className="w-5 h-5"></i> Great contrast!</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur rounded-3xl p-10 h-full flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-200">
              <div className="p-5 bg-slate-100 rounded-2xl text-slate-400">
                <i data-lucide="eye" className="w-10 h-10"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-700">Ready to Critic</h3>
              <p className="text-slate-500">Scan results will appear here as soon as you start the analysis.</p>
            </div>
          )}
        </div>
      </div>

      {/* Improved Image Section */}
      {improvedImageUrl && (
        <div className="mt-8 bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-200 animate-in slide-in-from-bottom duration-700">
          <div className="bg-emerald-50 border-b border-emerald-100 px-8 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-3">
              <i data-lucide="sparkles" className="w-6 h-6 text-emerald-500"></i> AI-Improved Design Concept
            </h2>
            <a 
              href={improvedImageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-bold shadow-sm hover:bg-emerald-100 transition-all flex items-center gap-2"
            >
              <i data-lucide="external-link" className="w-5 h-5"></i> View HD
            </a>
          </div>
          <div className="p-8 flex justify-center bg-slate-50">
            <img 
              src={improvedImageUrl} 
              alt="Improved UI Concept" 
              className="max-w-full h-auto rounded-2xl shadow-2xl border border-white"
            />
          </div>
          <div className="bg-emerald-900 p-6 text-center">
            <p className="text-emerald-100 text-sm font-medium">
              ✨ This concept was reimagined by DALL-E 3 based on your original UX goals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main App ---

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedImageUrl, setImprovedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  // Initialize icons
  useEffect(() => {
    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 200);
    }
  }, [file, isAnalyzing, analysisResult, isImproving, improvedImageUrl, error]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setAnalysisResult(null);
    setImprovedImageUrl(null);
    setError(null);
    analyzeImage(selectedFile);
  };

  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setImprovedImageUrl(null);
    setError(null);
  };

  const analyzeImage = async (fileToAnalyze = file) => {
    if (!fileToAnalyze) return;
    setIsAnalyzing(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", fileToAnalyze);
    try {
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Analysis failed. Check your API key.");
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const improveUI = async () => {
    if (!file) return;
    setIsImproving(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/improve", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Image generation failed.");
      const data = await response.json();
      setImprovedImageUrl(data.improved_image_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Header onLogoClick={resetState} />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col">
        {error && (
          <div className="mb-8 bg-red-50 border-l-8 border-red-500 p-6 rounded-2xl shadow-xl animate-bounce">
            <div className="flex items-center gap-4">
              <i data-lucide="alert-triangle" className="h-8 w-8 text-red-600"></i>
              <p className="text-lg font-bold text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!previewUrl ? (
          <UploadArea onFileSelect={handleFileSelect} />
        ) : (
          <AnalysisDashboard 
            previewUrl={previewUrl}
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            isImproving={isImproving}
            improvedImageUrl={improvedImageUrl}
            onAnalyze={() => analyzeImage(file)}
            onImprove={improveUI}
            onReset={resetState}
          />
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

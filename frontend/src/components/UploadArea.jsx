function UploadArea({ onFileSelect }) {
  const fileInputRef = React.useRef(null);

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
    <div className="flex-grow flex items-center justify-center">
      <div 
        className="max-w-2xl w-full glass-panel rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 hover:border-brand-500 transition-colors duration-300 cursor-pointer group"
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
        <div className="mx-auto w-24 h-24 mb-6 bg-brand-50 rounded-full flex items-center justify-center group-hover:bg-brand-100 transition-colors">
          <i data-lucide="upload-cloud" className="w-12 h-12 text-brand-500"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload your UI Design</h3>
        <p className="text-slate-500 mb-8">Drag and drop your screenshot here, or click to browse.</p>
        <button className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all active:scale-95 flex items-center gap-2 mx-auto">
          <i data-lucide="image" className="w-5 h-5"></i>
          Select Image
        </button>
      </div>
    </div>
  );
}

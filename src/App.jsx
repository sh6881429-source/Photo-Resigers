import { useState, useRef, useCallback, useEffect } from "react";

/* ─── Icon Components ─── */
const UploadIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 33l12-12 12 12M24 21v21M6 18a12 12 0 0124 0h6a6 6 0 010 12" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
  </svg>
);

const UnlinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17l4 4m-2-2l-4-4m-5 5l-4 4m2-2l4-4M13.828 10.172a4 4 0 00-5.656 0l-1.5 1.5M10.172 13.828a4 4 0 005.656 0l1.5-1.5" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
  </svg>
);

/* ─── Format / MIME helpers ─── */
const FORMAT_INFO = {
  png:  { mime: "image/png",  ext: "png",  label: "PNG",  desc: "Lossless" },
  jpg:  { mime: "image/jpeg", ext: "jpg",  label: "JPG",  desc: "Smaller size" },
  webp: { mime: "image/webp", ext: "webp", label: "WEBP", desc: "Best compression" },
};

/* ─── Main Component ─── */
export default function App() {
  /* state ── image */
  const [image, setImage] = useState(null);          // { src, name, naturalW, naturalH }
  const [error, setError] = useState("");

  /* state ── resize controls */
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockAspect, setLockAspect] = useState(true);
  const [resizeMode, setResizeMode] = useState("pixels"); // pixels | percent
  const [percent, setPercent] = useState(100);

  /* state ── output controls */
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(92);

  /* state ── preview */
  const [previewUrl, setPreviewUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(null);  // bytes

  /* refs */
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const dropRef = useRef(null);
  const aspectRatio = useRef(1);

  /* ───── helpers ───── */
  const clearError = () => setError("");

  const loadImage = useCallback((file) => {
    clearError();
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP, GIF, BMP, etc.)");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be under 50 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        aspectRatio.current = img.naturalWidth / img.naturalHeight;
        setImage({
          src: e.target.result,
          name: file.name,
          naturalW: img.naturalWidth,
          naturalH: img.naturalHeight,
        });
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setPercent(100);
        setPreviewUrl(null);
        setOutputSize(null);
      };
      img.onerror = () => setError("Could not read this image. The file may be corrupted.");
      img.src = e.target.result;
    };
    reader.onerror = () => setError("Failed to read the file. Please try again.");
    reader.readAsDataURL(file);
  }, []);

  /* ───── drag & drop ───── */
  const [dragging, setDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files?.length) loadImage(e.dataTransfer.files[0]);
  }, [loadImage]);

  /* ───── aspect-ratio-aware dimension setters ───── */
  const handleWidthChange = (val) => {
    const w = val === "" ? "" : Math.max(1, parseInt(val) || 1);
    setWidth(w);
    if (lockAspect && w !== "" && aspectRatio.current) {
      setHeight(Math.round(w / aspectRatio.current));
    }
  };

  const handleHeightChange = (val) => {
    const h = val === "" ? "" : Math.max(1, parseInt(val) || 1);
    setHeight(h);
    if (lockAspect && h !== "" && aspectRatio.current) {
      setWidth(Math.round(h * aspectRatio.current));
    }
  };

  const handlePercentChange = (val) => {
    const p = Math.max(1, Math.min(500, parseInt(val) || 1));
    setPercent(p);
    if (image) {
      const w = Math.round(image.naturalW * p / 100);
      const h = Math.round(image.naturalH * p / 100);
      setWidth(w);
      setHeight(h);
    }
  };

  /* ───── canvas resize + preview (debounced) ───── */
  useEffect(() => {
    if (!image) return;
    const timer = setTimeout(() => renderPreview(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, width, height, format, quality]);

  const renderPreview = useCallback(() => {
    if (!image || !width || !height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h || w < 1 || h < 1) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // High-quality resampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      const { mime } = FORMAT_INFO[format];
      const q = format === "png" ? undefined : quality / 100;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
            setOutputSize(blob.size);
          }
        },
        mime,
        q
      );
    };
    img.src = image.src;
  }, [image, width, height, format, quality]);

  /* ───── download ───── */
  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    const baseName = image.name.replace(/\.[^.]+$/, "");
    a.download = `${baseName}_${width}x${height}.${FORMAT_INFO[format].ext}`;
    a.click();
  };

  /* ───── reset / remove image ───── */
  const resetDimensions = () => {
    if (!image) return;
    setWidth(image.naturalW);
    setHeight(image.naturalH);
    setPercent(100);
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    setOutputSize(null);
    setWidth("");
    setHeight("");
    setError("");
  };

  /* ───── format file size ───── */
  const formatBytes = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ── Header ── */}
        <header className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-purple-300 mb-5 tracking-wide uppercase">
            <ImageIcon /> Browser-based · 100% Private
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-purple-100 to-purple-400 bg-clip-text text-transparent leading-tight">
            Image Resizer
          </h1>
          <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Resize, compress &amp; convert your images instantly — right in your browser. No uploads to any server.
          </p>
        </header>

        {/* ── Error toast ── */}
        {error && (
          <div className="max-w-lg mx-auto mb-6 animate-fade-in-up">
            <div className="glass border-red-500/30 bg-red-500/10 rounded-xl px-5 py-3.5 flex items-start gap-3">
              <span className="text-red-400 text-lg mt-0.5">⚠</span>
              <div className="flex-1">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
              <button onClick={clearError} className="text-red-400/60 hover:text-red-300 transition text-lg leading-none" aria-label="Dismiss error">×</button>
            </div>
          </div>
        )}

        {/* ── Upload zone (no image loaded) ── */}
        {!image && (
          <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div
              id="upload-zone"
              ref={dropRef}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`glass rounded-2xl p-12 sm:p-16 cursor-pointer transition-all duration-300 
                border-2 border-dashed border-white/10 hover:border-purple-500/40 hover:bg-white/[0.03]
                flex flex-col items-center gap-5 max-w-2xl mx-auto animate-pulse-glow
                ${dragging ? "drag-active !border-purple-500 !bg-purple-500/10" : ""}`}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-purple-400">
                <UploadIcon />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">
                  {dragging ? "Drop your image here" : "Drop an image here or click to browse"}
                </p>
                <p className="text-slate-500 text-sm mt-1.5">Supports JPG, PNG, WEBP, GIF, BMP — up to 50 MB</p>
              </div>
            </div>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { loadImage(e.target.files[0]); e.target.value = ""; }}
            />
          </div>
        )}

        {/* ── Editor (image loaded) ── */}
        {image && (
          <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* ─ Preview panel ─ */}
            <section className="glass rounded-2xl p-5 sm:p-6 flex flex-col" aria-label="Image preview">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                  <ImageIcon /> Preview
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="text-xs px-3 py-1.5 rounded-lg glass glass-hover text-slate-300 hover:text-white transition" title="Upload new image" id="change-image-btn">
                    Change
                  </button>
                  <button onClick={removeImage} className="text-xs px-3 py-1.5 rounded-lg glass glass-hover text-red-400 hover:text-red-300 transition flex items-center gap-1" id="remove-image-btn">
                    <TrashIcon /> Remove
                  </button>
                </div>
              </div>

              {/* preview image */}
              <div className="flex-1 flex items-center justify-center bg-[repeating-conic-gradient(rgba(255,255,255,0.03)_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] rounded-xl overflow-hidden min-h-[260px] sm:min-h-[360px]">
                <img
                  id="preview-image"
                  src={previewUrl || image.src}
                  alt="Preview"
                  className="max-w-full max-h-[50vh] object-contain rounded shadow-lg shadow-black/30 transition-all duration-300"
                />
              </div>

              {/* info bar */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span>Original: <strong className="text-slate-300">{image.naturalW} × {image.naturalH}</strong></span>
                <span>Resized: <strong className="text-slate-300">{width || "—"} × {height || "—"}</strong></span>
                {outputSize && <span>Size: <strong className="text-slate-300">{formatBytes(outputSize)}</strong></span>}
                <span>Format: <strong className="text-slate-300 uppercase">{format}</strong></span>
              </div>
            </section>

            {/* ─ Controls sidebar ─ */}
            <aside className="flex flex-col gap-5" aria-label="Resize controls">
              {/* Resize mode tabs */}
              <div className="glass rounded-2xl p-5">
                <h2 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Resize</h2>

                {/* mode toggle */}
                <div className="flex rounded-xl bg-white/5 p-1 mb-5">
                  {["pixels", "percent"].map((mode) => (
                    <button
                      key={mode}
                      id={`mode-${mode}`}
                      onClick={() => {
                        setResizeMode(mode);
                        if (mode === "percent") handlePercentChange(percent);
                      }}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200
                        ${resizeMode === mode
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                          : "text-slate-400 hover:text-white"}`}
                    >
                      {mode === "pixels" ? "Width & Height" : "Percentage"}
                    </button>
                  ))}
                </div>

                {resizeMode === "pixels" ? (
                  <>
                    {/* Width */}
                    <div className="mb-3">
                      <label className="text-xs text-slate-500 mb-1.5 block" htmlFor="width-input">Width (px)</label>
                      <input
                        id="width-input"
                        type="number"
                        min={1}
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition"
                      />
                    </div>

                    {/* Aspect ratio lock */}
                    <div className="flex justify-center mb-3">
                      <button
                        id="aspect-ratio-toggle"
                        onClick={() => setLockAspect(!lockAspect)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          lockAspect
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-slate-500 border border-white/10 hover:text-slate-300"
                        }`}
                        title={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                      >
                        {lockAspect ? <LinkIcon /> : <UnlinkIcon />}
                      </button>
                    </div>

                    {/* Height */}
                    <div className="mb-3">
                      <label className="text-xs text-slate-500 mb-1.5 block" htmlFor="height-input">Height (px)</label>
                      <input
                        id="height-input"
                        type="number"
                        min={1}
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition"
                      />
                    </div>

                    {/* Reset */}
                    <button
                      id="reset-dimensions-btn"
                      onClick={resetDimensions}
                      className="w-full mt-1 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-1.5"
                    >
                      <ResetIcon /> Reset to original
                    </button>
                  </>
                ) : (
                  /* Percentage mode */
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block" htmlFor="percent-input">Scale (%)</label>
                    <div className="flex items-center gap-3">
                      <input
                        id="percent-slider"
                        type="range"
                        min={1}
                        max={500}
                        value={percent}
                        onChange={(e) => handlePercentChange(e.target.value)}
                        className="flex-1"
                      />
                      <input
                        id="percent-input"
                        type="number"
                        min={1}
                        max={500}
                        value={percent}
                        onChange={(e) => handlePercentChange(e.target.value)}
                        className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-purple-500/50 transition"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Result: {width} × {height} px
                    </p>
                  </div>
                )}
              </div>

              {/* Format */}
              <div className="glass rounded-2xl p-5">
                <h2 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Format</h2>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(FORMAT_INFO).map(([key, { label, desc }]) => (
                    <button
                      key={key}
                      id={`format-${key}`}
                      onClick={() => setFormat(key)}
                      className={`py-3 rounded-xl text-center transition-all duration-200 border
                        ${format === key
                          ? "bg-gradient-to-b from-purple-600/30 to-indigo-600/20 border-purple-500/40 text-white"
                          : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:border-white/10"}`}
                    >
                      <span className="block text-sm font-bold">{label}</span>
                      <span className="block text-[10px] mt-0.5 opacity-60">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              {format !== "png" && (
                <div className="glass rounded-2xl p-5 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Quality</h2>
                    <span className="text-xs font-mono text-purple-400">{quality}%</span>
                  </div>
                  <input
                    id="quality-slider"
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                    <span>Smaller file</span>
                    <span>Higher quality</span>
                  </div>
                </div>
              )}

              {/* Download */}
              <button
                id="download-btn"
                onClick={handleDownload}
                disabled={!previewUrl}
                className="w-full py-3.5 rounded-2xl font-semibold text-white
                  bg-gradient-to-r from-purple-600 to-indigo-600
                  hover:from-purple-500 hover:to-indigo-500
                  shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <DownloadIcon />
                Download {FORMAT_INFO[format].label}
                {outputSize ? ` (${formatBytes(outputSize)})` : ""}
              </button>
            </aside>

            {/* hidden file input for change */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { loadImage(e.target.files[0]); e.target.value = ""; }}
            />
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="mt-16 mb-6 text-center text-xs text-slate-600">
          <p>Images are processed entirely in your browser. Nothing is uploaded.</p>
          <p className="mt-1">Built with React · Canvas API · Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

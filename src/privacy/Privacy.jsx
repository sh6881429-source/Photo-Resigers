import { Analytics } from "@vercel/analytics/react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 text-slate-300">
      {/* Background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto glass p-8 sm:p-12 rounded-2xl animate-fade-in-up">
        <a href="/" className="text-purple-400 hover:text-purple-300 text-sm font-medium mb-6 inline-flex items-center gap-2 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to App
        </a>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 bg-gradient-to-br from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-400 text-left">
          <p>Last updated: April 2026</p>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Do Not Collect</h2>
            <p>Our Image Resizer operates entirely within your web browser. <strong className="text-purple-300">We do not upload, store, or process your images on our servers.</strong> All image processing, including resizing, compressing, and format conversion, happens locally on your device using the HTML5 Canvas API.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Local Processing</h2>
            <p>Because the app runs locally, we have no access to the files you select or drag and drop into the application. Your files remain exclusively on your device at all times.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Analytics and Tracking</h2>
            <p>We do not use any tracking cookies or third-party analytics services that monitor your usage of the image resizing tool. Your privacy is absolute while using this application.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted directly on this page.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Contact</h2>
            <p>Since this is a free, locally-running utility, there is no direct data collection to inquire about. For any technical issues or feature requests, please consult the project repository.</p>
          </section>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default function Home() {
  return (
    <div className="premium-grid min-h-screen">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 text-slate-700 sm:px-6 sm:py-10">
        <nav className="glass-panel mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white bg-white/80 text-sky-700">
              {"</>"}
            </span>
            HTMLPitch
          </div>
          <div className="hidden items-center gap-5 text-sm font-medium md:flex">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <a className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm" href="/login">
              Log In
            </a>
            <a className="rounded-md border border-white bg-gradient-to-b from-[#f6fbff] to-[#dbe7f6] px-4 py-2 text-sm font-semibold" href="/signup">
              Sign Up Free
            </a>
          </div>
        </nav>

        <section className="glass-panel mb-8 rounded-3xl p-6 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Instant HTML Publishing
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Turn Your HTML File into a Shareable Client Pitch
          </h1>
          <p className="mb-6 max-w-3xl text-base text-slate-600 sm:text-lg">
            Upload one HTML file, publish in seconds, and send a polished link your client can open anywhere.
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <a className="rounded-md border border-white bg-gradient-to-b from-[#f6fbff] to-[#dbe7f6] px-5 py-2 font-semibold" href="/signup">
              Sign Up Free
            </a>
            <a className="rounded-md border border-slate-200 bg-white px-5 py-2" href="/login">
              Log In
            </a>
          </div>
          <p className="text-xs text-slate-500 sm:text-sm">
            ✓ Free Forever • No Credit Card Required • Publish in Seconds
          </p>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Upload", text: "Drop in a single HTML file." },
            { title: "Publish", text: "Get a secure public URL instantly." },
            { title: "Share", text: "Send to clients on any device." },
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-2xl p-5">
              <p className="mb-1 text-sm font-semibold text-indigo-600">{item.title}</p>
              <p className="text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section id="features" className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Everything You Need</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "📤 Upload a Single HTML File",
              "✨ Create HTML Online",
              "🔗 Instant Shareable Links",
              "⚡ No Deployment Required",
              "📱 Works on Any Device",
              "🔒 Reliable Hosting",
            ].map((item) => (
              <div key={item} className="glass-panel rounded-2xl p-5 text-sm font-medium text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="glass-panel mb-8 rounded-3xl p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold">How It Works</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/80 bg-white/70 p-4 text-sm">
              <p className="font-semibold">1. Upload</p>
              <p className="text-slate-600">File upload or editor.</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/70 p-4 text-sm">
              <p className="font-semibold">2. Publish</p>
              <p className="text-slate-600">Generate share link instantly.</p>
            </div>
            <div className="rounded-xl border border-white/80 bg-white/70 p-4 text-sm">
              <p className="font-semibold">3. Share</p>
              <p className="text-slate-600">Client views in any browser.</p>
            </div>
          </div>
        </section>

        <section className="glass-panel mb-8 rounded-3xl p-6 sm:p-8">
          <h2 className="mb-3 text-2xl font-bold">Built For</h2>
          <p className="text-slate-600">
            Developers, freelancers, agencies, designers, founders, and consultants.
          </p>
        </section>

        <section id="pricing" className="glass-panel mb-8 rounded-3xl p-6 sm:p-8">
          <h2 className="mb-2 text-2xl font-bold">Simple Pricing</h2>
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mb-4 text-lg">$0 / Forever</p>
          <ul className="mb-5 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
            <li>✅ Upload HTML files</li>
            <li>✅ Create HTML online</li>
            <li>✅ Unlimited publishing</li>
            <li>✅ Shareable links</li>
            <li>✅ Responsive viewing</li>
            <li>✅ Secure hosting</li>
            <li className="sm:col-span-2">✅ No credit card required</li>
          </ul>
          <a className="rounded-md border border-white bg-gradient-to-b from-[#f6fbff] to-[#dbe7f6] px-5 py-2 font-semibold" href="/signup">
            Start Free
          </a>
        </section>

        <section id="faq" className="glass-panel mb-8 rounded-3xl p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold">FAQ</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "No deployment needed.",
              "Clients can view without accounts.",
              "Existing HTML uploads are supported.",
              "Mobile-friendly by default.",
            ].map((item) => (
              <p key={item} className="rounded-xl border border-white/80 bg-white/70 p-4 text-sm text-slate-600">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="glass-panel mb-8 rounded-3xl p-6 text-center sm:p-8">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Ready to Share Your Next Client Pitch?</h2>
          <p className="mb-5 text-slate-600">Skip deployment. Upload, publish, share.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a className="rounded-md border border-white bg-gradient-to-b from-[#f6fbff] to-[#dbe7f6] px-5 py-2 font-semibold" href="/signup">
              Sign Up Free
            </a>
            <a className="rounded-md border border-slate-200 bg-white px-5 py-2" href="/login">
              Log In
            </a>
          </div>
        </section>

        <footer className="glass-panel rounded-2xl px-4 py-5 text-sm text-slate-600 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="mb-2 font-semibold text-slate-700">Product</p>
              <p>Features</p>
              <p>How It Works</p>
              <p>Pricing</p>
              <p>FAQ</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-slate-700">Resources</p>
              <p>Documentation</p>
              <p>Support</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-slate-700">Legal</p>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

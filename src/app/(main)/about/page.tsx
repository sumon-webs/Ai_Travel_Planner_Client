import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — AI Travel Planner',
  description: 'Learn about AI Travel Planner — the AI-powered platform helping travelers plan smarter, faster, and more personalised trips.',
};

const TEAM = [
  { name: 'AI Engine', role: 'Powered by Google Gemini', emoji: '🤖' },
  { name: 'Community', role: 'Global Traveler Network', emoji: '🌍' },
  { name: 'Data', role: '120+ Curated Destinations', emoji: '📍' },
];

const VALUES = [
  { title: 'AI-Powered', description: 'Our Gemini-backed engine crafts personalised itineraries in seconds based on your unique preferences.', emoji: '✨' },
  { title: 'Community-Driven', description: 'Real travelers share real destinations — no sponsored content, just authentic experiences.', emoji: '🤝' },
  { title: 'Accessible', description: 'From budget backpackers to luxury explorers, we plan trips for every style and budget.', emoji: '🎒' },
  { title: 'Always Improving', description: 'We continuously refine our AI and destination database based on traveler feedback.', emoji: '🚀' },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#0a081a] text-white overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/15 to-purple-600/15 blur-[120px] opacity-25" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/15 to-blue-600/15 blur-[100px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center space-y-5 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-violet-300">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Our Mission
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Travel Smarter with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              AI
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            AI Travel Planner combines cutting-edge artificial intelligence with a global community of travelers to help you discover, plan, and experience the world like never before.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {TEAM.map(({ name, role, emoji }) => (
            <div key={name} className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all hover:-translate-y-1 hover:bg-white/[0.05]">
              <div className="text-5xl mb-4">{emoji}</div>
              <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
              <p className="text-sm text-slate-400">{role}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">
            What We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">Stand For</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(({ title, description, emoji }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all hover:bg-white/[0.05]">
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                  {emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Plan Your Next Trip?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Join thousands of travelers who use AI Travel Planner to discover incredible destinations and plan unforgettable journeys.</p>
          <a
            href="/plan-trip"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-[15px] shadow-[0_4px_15px_rgba(139,92,246,0.4)] hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            ✨ Start Planning
          </a>
        </div>
      </div>
    </main>
  );
}

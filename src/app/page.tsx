import Hero from "@/components/home/Hero"
import BuilderCard from "@/components/social/BuilderCard"
import ServiceCard from "@/components/marketplace/ServiceCard"
import StartupCard from "@/components/marketplace/StartupCard"

export default function Home() {
  const trendingBuilders = [
    { name: "Alex Rivera", role: "Fullstack Developer", score: 942, isPremium: true },
    { name: "Sarah Chen", role: "UI/UX Designer", score: 885, isPremium: false },
    { name: "Marcus Thorne", role: "Smart Contract Engineer", score: 910, isPremium: true },
    { name: "Elena Vogt", role: "AI Research Engineer", score: 867, isPremium: false },
  ]

  const featuredServices = [
    { title: "High-end Web3 Landing Page Design", provider: "Rivera Studio", price: 450, rating: 5.0, deliveryTime: 7 },
    { title: "ERC-721 Smart Contract Audit", provider: "Thorne Security", price: 1200, rating: 4.9, deliveryTime: 3 },
    { title: "Custom AI Agent Integration", provider: "Nexus AI", price: 800, rating: 5.0, deliveryTime: 5 },
  ]

  const startupPreview = [
    { name: "AI Resume Builder", revenue: 4200, users: 8500, price: 45000 },
    { name: "SaaS Dev Tools", revenue: 12500, users: 3200, price: 185000 },
  ]

  return (
    <main className="min-h-screen pb-32">
      <Hero />

      {/* Trending Builders Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending Builders</h2>
            <p className="text-white/40 text-sm">Top ranked builders currently active on the network.</p>
          </div>
          <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-semibold">
            View Leaderboard
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingBuilders.map((builder) => (
            <BuilderCard key={builder.name} {...builder} />
          ))}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-primary/5 rounded-[4rem]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Services</h2>
            <p className="text-white/40 text-sm">Premium digital services from verified freelancers.</p>
          </div>
          <button className="text-primary text-sm font-semibold hover:underline">Browse Marketplace</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      {/* Startup Marketplace Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-3 tracking-tight">Startup Marketplace</h2>
            <p className="text-white/40 text-lg">Acquire pre-revenue and profitable internet businesses.</p>
          </div>
          <button className="px-8 py-3 bg-white/5 text-white rounded-full font-bold border border-white/10 hover:bg-white/10 transition-all">
            Browse All Startups
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {startupPreview.map((startup) => (
            <StartupCard key={startup.name} {...startup} />
          ))}
        </div>
      </section>
    </main>
  )
}



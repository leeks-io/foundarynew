'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Star, TrendingUp, Users, ArrowRight, Rocket, Briefcase, Zap, ShoppingCart, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Blueprint {
  title: string
  tags: string[]
  price: string
}

export default function Home() {
  const [trendingBuilders, setTrendingBuilders] = useState<any[]>([])
  const [featuredServices, setFeaturedServices] = useState<any[]>([])
  const [blueprints, setBlueprints] = useState<Blueprint[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch trending builders (top builder score)
        const { data: builders } = await supabase
          .from('users')
          .select('id, username, role, builder_score, profiles(profile_image)')
          .order('builder_score', { ascending: false })
          .limit(4)

        // Fetch featured services
        const { data: services } = await supabase
          .from('services')
          .select('id, title, price_usdc, rating, images, user_id, users(username)')
          .eq('is_active', true)
          .limit(3)

        // Fetch blueprint ideas
        const { data: bprints } = await supabase
          .from('blueprints')
          .select('*')
          .limit(2)

        if (builders) setTrendingBuilders(builders.map(b => ({
          name: b.username,
          role: b.role,
          score: b.builder_score,
          img: (b.profiles as any)?.profile_image || `https://i.pravatar.cc/150?u=${b.username}`
        })))

        if (services) setFeaturedServices(services.map(s => ({
          title: s.title,
          provider: (s.users as any)?.username || "Unknown",
          price: s.price_usdc,
          rating: s.rating,
          img: s.images?.[0] || `https://i.pravatar.cc/150?u=${s.id}`
        })))

        if (bprints) setBlueprints(bprints.map(bp => ({
          title: bp.title,
          tags: bp.tech_stack || [],
          price: bp.price_usdc > 0 ? `${bp.price_usdc} USDC` : "Free"
        })))

      } catch (err) {
        console.error("Error fetching homepage data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-[#07da63] text-4xl animate-pulse">⬡</div>
          <p className="text-[#6b7280] text-sm font-bold uppercase tracking-widest">Loading Foundry...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#07da63]/30">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            The Marketplace for <br />
            <span className="text-[#07da63]">Internet Builders</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#6b7280] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Foundry brings founders, freelancers, and job seekers together to build, launch, and trade the future of the web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/dashboard" className="w-full sm:w-auto px-10 py-4 bg-[#07da63] text-black rounded-lg font-bold text-lg hover:bg-[#08f26e] transition-all flex items-center justify-center gap-2">
              Explore <ArrowRight size={20} />
            </Link>
            <Link href="/auth?mode=signup" className="w-full sm:w-auto px-10 py-4 bg-transparent border border-[#1a1a1a] text-white rounded-lg font-bold text-lg hover:bg-white/5 transition-all">
              Join Foundry
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {['Jobs', 'Services', 'Startups', 'Communities'].map((cat) => (
              <span key={cat} className="px-5 py-2 rounded-full border border-[#1a1a1a] text-sm font-medium text-[#6b7280] hover:text-[#07da63] hover:border-[#07da63]/50 transition-all cursor-pointer">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Builders */}
      <section className="py-20 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold mb-10">Trending Builders</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trendingBuilders.length > 0 ? trendingBuilders.map((builder, index) => (
              <motion.div
                key={builder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-2xl hover:border-[#07da63]/30 transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-[#07da63]/20 p-1 mb-4 group-hover:border-[#07da63] transition-colors">
                    <img src={builder.img} alt={builder.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-1">
                    {builder.name}
                    <CheckCircle2 size={14} className="text-[#07da63]" />
                  </h3>
                  <p className="text-[#6b7280] text-sm mb-4 font-medium">{builder.role || 'Foundry Builder'}</p>
                  <div className="bg-[#1a1a1a] rounded-lg px-4 py-2 w-full">
                    <span className="text-[#07da63] font-black text-xl">{builder.score}</span>
                    <span className="text-[10px] text-[#6b7280] font-black uppercase tracking-widest block">Builder Score</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <p className="col-span-4 text-center py-10 text-[#6b7280] font-bold">No trending builders yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold mb-10">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.length > 0 ? featuredServices.map((service) => (
              <div key={service.title} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden group hover:border-[#07da63]/30 transition-all">
                <div className="aspect-[4/3] bg-[#1a1a1a] relative">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#07da63] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Featured</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug group-hover:text-[#07da63] transition-colors">{service.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#1a1a1a]" />
                    <span className="text-sm text-[#6b7280] font-medium">by <span className="text-white">@{service.provider}</span></span>
                  </div>
                  <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#07da63]">
                      <Star size={14} className="text-[#07da63] fill-[#07da63]" />
                      <span className="text-sm font-bold">{service.rating}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#6b7280] block font-medium">Starting at</span>
                      <span className="text-lg font-bold text-[#07da63]">{service.price} USDC</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center py-10 text-[#6b7280] font-bold">No services featured yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Blueprints Section */}
      <section className="py-20 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold mb-10">Blueprint Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprints.length > 0 ? blueprints.map((idea) => (
              <div key={idea.title} className="bg-[#0d0d0d] border border-[#1a1a1a] border-l-4 border-l-[#07da63] p-6 rounded-r-2xl">
                <h3 className="text-xl font-bold mb-3">{idea.title}</h3>
                <div className="flex gap-2 mb-6">
                  {idea.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-[#111111] text-[10px] font-bold text-[#6b7280] uppercase tracking-widest rounded-md border border-[#1a1a1a]">{tag}</span>
                  ))}
                  <span className="ml-auto text-[#07da63] font-bold text-sm">{idea.price}</span>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#07da63] text-black py-2 rounded-lg font-bold text-xs">Join Build</button>
                  <button className="flex-1 border border-[#1a1a1a] text-white py-2 rounded-lg font-bold text-xs hover:bg-white/5 transition-all">Buy Idea</button>
                  <button className="flex-1 border border-[#1a1a1a] text-white py-2 rounded-lg font-bold text-xs hover:bg-white/5 transition-all">Discuss</button>
                </div>
              </div>
            )) : (
              <p className="col-span-2 text-center py-10 text-[#6b7280] font-bold">No blueprints available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Startup Marketplace */}
      <section className="py-20 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-bold mb-10">Startup Marketplace</h2>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] px-8 py-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[#07da63]/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-[#07da63]">
                <Rocket size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Acquire Verified Startups</h3>
                <p className="text-[#6b7280] text-sm font-medium">Browse 400+ SaaS, Web3, and AI businesses for sale.</p>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="text-center">
                <span className="text-[#6b7280] text-xs font-bold uppercase tracking-widest block mb-1">Listings</span>
                <span className="text-xl font-bold">428</span>
              </div>
              <div className="text-center">
                <span className="text-[#6b7280] text-xs font-bold uppercase tracking-widest block mb-1">Volume</span>
                <span className="text-xl font-bold">12.4M</span>
              </div>
              <Link href="/dashboard/startups" className="px-8 py-3 bg-[#07da63] text-black rounded-lg font-bold hover:bg-[#08f26e] transition-all">
                View Startup
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#6b7280]">Platform</h4>
            <ul className="space-y-4 text-[15px] font-medium text-[#6b7280]">
              <li><Link href="/dashboard/jobs" className="hover:text-white transition-colors">Jobs</Link></li>
              <li><Link href="/dashboard/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/dashboard/startups" className="hover:text-white transition-colors">Startups</Link></li>
              <li><Link href="/dashboard/blueprints" className="hover:text-white transition-colors">Blueprints</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#6b7280]">Resources</h4>
            <ul className="space-y-4 text-[15px] font-medium text-[#6b7280]">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tutorials</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#6b7280]">Legal</h4>
            <ul className="space-y-4 text-[15px] font-medium text-[#6b7280]">
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Escrow Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#6b7280]">Community</h4>
            <ul className="space-y-4 text-[15px] font-medium text-[#6b7280]">
              <li><Link href="/dashboard/communities" className="hover:text-white transition-colors">All Communities</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">X / Twitter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Discord</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
            <span className="text-[#07da63]">⬡</span> <span>Foundry Network</span>
          </div>
          <p className="text-[#6b7280] text-sm font-medium">© 2025 Foundry Network · foundrynetwork.space</p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Twitter, Github, Linkedin, Globe } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-black pt-24 pb-12 px-6 border-t border-[#1a1a1a]">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
                {/* Logo & About */}
                <div className="lg:col-span-2 max-w-sm">
                    <Link href="/" className="flex items-center gap-2 mb-6 group">
                        <span className="text-[#07da63] text-2xl font-bold">⬡</span>
                        <span className="text-xl font-bold tracking-tight text-white">Foundry Network</span>
                    </Link>
                    <p className="text-[#6b7280] text-sm leading-relaxed mb-8 font-medium">
                        The marketplace for specialized internet builders. Meet founders, hire builders, and trade startups.
                    </p>
                    <div className="flex items-center gap-5 text-[#6b7280]">
                        <Twitter size={20} className="hover:text-[#07da63] transition-colors cursor-pointer" />
                        <Github size={20} className="hover:text-white transition-colors cursor-pointer" />
                        <Globe size={20} className="hover:text-[#07da63] transition-colors cursor-pointer" />
                    </div>
                </div>

                {/* Platforms */}
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280] mb-6">Platform</h4>
                    <ul className="space-y-4">
                        {['Jobs', 'Services', 'Startups', 'Communities'].map((item) => (
                            <li key={item}>
                                <Link href="#" className="text-sm font-medium text-[#6b7280] hover:text-white transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280] mb-6">Resources</h4>
                    <ul className="space-y-4">
                        {['Help Center', 'Docs', 'Blog', 'Support'].map((item) => (
                            <li key={item}>
                                <Link href="#" className="text-sm font-medium text-[#6b7280] hover:text-white transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280] mb-6">Legal</h4>
                    <ul className="space-y-4">
                        {['Privacy', 'Terms', 'Escrow Policy'].map((item) => (
                            <li key={item}>
                                <Link href="#" className="text-sm font-medium text-[#6b7280] hover:text-white transition-colors">{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b7280]/40">© 2025 Foundry Network. foundrynetwork.space</p>
                <div className="flex items-center gap-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#07da63] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#07da63]/50">Systems Operational</span>
                </div>
            </div>
        </footer>
    )
}

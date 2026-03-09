'use client'

import { motion } from 'framer-motion'

export default function BlueprintCta() {
    return (
        <section className="bg-accent py-24 px-6 relative overflow-hidden">
            {/* Subtle glow or pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-space font-bold text-black mb-6 leading-tight"
                >
                    Have a startup idea?<br />
                    Launch it as a Blueprint.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-black/70 text-lg md:text-xl font-dmsans max-w-2xl mx-auto mb-12"
                >
                    Post your idea, find co-founders, and start building. The first marketplace for startup blueprints.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="w-full sm:w-auto px-10 py-4 bg-black text-white rounded-xl font-space font-bold text-lg hover:scale-105 transition-all active:scale-95 shadow-2xl">
                        Post a Blueprint
                    </button>
                    <button className="w-full sm:w-auto px-10 py-4 bg-transparent text-black border-2 border-black rounded-xl font-space font-bold text-lg hover:bg-black/5 transition-all active:scale-95">
                        Explore Ideas
                    </button>
                </motion.div>
            </div>
        </section>

    )
}

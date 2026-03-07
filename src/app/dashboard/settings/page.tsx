'use client'

import { useRole } from '@/context/RoleContext'
import { User, Mail, Shield, Zap, Bell, Monitor } from 'lucide-react'
import WorkspaceSwitcher from '@/components/dashboard/WorkspaceSwitcher'

export default function SettingsPage() {
    const { role } = useRole()

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-white/40">Manage your profile, preferences, and workspace settings.</p>
            </div>

            {/* Workspace Section - Requirements #3 */}
            <section className="glass rounded-[2rem] p-10 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Switch Workspace</h2>
                        <p className="text-sm text-white/40">Change your active role to adapt the UI to your current needs.</p>
                    </div>
                    <WorkspaceSwitcher />
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/20">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-bold mb-1">Active Role: <span className="capitalize text-primary">{role}</span></div>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Your dashboard transitions automatically to show role-specific stats,
                                marketplaces, and tools. Each role maintains its own set of applications,
                                services, and team projects.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Section */}
            <section className="glass rounded-[2rem] p-10 border border-white/5 space-y-8">
                <h2 className="text-xl font-bold">General Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase pl-1">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                defaultValue="John Doe"
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-primary/50 transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase pl-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="email"
                                defaultValue="john@example.com"
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:border-primary/50 transition-colors outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase pl-1">Bio</label>
                    <textarea
                        rows={4}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors outline-none resize-none"
                        placeholder="Tell the world what you're building..."
                    />
                </div>

                <div className="pt-4">
                    <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all glow-primary">
                        Save Changes
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass rounded-[2rem] p-8 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                            <Shield className="w-5 h-5 text-white/40 group-hover:text-primary" />
                        </div>
                        <div>
                            <div className="font-bold text-sm">Security</div>
                            <p className="text-xs text-white/40">Wallets and 2FA</p>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-[2rem] p-8 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-accent/10 transition-colors">
                            <Bell className="w-5 h-5 text-white/40 group-hover:text-accent" />
                        </div>
                        <div>
                            <div className="font-bold text-sm">Notifications</div>
                            <p className="text-xs text-white/40">Email and push alerts</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

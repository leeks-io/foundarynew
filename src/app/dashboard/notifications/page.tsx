'use client'

import { Bell, Briefcase, DollarSign, MessageSquare, UserPlus, Star, ArrowRight } from 'lucide-react'

export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            type: 'payment',
            title: 'Payment Received',
            message: '500 USDC has been locked in escrow for "Landing Page Design"',
            time: '2 hours ago',
            icon: DollarSign,
            color: 'text-accent',
            isNew: true
        },
        {
            id: 2,
            type: 'application',
            title: 'New Applicant',
            message: 'Alex Rivera applied for your Smart Contract Engineer position',
            time: '5 hours ago',
            icon: UserPlus,
            color: 'text-primary',
            isNew: true
        },
        {
            id: 3,
            type: 'review',
            title: 'New Review!',
            message: 'Sarah Chen left you a 5-star review: "Exceptional speed and quality"',
            time: '1 day ago',
            icon: Star,
            color: 'text-accent',
            isNew: false
        },
        {
            id: 4,
            type: 'message',
            title: 'Missing File',
            message: 'Elena Vogt requested access to the Figma prototype',
            time: '2 days ago',
            icon: MessageSquare,
            color: 'text-primary',
            isNew: false
        }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black mb-3 italic uppercase tracking-tighter">Notifications</h1>
                    <p className="text-white/40 text-lg">Keep track of your projects, payments, and network activity.</p>
                </div>
                <button className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`glass group p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden ${notif.isNew ? 'bg-primary/5' : ''}`}
                    >
                        {notif.isNew && (
                            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
                        )}

                        <div className="flex items-start gap-8">
                            <div className={`p-4 rounded-2xl bg-white/5 ${notif.color} relative`}>
                                <notif.icon className="w-8 h-8" />
                                {notif.isNew && (
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#0B0F19] glow-primary" />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold">{notif.title}</h3>
                                    <span className="text-xs font-bold text-white/20 uppercase tracking-widest">{notif.time}</span>
                                </div>
                                <p className="text-white/40 leading-relaxed mb-6 font-medium">{notif.message}</p>
                                <button className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                                    View {notif.type}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-12">
                <button className="px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest">
                    Load older notifications
                </button>
            </div>
        </div>
    )
}

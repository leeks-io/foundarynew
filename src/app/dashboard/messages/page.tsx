'use client'

import { Search, Send, File, Phone, MoreVertical, ImageIcon, Mic } from 'lucide-react'

export default function MessagesPage() {
    const contacts = [
        { name: 'Alex Rivera', role: 'Fullstack Dev', lastMsg: 'I just reviewed the smart contract logic.', time: '2m', active: true },
        { name: 'Sarah Chen', role: 'Designer', lastMsg: 'The Figma prototype is ready for review!', time: '1h', active: false },
        { name: 'Elena Vogt', role: 'AI Engineer', lastMsg: 'Can we schedule a call for the API integration?', time: '3h', active: false },
    ]

    return (
        <div className="h-[calc(100vh-10rem)] flex glass rounded-[2.5rem] overflow-hidden border border-white/5">
            {/* Sidebar: Contacts */}
            <div className="w-80 border-r border-white/5 flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-xs outline-none focus:border-primary/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact, i) => (
                        <div
                            key={contact.name}
                            className={`p-6 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/[0.02] ${i === 0 ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative">
                                <span className="font-bold text-sm text-white/40">{contact.name.charAt(0)}</span>
                                {contact.active && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-[#0B0F19] glow-accent" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-bold truncate">{contact.name}</h3>
                                    <span className="text-[10px] text-white/20 font-bold">{contact.time}</span>
                                </div>
                                <p className="text-xs text-white/40 truncate">{contact.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Chat */}
            <div className="flex-1 flex flex-col bg-[#0B1221]/50">
                <header className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0B0F19]/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">AR</div>
                        <div>
                            <h3 className="text-sm font-bold">Alex Rivera</h3>
                            <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60">
                            <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto space-y-8">
                    <div className="flex justify-center">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full">Today</span>
                    </div>

                    <div className="flex items-end gap-3 max-w-lg">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">AR</div>
                        <div className="p-4 rounded-2xl rounded-bl-none bg-white/5 border border-white/5 text-sm text-white/80 leading-relaxed shadow-xl">
                            I just reviewed the smart contract logic for the escrow release. Everything looks solid, but we should add a timeout mechanism for disputes.
                        </div>
                    </div>

                    <div className="flex flex-row-reverse items-end gap-3 max-w-lg ml-auto">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">JD</div>
                        <div className="p-4 rounded-2xl rounded-br-none bg-primary text-white text-sm leading-relaxed shadow-2xl shadow-primary/20">
                            Agreed. Let's implement that in the next iteration. I'll update the design spec to reflect the 48-hour window.
                        </div>
                    </div>
                </div>

                <footer className="p-6 border-t border-white/5 bg-[#0B0F19]/50">
                    <div className="glass flex items-center gap-4 p-2 rounded-2xl border border-white/10">
                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/40">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/40">
                            <File className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            placeholder="Write a message..."
                            className="flex-1 bg-transparent border-none font-medium text-sm outline-none px-2"
                        />
                        <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/40">
                            <Mic className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-primary text-white rounded-xl shadow-lg glow-primary hover:scale-[1.02] transition-transform">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
}

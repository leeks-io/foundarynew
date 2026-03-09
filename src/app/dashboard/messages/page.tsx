'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Send, Plus, MoreHorizontal, Settings,
    ImageIcon, Gift, Smile, Info, CheckCircle2,
    ShieldCheck, Zap, ArrowRight, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<any>(null)

    const chats = [
        { id: 1, name: 'Alex Rivera', handle: '@alex', lastMsg: 'I just reviewed the smart contract logic.', time: '2m', unread: true, img: 'https://i.pravatar.cc/150?u=alex' },
        { id: 2, name: 'Sarah Chen', handle: '@sarah', lastMsg: 'The Figma prototype is ready for review!', time: '1h', img: 'https://i.pravatar.cc/150?u=sarah' },
        { id: 3, name: 'Elena Vogt', handle: '@elena', lastMsg: 'Deal Proposal: Landing Page Design', time: '3h', isDeal: true, img: 'https://i.pravatar.cc/150?u=elena' },
    ]

    return (
        <div className="flex h-[calc(100vh-60px)] overflow-hidden">
            {/* Left Panel: Conversation List (380px) */}
            <div className={cn(
                "w-full md:w-[380px] border-r border-[#1a1a1a] flex flex-col transition-all bg-black",
                selectedChat ? "hidden md:flex" : "flex"
            )}>
                <div className="px-4 py-3 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"><Settings size={20} /></button>
                        <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"><Plus size={20} /></button>
                    </div>
                </div>

                <div className="px-4 mb-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] group-focus-within:text-[#07da63]" size={18} />
                        <input
                            type="text"
                            placeholder="Search Direct Messages"
                            className="w-full bg-[#16181c] border-none rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#07da63] placeholder:text-[#6b7280]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={cn(
                                "px-4 py-4 flex gap-3 cursor-pointer hover:bg-[#080808] transition-colors relative",
                                selectedChat?.id === chat.id ? "bg-[#080808] border-r-2 border-[#07da63]" : ""
                            )}
                        >
                            <div className="relative shrink-0">
                                <img src={chat.img} alt={chat.name} className="w-12 h-12 rounded-full" />
                                {chat.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-[#07da63] border-2 border-black rounded-full" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold text-[15px] truncate">{chat.name}</h4>
                                    <span className="text-[#6b7280] text-xs pb-1">{chat.time}</span>
                                </div>
                                <p className="text-[#6b7280] text-sm truncate font-medium">
                                    {chat.isDeal && <span className="text-[#07da63] font-bold">Deal · </span>}
                                    {chat.lastMsg}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col bg-black relative",
                !selectedChat ? "hidden md:flex items-center justify-center p-12 text-center" : "flex"
            )}>
                {!selectedChat ? (
                    <div className="max-w-sm">
                        <h2 className="text-3xl font-bold mb-2">Select a message</h2>
                        <p className="text-[#6b7280] font-medium mb-6">Choose from your existing conversations, or start a new one.</p>
                        <button className="bg-[#07da63] text-black font-bold px-8 py-3 rounded-full hover:bg-[#08f26e] transition-colors">New message</button>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <header className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between bg-black/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-[#1a1a1a] rounded-full transition-colors mr-1">
                                    <X size={20} />
                                </button>
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <img src={selectedChat.img} alt={selectedChat.name} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px] leading-tight flex items-center gap-1">
                                        {selectedChat.name} <CheckCircle2 size={14} className="text-[#07da63]" />
                                    </h3>
                                    <p className="text-[#6b7280] text-xs font-medium">{selectedChat.handle}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors"><Info size={20} /></button>
                            </div>
                        </header>

                        {/* Message Thread */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            <div className="flex flex-col items-center py-8 border-b border-[#1a1a1a] mb-8">
                                <img src={selectedChat.img} className="w-16 h-16 rounded-full mb-3" />
                                <h4 className="font-bold text-xl">{selectedChat.name}</h4>
                                <p className="text-[#6b7280] text-sm mb-4">{selectedChat.handle}</p>
                                <p className="text-[#6b7280] text-xs font-medium bg-[#111111] px-3 py-1 rounded-lg border border-[#1a1a1a]">Joined March 2024</p>
                            </div>

                            {/* Samples */}
                            <Message bubble="Hi David! I saw your recent post about the AI Resume Builder." />
                            <Message bubble="Which technologies are you using for the backend?" />
                            <Message bubble="I'm using Node.js with Supabase for the database and authentication. Looking into Vercel for deployment." isMe />
                            <Message bubble="That's a solid stack! I've sent you a deal proposal for the UI design phase." />

                            {/* Deal Card */}
                            <div className="max-w-[320px] bg-[#0d0d0d] border border-[#07da63]/30 rounded-2xl overflow-hidden mt-6">
                                <div className="p-4 bg-gradient-to-br from-[#07da63]/10 to-transparent">
                                    <div className="flex items-center gap-2 mb-2 text-[#07da63]">
                                        <Zap size={16} className="fill-current" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Deal Proposal</span>
                                    </div>
                                    <h4 className="font-bold mb-1">Landing Page Design</h4>
                                    <p className="text-[#6b7280] text-xs font-medium mb-4">Complete Figma prototype + Assets.</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xl font-bold text-white">250 USDC</span>
                                        <span className="text-[10px] font-bold text-[#6b7280] uppercase">7 Day Delivery</span>
                                    </div>

                                    <button className="w-full bg-[#07da63] text-black font-bold py-2 rounded-xl text-xs hover:bg-[#08f26e] transition-colors flex items-center justify-center gap-2 group">
                                        Accept Deal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                <div className="p-3 bg-black border-t border-[#1a1a1a] flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-[#07da63]" />
                                    <span className="text-[10px] font-bold text-[#6b7280] uppercase">Escrow Protection Enabled</span>
                                </div>
                            </div>
                        </div>

                        {/* Input Bar */}
                        <footer className="p-4 bg-black border-t border-[#1a1a1a]">
                            <div className="bg-[#16181c] rounded-2xl flex items-end p-2 border border-[#1a1a1a] focus-within:border-[#07da63]/50 transition-colors">
                                <div className="flex gap-1 pb-1">
                                    <IconButton icon={<ImageIcon size={20} />} />
                                    <IconButton icon={<Gift size={20} />} />
                                </div>
                                <textarea
                                    placeholder="Start a new message"
                                    className="flex-1 bg-transparent border-none focus:outline-none py-2 px-3 text-[15px] max-h-32 resize-none no-scrollbar font-medium"
                                    rows={1}
                                />
                                <div className="flex gap-1 pb-1">
                                    <IconButton icon={<Smile size={20} />} />
                                    <button className="p-2 text-[#07da63] hover:bg-[#07da63]/10 rounded-full transition-colors">
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </>
                )}
            </div>
        </div>
    )
}

function Message({ bubble, isMe }: any) {
    return (
        <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
            <div className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl text-[15px] font-medium leading-relaxed",
                isMe
                    ? "bg-[#07da63] text-black rounded-br-none"
                    : "bg-[#16181c] text-white border border-[#1a1a1a] rounded-bl-none"
            )}>
                {bubble}
            </div>
        </div>
    )
}

function IconButton({ icon }: any) {
    return (
        <button className="p-2 text-[#07da63] hover:bg-[#07da63]/10 rounded-full transition-colors">
            {icon}
        </button>
    )
}

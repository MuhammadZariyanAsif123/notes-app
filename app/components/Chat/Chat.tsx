'use client'
import { useState, useEffect, useRef } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

interface ChatMessage {
    role: string;
    content: string;
}
export default function Chat() {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [chatInput, setChatInput] = useState<string>("")
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    const sendMessage = async () => {
        if (!chatInput.trim() || isChatLoading) return

        const userMessage = chatInput.trim()
        setChatInput("")
        setChatMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsChatLoading(true)

        try {
            const history = chatMessages.map(msg => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            }))

            const response = await fetch("/api/chatWithNotes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, history })
            })

            if (response.status === 200) {
                const data = await response.json()
                setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }])
            } else {
                toast.error("Failed to get a response. Please try again.")
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsChatLoading(false)
        }
    }

    return (
        <>
            {/* Floating Chat Bubble */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed  bottom-6 right-6 z-200 w-14 h-14 bg-zinc-900 text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
                {isChatOpen ? <FiX className="w-5 h-5" /> : <FiMessageCircle className="w-5 h-5" />}
            </button>

            {/* Chat Panel */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-6 z-200 w-87.5 sm:w-100 h-125 bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-pop-in">

                    {/* Chat Header */}
                    <div className="px-5 py-4 bg-zinc-900 flex items-center justify-between shrink-0">
                        <div>
                            <h3 className="text-white font-black text-sm">Chat with Notes</h3>
                            <p className="text-zinc-400 text-[10px] font-medium">Ask anything about your notes</p>
                        </div>
                        <button
                            onClick={() => {
                                setChatMessages([])
                                setChatInput("")
                            }}
                            className="text-[10px] text-zinc-400 hover:text-white font-bold transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto sleek-scroll p-4 space-y-3 bg-zinc-50/50">

                        {/* Empty state */}
                        {chatMessages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <span className="text-3xl mb-3">🧠</span>
                                <p className="text-zinc-800 font-black text-sm">Ask me about your notes</p>
                                <p className="text-zinc-400 text-xs font-medium mt-1 mb-4">
                                    I can find and summarize anything you've written
                                </p>
                                <div className="space-y-2 w-full">
                                    {[
                                        "Summarize all my notes",
                                        "What did I write about React?",
                                        "Find my most recent ideas"
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setChatInput(suggestion)}
                                            className="w-full text-left text-xs font-bold text-indigo-500 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === "user"
                                        ? "bg-zinc-900 text-white rounded-br-sm"
                                        : "bg-white border border-zinc-100 text-zinc-700 rounded-bl-sm shadow-sm"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-zinc-100 bg-white shrink-0 flex gap-2 items-center">
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}
                            placeholder="Ask about your notes..."
                            className="flex-1 bg-zinc-100 text-zinc-900 text-sm font-medium placeholder:text-zinc-400 outline-none rounded-xl px-4 py-2.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!chatInput.trim() || isChatLoading}
                            className="w-9 h-9 bg-zinc-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
                        >
                            <FiSend className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
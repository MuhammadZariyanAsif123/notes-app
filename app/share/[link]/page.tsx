import prisma from '@/app/lib/prisma'
import { FiCommand, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import Link from 'next/link'

interface Props {
    params: { link: string }
}

export default async function SharedNotePage({ params }: Props) {
    const { link } = await params

    const note = await prisma.note.findUnique({
        where: { link: link },
        select: {
            title: true,
            content: true,
            createdAt: true,
            mood: true
        }
    })

    if (!note) {
        return (
            <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] flex items-center justify-center px-6 font-serif">
                <div className="max-w-md w-full border border-[#1A1A1A] p-12 bg-white shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
                    <span className="text-4xl block mb-6">✕</span>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-4 leading-none">
                        Archive Entry Missing
                    </h1>
                    <p className="font-sans text-sm text-zinc-500 mb-8 leading-relaxed">
                        The requested note cannot be found. The link may have expired or been revoked by the author.
                    </p>
                    <Link
                        href="/"
                        className="w-full justify-between px-5 py-4 bg-[#1A1A1A] text-[#FAF9F5] text-xs font-bold font-sans uppercase tracking-widest hover:bg-zinc-800 transition-colors inline-flex items-center"
                    >
                        Return to NoteDrop <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] font-sans antialiased selection:bg-[#1A1A1A] selection:text-[#FAF9F5]">

            {/* Minimalist Magazine Border Frame (Hidden on small screens) */}
            <div className="hidden lg:block fixed inset-6 border border-[#1A1A1A]/10 pointer-events-none z-50" />

            {/* Editorial Header / Navbar */}
            <header className="border-b border-[#1A1A1A] px-6 lg:px-12 py-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 bg-[#1A1A1A] text-[#FAF9F5] flex items-center justify-center rounded-xs group-hover:rotate-90 transition-transform duration-300">
                        <FiCommand className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-black tracking-tighter text-xl uppercase">Note Drop //</span>
                </Link>

                <div className="flex items-center gap-8">
                    <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        Vol. 01 // Public Archive
                    </span>
                    <Link
                        href="/"
                        className="text-xs font-bold uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors inline-flex items-center gap-1"
                    >
                        Publish Yours <FiArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </header>

            {/* Main Content Layout Grid */}
            <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-32">

                {/* Magazine Layout Wrapper */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Title & Metadata Frame */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-[#1A1A1A] text-[#FAF9F5] px-2.5 py-1">
                                    Shared Broadcast
                                </span>
                                {note.mood && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest border border-[#1A1A1A] px-2.5 py-0.5">
                                        Context: {note.mood}
                                    </span>
                                )}
                            </div>

                            {/* Dramatic Serif/Sans Hybrid Magazine Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl bg-linear-180  from-red-500 to-yellow-400 text-transparent bg-clip-text tracking-tighter uppercase leading-[0.95] wrap-break-word">
                                {note.title}
                            </h1>
                        </div>

                        {/* Minimalist Grid Metadata Table */}
                        <div className="border-t-2 border-[#1A1A1A] pt-6 grid grid-cols-2 gap-4 text-xs font-mono text-zinc-500">
                            <div>
                                <p className="uppercase text-[10px] font-bold text-[#1A1A1A] tracking-wider mb-1">Index Date</p>
                                <p>
                                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="uppercase text-[10px] font-bold text-[#1A1A1A] tracking-wider mb-1">Source Node</p>
                                <p className="truncate">NXS-{link?.slice(0, 6).toUpperCase() || 'EXTERNAL'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Note Body Text Block */}
                    <div className="lg:col-span-7 lg:border-l lg:border-[#1A1A1A]/10 lg:pl-16">
                        {/* Elegant dropping capitalization option using font styling */}
                        <div className="font-serif text-xl sm:text-2xl text-zinc-800 leading-[1.8] tracking-normal whitespace-pre-wrap selection:bg-[#1A1A1A] selection:text-[#FAF9F5]">
                            {note.content}
                        </div>

                        {/* Structural Layout Accent */}
                        <div className="mt-16 flex items-center justify-between text-xs font-mono text-zinc-400 border-t border-[#1A1A1A]/10 pt-4">
                            <span>// End of Entry</span>
                            <span>Words: {note.content.split(/\s+/).filter(Boolean).length}</span>
                        </div>
                    </div>
                </div>

                {/* Editorial Callout Block / Magazine Footer Banner */}


                {/* Fine Print Editorial Footer */}
                <footer className="mt-16 pt-8 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    <p>© 2026 NoteDrop System Inc.</p>
                    <p>Designed for Clarity & Intellect</p>
                </footer>
            </main>
        </div>
    )
}
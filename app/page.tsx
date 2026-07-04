'use client'
import { useEffect, useState } from "react";
import loader from '../public/loader.svg'
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Modal from "./components/Modal/Modal";
import Pagination from "./components/Pagination/Pagination";
import { Show, SignInButton, UserButton } from "@clerk/nextjs"

// Import modern Feather Icons from react-icons
import { FiCommand, FiArrowRight, FiEdit2, FiTrash2, FiX, FiExternalLink, FiSearch } from "react-icons/fi";

export interface Notes {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  mood?: string
}

const schema = yup.object({
  title: yup.string().required("Don't forget a title"),
  content: yup.string().required("Note content cannot be empty")
}).required()

type NoteFormData = yup.InferType<typeof schema>;

export default function Home() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NoteFormData>({
    resolver: yupResolver(schema)
  })

  const [notesList, setNotesList] = useState<Notes[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Notes>()

  const [viewNote, setViewNote] = useState<Notes | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [summary, setSummary] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // 1. FILTER FIRST (Derived state calculated on every render)
  const displayedNotes = notesList.filter((note) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = note.title?.toLowerCase().includes(query);
    const contentMatch = note.content?.toLowerCase().includes(query);
    const moodMatch = note.mood?.toLowerCase().includes(query);
    return titleMatch || contentMatch || moodMatch;
  });

  // 2. SLICE AND PAGINATE BASED ON FILTERED RESULTS
  let pageSize = 4;
  let start = (currentPage - 1) * pageSize
  let end = start + pageSize
  // Dynamic total pages calculation using the filtered array length
  let totalPages = Math.ceil(displayedNotes.length / pageSize)

  useEffect(() => {
    fetchNotes()
  }, [isOpen, viewNote])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages])

  // Reset to page 1 whenever the query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const fetchNotes = async () => {
    try {
      let data = await fetch("/api/getNotes").then((data) => data.json())
      if (data.length > 0) {
        data.sort((a: Notes, b: Notes) => b.id - a.id)
        setNotesList(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: NoteFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/createNotes", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response?.status == 200) {
        await fetchNotes()
        toast.success("Note captured successfully 🚀")
        reset();
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch("/api/deleteNotes", {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(id)
      })

      if (response?.status == 200) {
        await fetchNotes();
        toast.success("Note deleted")
        if (viewNote?.id === id) setViewNote(null);
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const editNote = (id: number) => {
    setIsOpen(true)
    const notes = notesList.find((item: Notes) => item.id == id)
    setSelectedNote(notes)
  }

  const summarizeNotes = async (notes: Notes) => {
    setIsDisabled(true)
    try {
      const { title, content } = notes
      const response = await fetch('/api/summarizeNotes', {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content })
      })

      if (response.status === 200) {
        const data = await response.json()
        setSummary(data.summary)
      }
    } catch (error: any) {
      toast.error("Failed to summarize note. Please try again.")
    } finally {
      setIsDisabled(false)
    }
  }

  const acceptSummary = async (notes: Notes) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/updateNotes', {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          {
            id: notes.id,
            data: notes
          })
      })

      if (response.status == 200) {
        toast.success("Notes updated successfully")
        setViewNote(null)
        setSummary("")
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const shareNote = async (id: number) => {
    try {
      const response = await fetch('/api/shareNote', {
        method: 'POST',
        headers: { "content-type": "application/json" },
        body: JSON.stringify(id)
      })

      if (response.status === 200) {
        const data = await response.json()
        const link = process.env.NEXT_PUBLIC__APP_URL?.concat(`/share/${data.link}`) || ""
        await navigator.clipboard.writeText(link)
        toast.success("Link Copied Successfully")
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const searchNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentQuery = event.target.value.toLowerCase();
    setSearchQuery(currentQuery)
  };

  return (
    <>
      <div className="min-h-screen lg:h-dvh lg:overflow-hidden bg-[#F4F4F6] text-zinc-900 font-sans selection:bg-indigo-500 selection:text-white relative flex flex-col">
        {/* Background Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-linear-to-br from-indigo-300/40 to-purple-300/40 blur-[120px] pointer-events-none -z-10 animate-float-1" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-linear-to-tr from-pink-300/30 to-orange-200/30 blur-[120px] pointer-events-none -z-10 animate-float-2" />

        {/* Floating Pill Header */}
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <header className="w-full max-w-6xl bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full h-14 px-5 flex items-center justify-between pointer-events-auto animate-fade-in-up">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <FiCommand className="w-4 h-4" />
              </div>
              <span className="font-black tracking-tight text-lg uppercase">Note Drop</span>
            </div>
            <div className="flex items-center gap-2 scale-90 sm:scale-100">
              <Show when="signed-in"><UserButton /></Show>
              <Show when="signed-out"><SignInButton mode="modal" /></Show>
            </div>
          </header>
        </div>

        {/* Dashboard Layout: Fixed Sidebar & Scrolling Grid */}
        <main className="flex-1 w-full max-w-7xl mx-auto pt-24 pb-4 px-4 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8 lg:overflow-hidden">

          {/* Left Column (Sticky/Fixed on Desktop) */}
          <aside className="w-full lg:w-90 shrink-0 lg:h-full lg:overflow-y-auto sleek-scroll animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_20px_50px_-12px_rgb(0,0,0,0.05)] border border-white p-6 sm:p-8 lg:mb-10">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 mb-1">Capture Idea</h2>
                <p className="text-zinc-500 font-medium text-xs">Write down what's on your mind.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <input
                    {...register("title")}
                    placeholder="Note Title"
                    className="w-full bg-zinc-100/50 hover:bg-zinc-100 text-zinc-900 font-bold placeholder:text-zinc-400 outline-none rounded-[1.25rem] px-5 py-4 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition-all duration-300 text-sm"
                  />
                  {errors?.title && <p className="absolute -bottom-4 left-3 text-pink-500 text-[10px] font-bold">{errors.title.message}</p>}
                </div>

                <div className="relative pt-1">
                  <textarea
                    {...register("content")}
                    rows={5}
                    placeholder="Start typing..."
                    className="w-full bg-zinc-100/50 hover:bg-zinc-100 text-zinc-700 placeholder:text-zinc-400 outline-none resize-none leading-relaxed rounded-[1.25rem] px-5 py-4 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition-all duration-300 sleek-scroll text-sm"
                  />
                  {errors?.content && <p className="absolute -bottom-4 left-3 text-pink-500 text-[10px] font-bold">{errors.content.message}</p>}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full h-12 bg-zinc-900 text-white font-bold text-sm rounded-[1.25rem] shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Create Note
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Right Column (Independently Scrollable on Desktop) */}
          <section className="flex-1 lg:h-full lg:overflow-y-auto sleek-scroll lg:pr-4 pb-20 lg:pb-10">
            {!isLoading && notesList.length > 0 && (
              <div className="w-full mb-2 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="relative w-full max-w-md ml-auto">
                  <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400 pointer-events-none">
                    <FiSearch className="w-4 h-4" />
                  </span>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => searchNotes(event)}
                    placeholder="Search notes..."
                    className="w-full h-11 bg-white/60 hover:bg-white/90 focus:bg-white text-zinc-900 text-sm font-medium placeholder:text-zinc-400 outline-none rounded-full pl-11 pr-4 border border-zinc-200 focus:border-indigo-500 shadow-xs focus:shadow-[0_8px_20px_rgba(99,102,241,0.08)] transition-all duration-300"
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-4 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-full min-h-75">
                <div className="relative flex justify-center items-center">
                  <div className="absolute w-12 h-12 border-4 border-indigo-200 rounded-full animate-ping"></div>
                  <Image className="relative z-10 animate-bounce" src={loader} alt="Loading..." width={32} height={32} />
                </div>
              </div>
            ) : notesList.length === 0 ? (
              <div className="h-full min-h-100 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm border-2 border-dashed border-zinc-200/80 rounded-4xl p-10 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-5 rotate-[-10deg] hover:rotate-0 transition-transform duration-500">
                  <span className="text-3xl">✍️</span>
                </div>
                <h3 className="text-xl font-black text-zinc-800">It's pretty quiet here.</h3>
                <p className="text-zinc-500 mt-1 text-sm font-medium">Create your first note to get started.</p>
              </div>
            ) : displayedNotes.length === 0 ? (
              /* No matching search query placeholder */
              <div className="h-full min-h-80 flex flex-col items-center justify-center bg-white/40 border border-zinc-200 rounded-4xl p-8 text-center animate-fade-in-up">
                <span className="text-2xl mb-3">🔍</span>
                <h3 className="text-base font-bold text-zinc-700">No results found</h3>
                <p className="text-zinc-400 text-xs mt-0.5">We couldn't find anything matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 3. MAP OVER DYNAMICALLY SLICED DECORATED LIST */}
                {displayedNotes.slice(start, end).map((item: Notes) => (
                  <div
                    key={item.id}
                    className="group bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-400 flex flex-col h-55 relative overflow-hidden animate-fade-in-up"
                  >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-zinc-100 text-zinc-600 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                        {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      <div className="flex gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button onClick={() => editNote(item.id)} className="w-7 h-7 flex items-center justify-center cursor-pointer bg-zinc-900 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm" title="Edit">
                          <FiEdit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteNote(item.id)} className="w-7 h-7 cursor-pointer flex items-center justify-center bg-rose-500 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm" title="Delete">
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => shareNote(item.id)} className="w-7 h-7 cursor-pointer flex items-center justify-center bg-rose-500 text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm" title="Share Link">
                          <FiExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 relative z-10 flex flex-col">
                      <h3 className="font-black text-lg tracking-tight text-zinc-900 mb-2 truncate">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-2">
                        {item.content}
                      </p>

                      <div className="flex items-center justify-between mt-5">
                        <button
                          onClick={() => setViewNote(item)}
                          className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 group/btn"
                        >
                          Read full note
                          <FiArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        {item.mood && (
                          <div className="relative group/mood">
                            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-pink-400 via-violet-400 to-indigo-400 opacity-30 blur-lg group-hover/mood:opacity-60 transition duration-500" />
                            <span className="absolute -top-1 -left-1 text-[8px] text-yellow-400 animate-pulse">✦</span>
                            <span className="absolute -bottom-1 -right-1 text-[8px] text-pink-400 animate-pulse delay-300">✦</span>
                            <div className="relative flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-xl px-3 py-1.5 shadow-lg transition-all duration-300 group-hover/mood:scale-105">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-yellow-200 to-orange-200 shadow-sm">✨</div>
                              <span className="max-w-30 truncate text-[11px] font-semibold text-zinc-700">{item.mood}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination renders based on total pages derived directly from search matches */}
            {!isLoading && displayedNotes.length > 0 && (
              <div className="mt-8 mb-4 flex justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </section>
        </main>

        <ToastContainer
          position="bottom-center"
          toastClassName="!bg-zinc-900 !text-white !rounded-[1.25rem] !shadow-[0_20px_40px_rgb(0,0,0,0.2)] !font-sans !font-bold !px-5 !py-3 !text-sm"
          hideProgressBar
        />

        {isOpen && (
          <Modal handleModal={setIsOpen} isOpen={isOpen} notes={selectedNote} loader={loader} />
        )}

        {viewNote && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm cursor-pointer transition-opacity"
              onClick={() => { setViewNote(null); setSummary(""); }}
            />
            <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-pop-in">
              <div className="px-6 py-5 border-b border-zinc-100 flex justify-between items-center bg-white z-10 shrink-0">
                <h2 className="text-xl font-black text-zinc-900 truncate pr-4">{viewNote.title}</h2>
                <button
                  onClick={() => { setViewNote(null); setSummary(""); }}
                  className="w-8 h-8 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-colors shrink-0"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto sleek-scroll bg-zinc-50/50 flex-1 space-y-6">
                <p className="text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">{viewNote.content}</p>
                {summary && (
                  <div className="border-t border-zinc-100 pt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">✨ AI Summary</span>
                      <button
                        onClick={() => acceptSummary({ ...viewNote, content: summary })}
                        className="text-[10px] flex flex-row gap-2 text-zinc-400 hover:text-zinc-600 font-bold transition-colors"
                      >
                        <span>Accept </span>
                        {isLoading && <Image className="relative z-10 " src={loader} alt="Loading..." width={10} height={10} />}
                      </button>
                      <button onClick={() => setSummary("")} className="text-[10px] text-zinc-400 hover:text-zinc-600 font-bold transition-colors">Dismiss</button>
                    </div>
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-[1.25rem] px-5 py-4">
                      <p className="text-zinc-700 text-sm font-medium leading-relaxed">{summary}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-zinc-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-zinc-400">
                  {new Date(viewNote.updatedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setViewNote(null); setSummary(""); editNote(viewNote.id); }}
                    className="px-5 py-2 bg-zinc-100 cursor-pointer hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-full transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => summarizeNotes(viewNote)}
                    disabled={isDisabled}
                    className="px-5 py-2 bg-indigo-500 cursor-pointer hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2"
                  >
                    {isDisabled ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      "✨ Summarize"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
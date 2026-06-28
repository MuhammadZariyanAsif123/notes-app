"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiX, FiEdit2, FiCheck } from "react-icons/fi";
import loader from '../public/loader.svg'


export default function Modal({ handleModal, isOpen, notes, handleLoader }: any) {

    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });

    // Populate the form whenever a note is selected
    useEffect(() => {
        if (notes) {
            setFormData({
                title: notes.title || "",
                content: notes.content || "",
            });
        }
    }, [notes]);

    const updateNote = async (id: number) => {

        try {

            const response = await fetch('/api/updateNotes', {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(
                    {
                        id: id,
                        data: formData
                    })
            })


            if (response.status == 200) {
                toast.success("Notes updated successfully")
                handleModal(!isOpen)
            }

        }

        catch (error: any) {
            toast.error(error)
        }

    }

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
            {/* Blurred Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm transition-opacity cursor-pointer"
                onClick={() => handleModal(false)}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-xl bg-white rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-pop-in">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 sm:px-8 bg-white z-10 shrink-0">
                    <h2 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-500">
                            <FiEdit2 className="w-4 h-4" />
                        </span>
                        Edit Note
                    </h2>

                    <button
                        onClick={() => handleModal(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 shrink-0"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 bg-zinc-50/50 flex-1 overflow-y-auto sleek-scroll">
                    <form className="space-y-5">
                        <div className="relative">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                                Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter note title"
                                className="w-full bg-zinc-100/60 hover:bg-zinc-100 text-zinc-900 font-bold placeholder:text-zinc-400 outline-none rounded-[1.25rem] px-5 py-4 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition-all duration-300 text-sm"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="relative pt-2">
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">
                                Content
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Write your note here..."
                                className="w-full bg-zinc-100/60 hover:bg-zinc-100 text-zinc-700 placeholder:text-zinc-400 outline-none resize-none leading-relaxed rounded-[1.25rem] px-5 py-4 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition-all duration-300 sleek-scroll text-sm"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        content: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 border-t border-zinc-100 bg-white px-6 py-5 sm:px-8 shrink-0">
                    <button
                        onClick={() => handleModal(!isOpen)}
                        className="w-full sm:w-auto rounded-full px-6 py-3 font-bold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => updateNote(notes.id)}
                        className="w-full sm:w-auto h-12 bg-zinc-900 text-white font-bold text-sm rounded-full px-8 shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Update Note
                            <FiCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </span>
                        {/* Hidden colorful glow that appears on hover */}
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    </button>
                </div>
            </div>
        </div>
    );
}


import { slidingWindow } from "@/app/lib/slidingWindow";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

    const visiblePages = slidingWindow(currentPage, totalPages)

    return (
        <div className="flex items-center justify-center gap-2 py-6 ">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                ←
            </button>

            <div className="flex gap-1">
                {visiblePages.map((page) => {
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition ${page === currentPage
                                ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    )
                })

                }
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                →
            </button>
        </div>
    );
}
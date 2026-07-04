// 1. Establish your configuration threshold

export function slidingWindow(currentPage: number, totalPages: number) {

    const maxVisibleButtons = 5;

    // 2. Default fallback: If total pages are small, just show them all
    let startPage = 1;
    let endPage = totalPages;

    // 3. Apply the sliding window if total pages exceed our maximum cap
    if (totalPages > maxVisibleButtons) {
        // Determine how many buttons should sit on either side of the current active page
        const halfWindow = Math.floor(maxVisibleButtons / 2);

        startPage = currentPage - halfWindow;
        endPage = currentPage + halfWindow;

        // Underflow Guard: If sliding too far left, snap to start
        if (startPage < 1) {
            startPage = 1;
            endPage = maxVisibleButtons;
        }

        // Overflow Guard: If sliding too far right, snap to end
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - maxVisibleButtons + 1;
        }
    }

    // 4. Generate the exact range array to map over in your JSX
    const visiblePages = Array.from(
        { length: (endPage - startPage) + 1 },
        (_, i) => startPage + i
    );

    return visiblePages;
}




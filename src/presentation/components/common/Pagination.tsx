type PaginationProps = {
    page: number,
    totalPages: number,
    onNext: () => void,
    onPrev: () => void,
}

const Pagination = ({page, totalPages, onNext, onPrev}: PaginationProps) => {

  return (
    <div className="flex justify-center mt-4 gap-4">
      <button
        disabled={page === 1}
        onClick={onPrev}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm font-semibold">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={onNext}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Pagination = ({ page, totalPages, onNext, onPrev }) => {
    return (_jsxs("div", { className: "flex justify-center mt-4 gap-4", children: [_jsx("button", { disabled: page === 1, onClick: onPrev, className: "px-3 py-1 bg-gray-300 rounded disabled:opacity-50", children: "Prev" }), _jsxs("span", { className: "text-sm font-semibold", children: ["Page ", page, " of ", totalPages] }), _jsx("button", { disabled: page === totalPages, onClick: onNext, className: "px-3 py-1 bg-gray-300 rounded disabled:opacity-50", children: "Next" })] }));
};
export default Pagination;

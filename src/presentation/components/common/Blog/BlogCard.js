import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { easeOut, motion } from "framer-motion";
import { Eye, Heart, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../ui/button";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
export default function BlogCard({ blog, onReadMore, className = "" }) {
    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(date));
    };
    const formatNumber = (num) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easeOut },
        },
        hover: {
            y: -8,
            transition: { duration: 0.3, ease: easeOut },
        },
    };
    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3, ease: easeOut },
        },
    };
    const Translate = ({ initialText }) => {
        const editor = useEditor({
            extensions: [StarterKit],
            content: initialText, // load plain string here
        });
        const text = editor.getText();
        return _jsx(motion.p, { className: "text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3 flex-grow", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: text });
    };
    return (_jsx(motion.div, { variants: cardVariants, initial: "hidden", animate: "visible", whileHover: "hover", className: `w-full max-w-sm mx-auto sm:max-w-none ${className}`, children: _jsx(Card, { className: "overflow-hidden border-0 shadow-lg p-0 hover:shadow-xl transition-shadow duration-300 bg-white h-full", children: _jsxs(CardContent, { className: "p-0 flex flex-col h-full", children: [_jsx("div", { className: "relative overflow-hidden", children: _jsxs(motion.div, { variants: imageVariants, className: "relative", children: [_jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${blog.image}` || "/placeholder.svg?height=300&width=500", alt: blog.title, className: "w-full h-68 sm:h-76 md:h-84 object-cover cursor-pointer", onClick: () => onReadMore?.(blog._id) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" }), _jsxs("div", { className: "absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col sm:flex-row gap-1 sm:gap-2", children: [_jsxs(Badge, { className: "bg-black/70 text-white text-xs flex items-center justify-center", children: [_jsx(Eye, { className: "w-3 h-3 mr-1" }), formatNumber(blog.views || 0)] }), _jsxs(Badge, { className: "bg-black/70 text-white text-xs flex items-center justify-center", children: [_jsx(Heart, { className: "w-3 h-3 mr-1" }), formatNumber(blog.likes?.length || 0)] })] })] }) }), _jsxs("div", { className: "p-3 sm:p-4 md:p-6 flex flex-col flex-grow", children: [_jsx(motion.h3, { className: "text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors leading-tight", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, onClick: () => onReadMore?.(blog._id), children: blog.title }), _jsx(Translate, { initialText: blog.introduction || blog.sections?.[0]?.content?.substring(0, 150) + "..." || "No content available" }), blog.sections && blog.sections.length > 0 && (_jsxs(motion.div, { className: "mb-3 sm:mb-4", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, children: [_jsxs("div", { className: "text-xs text-gray-500 mb-2", children: [blog.sections.length, " section", blog.sections.length !== 1 ? "s" : "", ":"] }), _jsxs("div", { className: "flex flex-wrap gap-1 sm:gap-2", children: [blog.sections
                                                .filter((section) => section.sectionTitle?.trim())
                                                .slice(0, 2)
                                                .map((section, index) => (_jsx(Badge, { variant: "outline", className: "text-xs truncate max-w-[100px] sm:max-w-[120px]", children: section.sectionTitle }, index))), blog.sections.filter((s) => s.sectionTitle?.trim()).length > 2 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", blog.sections.filter((s) => s.sectionTitle?.trim()).length - 2] }))] })] })), _jsxs(motion.div, { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-1 sm:gap-3", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.5 }, children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: "font-medium", children: ["By ", blog.author] }) }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), _jsx("span", { children: formatDate(blog.createdAt) })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.7 }, className: "mt-auto", children: _jsxs(Button, { onClick: () => onReadMore?.(blog._id), className: "w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base transition-colors duration-200", children: ["READ MORE", _jsx(ChevronRight, { className: "w-4 h-4 ml-1" })] }) })] })] }) }) }));
}

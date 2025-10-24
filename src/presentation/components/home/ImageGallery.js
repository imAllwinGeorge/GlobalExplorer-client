import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const ImageGallery = ({ images }) => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen ", children: [_jsx("div", { className: "max-2-7xl mx-auto", children: _jsx(motion.div, { initial: "hidden", animate: "visible", variants: {
                        hidden: {
                            opacity: 0,
                        },
                        visible: {
                            opacity: 1,
                            transition: {
                                duration: 0.6,
                            },
                        },
                    }, children: _jsx(motion.h1, { variants: {
                            hidden: {
                                opacity: 0,
                                y: 20,
                            },
                            visible: {
                                opacity: 1,
                                y: 0,
                            },
                        }, transition: { duration: 0.6 }, className: "text-lg text-black max-w-2xl mx-auto", children: "Image Gallery" }) }) }), _jsx(motion.div, { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, ease: "easeInOut" }, className: "grid grid-cols-1 sm:grid-cos-2 lg:grid-cols-3 gap-6", children: images.map((item) => {
                    console.log(item.url);
                    return (_jsxs(motion.div, { className: "relative cursor-pointer ", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, onClick: () => navigate(item.url), children: [_jsx("img", { className: "w-full h-64 object-cover rounded-lg", src: item.image, alt: item.title }), _jsx("div", { className: "absolute inset-0 group-hover:bg-black/60 duration-200 flex items-end", children: _jsx("div", { className: "p-4 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duratiion-200", children: _jsx("h3", { className: "font-semibold text-lg", children: item.title }) }) })] }, item._id));
                }) })] }));
};
export default ImageGallery;

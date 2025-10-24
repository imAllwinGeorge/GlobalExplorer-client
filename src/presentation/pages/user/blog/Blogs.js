import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
// import BlogWriter from "../../components/common/Blog/Blog-Writer";
import { useSelector } from "react-redux";
import BlogCard from "../../../components/common/Blog/BlogCard";
import { userService } from "../../../../services/UserService";
import { Button } from "../../../components/ui/button";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../../../components/common/Pagination";
// import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { HttpStatusCode,
// LOCAL_STORAGE_KEYS,
 } from "../../../../shared/constants/constants";
// import BlogRead from "../../../components/common/Blog/Read-Blog";
import { useNavigate } from "react-router-dom";
const Blogs = () => {
    const navigate = useNavigate();
    // const [openModal, setOpenModal] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const [blogs, setBlogs] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [triggerFetch, setTriggerFetch] = useState(true);
    const [blogsView, setBlogsView] = useState(true);
    // const [selectedBlog, setSelectedBlog] = useLocalStorage<BlogPost | null>(
    //   LOCAL_STORAGE_KEYS.SELECTED_BLOG,
    //   null
    // );
    // const handleSave = async (formData: FormData) => {
    //   try {
    //     const response = await userService.createBlog(formData);
    //     if (response.status === HttpStatusCode.CREATED) {
    //       console.log(response);
    //       setOpenModal(false);
    //       setTriggerFetch((prev) => !prev);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     if (error instanceof Error) {
    //       toast.error(error.message);
    //     }
    //   }
    // };
    const myBlogs = async () => {
        if (!user)
            return;
        try {
            const response = await userService.getMyBlogs(user?._id, page, 9);
            console.log(response);
            if (response.status === HttpStatusCode.OK) {
                setBlogs(response.data.blogs);
                setTotalPages(response.data.totalPages);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await userService.getBlogs(page, 9);
                if (response.status === HttpStatusCode.OK) {
                    setBlogs(response.data.blogs);
                    setTotalPages(response.data.totalPages);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchBlogs();
    }, [page, triggerFetch]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b border-gray-200 sticky top-0 z-40", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0", children: [_jsxs("div", { className: "text-center sm:text-left", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900", children: "Travel Blogs" }), _jsx("p", { className: "text-gray-600 mt-1 text-sm sm:text-base", children: "Discover amazing travel stories and adventures" })] }), user && (_jsxs(_Fragment, { children: [blogsView ? (_jsxs(Button, { onClick: () => {
                                            myBlogs();
                                            setBlogsView(false);
                                        }, className: "bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto", children: [_jsx(PlusCircle, { className: "w-5 h-5" }), "My Blogs"] })) : (_jsxs(Button, { onClick: () => {
                                            setTriggerFetch((prev) => !prev);
                                            setBlogsView(true);
                                        }, className: "bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto", children: [_jsx(PlusCircle, { className: "w-5 h-5" }), "See All Blogs"] })), _jsxs(Button
                                    // onClick={() => setOpenModal(true)}
                                    , { 
                                        // onClick={() => setOpenModal(true)}
                                        onClick: () => navigate(`/blog/write/${user._id}`), className: "bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto", children: [_jsx(PlusCircle, { className: "w-5 h-5" }), "Write Blog"] })] }))] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8", children: blogs && (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8", children: blogs.map((blog, index) => (_jsx(BlogCard, { blog: blog, onReadMore: (id) => navigate(`/blog/read/${id}`) }, `${blog._id}-${index}`))) })) }), _jsx(Pagination, { page: page, totalPages: totalPages, onPrev: () => setPage((prev) => Math.max(prev - 1, 1)), onNext: () => setPage((prev) => Math.min(prev + 1, totalPages)) })] }));
};
export default Blogs;

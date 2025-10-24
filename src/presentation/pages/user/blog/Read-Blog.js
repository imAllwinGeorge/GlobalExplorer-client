import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import BlogEdit from "../../../components/common/Blog/Edit-Blog";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../../../services/UserService";
import ConfirmModal from "../../../components/sharedElements/ConfirmModal";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate, useParams } from "react-router-dom";
import { HttpStatusCode } from "../../../../shared/constants/constants";
export default function BlogRead() {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState();
    const user = useSelector((state) => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);
    const [editBlog, setEditBlog] = useState(false);
    const navigate = useNavigate();
    console.log(user, id);
    const deleteBlog = async (id) => {
        try {
            const response = await userService.deleteBlog(id);
            if (response.status === HttpStatusCode.OK) {
                toast.success("Blog deleted");
                // onBack();
                navigate(-1);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    const editor = useEditor({
        shouldRerenderOnTransaction: false,
        content: "",
        extensions: [StarterKit],
    });
    useEffect(() => {
        console.log("Use effect triggered: ", id);
        const fetchBlog = async () => {
            try {
                const response = await userService.getBlog(id);
                console.log(response);
                if (response.status === HttpStatusCode.OK) {
                    setBlogPost(response.data.blog);
                    editor.commands.setContent(response.data.blog.introduction);
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchBlog();
    }, [id, editor]);
    useEffect(() => {
        console.log("Editor initialized:", !!editor);
    }, [editor]);
    function ReadOnlyEditor({ html }) {
        const editor = useEditor({
            extensions: [StarterKit],
            content: html,
            editable: false,
        });
        return _jsx(EditorContent, { editor: editor });
    }
    // 🔁 Toggle between blog preview and edit page
    if (editBlog) {
        return (_jsx("div", { className: "min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10", children: _jsx("div", { className: "w-full max-w-4xl", children: blogPost && (_jsx(BlogEdit, { blogPost: blogPost, onSave: () => {
                        setEditBlog(false);
                        // onBack(); // or refetch updated blog
                    }, onCancel: () => setEditBlog(false) })) }) }));
    }
    // 📰 Blog preview
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Blog Preview" }), _jsxs("div", { className: "flex gap-2", children: [user?._id === blogPost?.userId && (_jsxs(_Fragment, { children: [_jsxs(Button, { onClick: () => setEditBlog(true), variant: "outline", children: [_jsx(Edit3, { className: "w-4 h-4 mr-2" }), "Edit"] }), _jsxs(Button, { onClick: () => setIsOpen(true), variant: "outline", children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Delete"] })] })), _jsxs(Button, { onClick: () => navigate(-1), variant: "outline", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"] })] })] }), blogPost && (_jsx(Card, { className: "bg-white shadow-md", children: _jsxs(CardContent, { className: "p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: blogPost.title || "Your Blog Title" }), blogPost.introduction && _jsx(EditorContent, { editor: editor }), blogPost.image && (_jsx("div", { className: "mb-4", children: _jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${blogPost.image}`, alt: blogPost.title, className: "w-full max-w-2xl mx-auto rounded-lg shadow-md" }) }))] }), blogPost.sections.map((section, index) => (_jsxs("div", { id: index.toString(), className: "mb-8", children: [section.sectionTitle && (_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: section.sectionTitle })), section.content && (_jsx("div", { className: "prose max-w-none mb-4", children: _jsx(ReadOnlyEditor, { html: section.content }) })), section.image && (_jsx("div", { className: "mb-4", children: _jsx("img", { src: `${import.meta.env.VITE_IMG_URL}${section.image}`, alt: section.sectionTitle, className: "w-full max-w-2xl mx-auto rounded-lg shadow-md" }) }))] }, index)))] }) }))] }), _jsx(ConfirmModal, { isOpen: isOpen, onClose: () => setIsOpen(false), onConfirm: () => blogPost && deleteBlog(blogPost._id), title: "Delete Blog", message: "Do you want to delete this Blog?" })] }));
}

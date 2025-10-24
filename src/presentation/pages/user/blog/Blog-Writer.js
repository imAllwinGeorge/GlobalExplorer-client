"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Plus, Upload, X, Save, Type, List } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../../..//styles/_style.scss";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { userService } from "../../../../services/UserService";
import { HttpStatusCode } from "../../../../shared/constants/constants";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import Input from "../../../components/ui/Input";
import { SimpleEditor } from "../../../../components/tiptap-templates/simple/simple-editor";
export default function BlogWriter() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [blogPost, setBlogPost] = useState({
        userId: userId,
        title: "",
        author: "",
        introduction: "",
        sections: [],
        image: "",
    });
    const [isPreview, setIsPreview] = useState(false);
    const fileInputRefs = useRef({});
    const coverImageRef = useRef(null);
    const [errors, setErrors] = useState({});
    // const [ richTextSample, setRichTextSample] = useState<null | string>(null);
    const editor = useEditor({
        shouldRerenderOnTransaction: false,
        content: ``,
        extensions: [StarterKit],
    });
    const submitData = async (formData) => {
        try {
            const response = await userService.createBlog(formData);
            if (response.status === HttpStatusCode.CREATED) {
                console.log(response);
                navigate(-1);
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    useEffect(() => {
        const allContent = `${blogPost.introduction || ""}
    ${blogPost.sections.map((section) => section).join(" ") || ""}`;
        // editor.commands.setContent(blogPost.sections.map((section) => section.content))
        editor.commands.setContent(allContent);
    }, [blogPost, editor]);
    const addNewSection = () => {
        const newSection = {
            sectionTitle: "",
            content: "",
            image: undefined,
        };
        setBlogPost((prev) => ({
            ...prev,
            sections: [...prev.sections, newSection],
        }));
    };
    const updateSection = (selectedIndex, field, value) => {
        setBlogPost((prev) => ({
            ...prev,
            sections: prev.sections.map((section, index) => index === selectedIndex ? { ...section, [field]: value } : section),
        }));
    };
    const removeSection = (selectedIndex) => {
        setBlogPost((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, index) => index !== selectedIndex),
        }));
    };
    const handleImageUpload = (selectedIndex, event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Store the File object directly instead of converting to string
            updateSection(selectedIndex, "image", file);
        }
    };
    // useEffect(() => {
    //   if (open) {
    //     document.body.classList.add("overflow-hidden");
    //   } else {
    //     document.body.classList.remove("overflow-hidden");
    //   }
    //   return () => document.body.classList.remove("overflow-hidden");
    // }, [open]);
    // if (!open) return null;
    const generateTableOfContents = () => {
        return blogPost.sections.filter((section) => section.sectionTitle.trim() !== "");
    };
    const validate = () => {
        const newErrors = {};
        if (!blogPost.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!blogPost.introduction.trim()) {
            newErrors.introduction = "Introduction is required";
        }
        if (!blogPost.author.trim()) {
            newErrors.author = "Please provide author name.";
        }
        if (!blogPost.image) {
            newErrors.image = "Please upload a cover image.";
        }
        if (blogPost.sections.length <= 0) {
            newErrors.sectionlength = "Atleast one section required.";
        }
        const sectionErrors = [];
        blogPost.sections.forEach((section, index) => {
            const secError = {};
            if (!section.sectionTitle.trim()) {
                secError.sectionTitle = "Please provide a section title";
            }
            if (!section.content.trim()) {
                secError.content = "This field cannot be empty";
            }
            if (!section.image) {
                secError.image = "Please upload an image.";
            }
            // Push only if any errors present
            if (Object.keys(secError).length > 0) {
                sectionErrors[index] = secError;
            }
        });
        if (sectionErrors.length > 0) {
            newErrors.sections = sectionErrors;
        }
        return newErrors;
    };
    const saveBlog = () => {
        console.log("Saving blog post:", blogPost);
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Here you would typically send the data to your backend
        const formData = new FormData();
        // Send basic fields separately instead of as JSON string
        formData.append("userId", blogPost.userId);
        formData.append("title", blogPost.title);
        formData.append("author", blogPost.author);
        formData.append("introduction", blogPost.introduction);
        // 1. Separate out the image files from the sections
        const sectionsWithoutFiles = blogPost.sections.map((section, index) => {
            const sec = {
                sectionTitle: section.sectionTitle,
                content: section.content,
                hasImage: section.image instanceof File,
                imageIndex: section.image instanceof File ? index : null,
            };
            return sec;
        });
        // 2. Append stringified sections array to FormData
        formData.append("sections", JSON.stringify(sectionsWithoutFiles));
        // Send sections data as separate fields
        blogPost.sections.forEach((section, index) => {
            // formData.append(`sections[${index}][sectionTitle]`, section.sectionTitle)
            // formData.append(`sections[${index}][content]`, section.content)
            // Handle section images
            if (section.image instanceof File) {
                formData.append(`section-image-${index}`, section.image);
                // formData.append(`sections[${index}][hasImage]`, "true")
                // formData.append(`sections[${index}][imageIndex]`, index.toString())
            }
            console.log(typeof section.image);
        });
        // formData.append("sections", JSON.stringify(blogPost.sections))
        // Attach the main cover image
        if (blogPost.image instanceof File) {
            formData.append("coverImage", blogPost.image);
        }
        for (const [key, value] of formData.entries()) {
            console.log(`formdata values ${key}:`, value);
        }
        submitData(formData);
    };
    // Helper function to get image URL for display
    const getImageUrl = (image) => {
        if (!image)
            return "/placeholder.svg";
        if (typeof image === "string")
            return image;
        return URL.createObjectURL(image);
    };
    if (isPreview) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Blog Preview" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: () => setIsPreview(false), variant: "outline", children: [_jsx(Type, { className: "w-4 h-4 mr-2" }), "Edit"] }), _jsxs(Button, { onClick: saveBlog, className: "bg-green-600 hover:bg-green-700", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Blog"] })] })] }), _jsx(Card, { className: "bg-white", children: _jsxs(CardContent, { className: "p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: blogPost.title || "Your Blog Title" }), _jsx(EditorContent, { editor: editor }), blogPost.introduction && (_jsx("p", { className: "text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto", children: blogPost.introduction })), blogPost.image && (_jsx("div", { className: "mb-4", children: _jsx("img", { src: getImageUrl(blogPost.image) || "/placeholder.svg", alt: blogPost.title, className: "w-full max-w-2xl mx-auto rounded-lg shadow-md" }) }))] }), generateTableOfContents().length > 0 && (_jsxs("div", { className: "mb-8 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400", children: [_jsxs("h3", { className: "font-bold text-orange-800 mb-3", children: ["Table of Contents", " ", _jsx(Badge, { variant: "secondary", className: "ml-2", children: "Show" })] }), _jsx("ul", { className: "space-y-1", children: generateTableOfContents().map((section, index) => (_jsx("li", { children: _jsx("a", { href: `#${index}`, className: "text-blue-600 hover:underline", children: section.sectionTitle }) }, index))) })] })), blogPost.sections.map((section, index) => (_jsxs("div", { id: index.toString(), className: "mb-8", children: [section.sectionTitle && (_jsx("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: section.sectionTitle })), section.content && (_jsxs("div", { className: "prose max-w-none mb-4", children: [editor.commands.setContent(section.content), _jsx(EditorContent, { editor: editor }), section.content.split("\n").map((paragraph, index) => (_jsx("p", { className: "mb-4 text-gray-700 leading-relaxed", children: paragraph }, index)))] })), section.image && (_jsx("div", { className: "mb-4", children: _jsx("img", { src: getImageUrl(section.image) || "/placeholder.svg", alt: section.sectionTitle, className: "w-full max-w-2xl mx-auto rounded-lg shadow-md" }) }))] }, index)))] }) })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Create New Blog Post" }), _jsx("div", { className: "flex gap-2", children: _jsxs(Button, { onClick: saveBlog, className: "bg-green-600 hover:bg-green-700", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Draft"] }) })] }), _jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Type, { className: "w-5 h-5 mr-2" }), "Blog Header"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Blog Headline *" }), _jsx(Input, { placeholder: "Enter your blog headline...", value: blogPost.title, onChange: (e) => setBlogPost((prev) => ({ ...prev, title: e.target.value })), className: "text-lg" }), errors.title && (_jsx("span", { className: "text-red-500", children: errors.title }))] }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Author Name" }), _jsx(Input, { placeholder: "Your name", value: blogPost.author, onChange: (e) => setBlogPost((prev) => ({ ...prev, author: e.target.value })) }), errors.author && (_jsx("span", { className: "text-red-500", children: errors.author }))] }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Introduction" }), _jsx("div", { className: "border-0 rounded-xl outline-[1px] bg-secondary", children: _jsx(SimpleEditor, { setNewPostRichText: (string) => {
                                                    setBlogPost((prev) => ({
                                                        ...prev,
                                                        introduction: string,
                                                    }));
                                                } }) }), errors.introduction && (_jsx("span", { className: "text-red-500", children: errors.introduction }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Cover Image" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "file", accept: "image/*", onChange: (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setBlogPost((prev) => ({
                                                                ...prev,
                                                                image: file,
                                                            }));
                                                        }
                                                    }, ref: coverImageRef, className: "hidden" }), errors.image && (_jsx("span", { className: "text-red-500", children: errors.image })), _jsxs(Button, { onClick: () => coverImageRef.current?.click(), variant: "outline", className: "flex items-center", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Upload Image"] }), blogPost.image && (_jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-800", children: "Image uploaded" })), blogPost.image && (_jsx("div", { className: "mt-4", children: _jsx("img", { src: getImageUrl(blogPost.image) || "/placeholder.svg", alt: "Cover preview", className: "max-w-xs rounded-lg shadow-sm" }) }))] })] }), errors.sectionlength && (_jsx("span", { className: "text-red-500", children: errors.sectionlength }))] })] }), generateTableOfContents().length > 0 && (_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(List, { className: "w-5 h-5 mr-2" }), "Table of Contents Preview"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400", children: [_jsx("h4", { className: "font-semibold text-orange-800 mb-2", children: "Table of Contents" }), _jsx("ul", { className: "space-y-1", children: generateTableOfContents().map((section, index) => (_jsxs("li", { className: "text-blue-600", children: [index + 1, ". ", section.sectionTitle] }, index))) })] }) })] })), _jsx("div", { className: "space-y-6", children: blogPost.sections.map((section, index) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(CardTitle, { className: "text-lg", children: ["Section ", index + 1] }), _jsx(Button, { onClick: () => removeSection(index), variant: "outline", size: "sm", className: "text-red-600 hover:text-red-700", children: _jsx(X, { className: "w-4 h-4" }) })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Section Title" }), _jsx(Input, { placeholder: "Enter section title...", value: section.sectionTitle, onChange: (e) => updateSection(index, "sectionTitle", e.target.value) }), errors.sections?.[index]?.sectionTitle && (_jsx("span", { className: "text-red-500", children: errors.sections[index].sectionTitle }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Content" }), _jsx("div", { className: "border-0 rounded-xl outline-[1px] bg-secondary", children: _jsx(SimpleEditor, { setNewPostRichText: (string) => updateSection(index, "content", string) }) }), errors.sections?.[index]?.content && (_jsx("span", { className: "text-red-500", children: errors.sections[index].content }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Section Image" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "file", accept: "image/*", onChange: (e) => handleImageUpload(index, e), ref: (el) => {
                                                            fileInputRefs.current[index] = el;
                                                        }, className: "hidden" }), errors.sections?.[index]?.image && (_jsx("span", { className: "text-red-500", children: errors.sections[index].image })), _jsxs(Button, { onClick: () => fileInputRefs.current[index]?.click(), variant: "outline", className: "flex items-center", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Upload Image"] }), section.image && (_jsx(Badge, { variant: "secondary", className: "bg-green-100 text-green-800", children: "Image uploaded" }))] }), section.image && (_jsx("div", { className: "mt-4", children: _jsx("img", { src: getImageUrl(section.image) || "/placeholder.svg", alt: "Section preview", className: "max-w-xs rounded-lg shadow-sm" }) }))] })] })] }, index))) }), _jsx("div", { className: "mt-6 text-center", children: _jsxs(Button, { onClick: addNewSection, className: "bg-blue-600 hover:bg-blue-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add New Section"] }) })] }) }));
}

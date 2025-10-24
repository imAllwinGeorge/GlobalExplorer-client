import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Save, Plus, Trash2, Upload, ImageIcon, ArrowLeft } from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import Input from "../../ui/Input";
import toast from "react-hot-toast";
import { userService } from "../../../../services/UserService";
import { HttpStatusCode } from "../../../../shared/constants/constants";
import { SimpleEditor } from "../../../../components/tiptap-templates/simple/simple-editor";
export default function BlogEdit({ blogPost, onSave, onCancel, }) {
    //   const user = useSelector((state: RootState) => state.auth.user);
    const [formData, setFormData] = useState(blogPost);
    const [isLoading, setIsLoading] = useState(false);
    const mainImageRef = useRef(null);
    const sectionImageRefs = useRef([]);
    const [newImages, setNewImages] = useState({
        sectionImages: {},
    });
    const [errors, setErrors] = useState({});
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSectionChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section, i) => i === index ? { ...section, [field]: value } : section),
        }));
    };
    const addSection = () => {
        setFormData((prev) => ({
            ...prev,
            sections: [
                ...prev.sections,
                { sectionTitle: "", content: "", image: undefined },
            ],
        }));
    };
    const removeSection = (index) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index),
        }));
    };
    const handleMainImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewImages((prev) => ({ ...prev, image: file }));
        }
    };
    const handleSectionImageUpload = (index, event) => {
        const file = event.target.files?.[0];
        if (file) {
            //   handleSectionChange(index, "image", file as any);
            setNewImages((prev) => ({
                ...prev,
                sectionImages: {
                    ...prev.sectionImages,
                    [index]: file,
                },
            }));
        }
    };
    const getMainImageUrl = (originalImage) => {
        const newFile = newImages.image;
        if (newFile) {
            return URL.createObjectURL(newFile);
        }
        if (originalImage) {
            return `${import.meta.env.VITE_IMG_URL}${originalImage}`;
        }
    };
    const getImageUrl = (index, originalImage) => {
        const newFile = newImages.sectionImages[index];
        if (newFile) {
            return URL.createObjectURL(newFile);
        }
        if (originalImage) {
            return `${import.meta.env.VITE_IMG_URL}${originalImage}`;
        }
        return "/placeholder.svg?height=200&width=400&text=No Image";
    };
    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!formData.introduction.trim()) {
            newErrors.introduction = "Introduction is required";
        }
        if (!formData.author.trim()) {
            newErrors.author = "Please provide author name.";
        }
        if (!formData.image) {
            newErrors.image = "Please upload a cover image.";
        }
        if (formData.sections.length <= 0) {
            newErrors.sectionlength = "Atleast one section required.";
        }
        const sectionErrors = [];
        formData.sections.forEach((section, index) => {
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
    const handleSave = async () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "sections") {
                data.append(key, JSON.stringify(value));
            }
            else {
                data.append(key, value);
            }
        });
        console.log(newImages);
        data.append("mainImage", newImages.image);
        Object.entries(newImages.sectionImages).forEach(([key, file]) => data.append(key, file));
        try {
            const response = await userService.editBlog(formData._id, data);
            if (response.status === HttpStatusCode.OK) {
                onSave();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
        setIsLoading(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-4xl mx-auto p-4 md:p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Edit Blog Post" }), _jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [_jsxs(Button, { onClick: handleSave, disabled: isLoading, className: "flex-1 sm:flex-none", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), isLoading ? "Saving..." : "Save"] }), _jsxs(Button, { onClick: onCancel, variant: "outline", className: "flex-1 sm:flex-none bg-transparent", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Cancel"] })] })] }), _jsx(Card, { className: "bg-white", children: _jsxs(CardContent, { className: "p-4 md:p-8", children: [_jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "title", className: "text-sm font-medium mb-2 block", children: "Blog Title" }), _jsx(Input, { id: "title", value: formData.title, onChange: (e) => handleInputChange("title", e.target.value), placeholder: "Enter your blog title", className: "text-lg md:text-xl font-semibold" }), errors.title && (_jsx("span", { className: "text-red-500", children: errors.title }))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "author", className: "text-sm font-medium mb-2 block", children: "Author" }), _jsx(Input, { id: "author", value: formData.author, onChange: (e) => handleInputChange("author", e.target.value), placeholder: "Enter author name" }), errors.author && (_jsx("span", { className: "text-red-500", children: errors.author }))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "introduction", className: "text-sm font-medium mb-2 block", children: "Introduction" }), _jsxs("div", { className: "border-0 rounded-xl outline-[1px] bg-gray-50", children: [_jsx(SimpleEditor, { setNewPostRichText: (string) => handleInputChange("introduction", string), initialContent: formData.introduction }), errors.introduction && (_jsx("span", { className: "text-red-500", children: errors.introduction }))] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Featured Image" }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: () => mainImageRef.current?.click(), className: "w-full sm:w-auto", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Upload Image"] }), _jsx("input", { ref: mainImageRef, type: "file", accept: "image/*", onChange: handleMainImageUpload, className: "hidden" }), errors.image && (_jsx("span", { className: "text-red-500", children: errors.image })), formData.image && (_jsx("div", { className: "relative", children: _jsx("img", { src: getMainImageUrl(formData.image) || "/placeholder.svg", alt: "Featured", className: "w-full max-w-md mx-auto rounded-lg shadow-md" }) }))] })] }), _jsxs("div", { className: "space-y-8", children: [errors.sectionlength && (_jsx("span", { className: "text-red-500", children: errors.sectionlength })), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Blog Sections" }), _jsxs(Button, { onClick: addSection, variant: "outline", className: "w-full sm:w-auto bg-transparent", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Section"] })] }), formData.sections.map((section, index) => (_jsx(Card, { className: "border-2 border-dashed border-gray-200", children: _jsxs(CardContent, { className: "p-4 md:p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h4", { className: "font-medium text-gray-700", children: ["Section ", index + 1] }), _jsx(Button, { onClick: () => removeSection(index), variant: "destructive", size: "sm", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Section Title" }), _jsx(Input, { value: section.sectionTitle, onChange: (e) => handleSectionChange(index, "sectionTitle", e.target.value), placeholder: "Enter section title" }), errors.sections?.[index].sectionTitle && (_jsx("span", { className: "text-red-500", children: errors.sections?.[index].sectionTitle }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Section Content" }), _jsx("div", { className: "border-0 rounded-xl outline-[1px] bg-gray-50", children: _jsx(SimpleEditor, { setNewPostRichText: (string) => handleSectionChange(index, "content", string), initialContent: section.content }) }), errors.sections?.[index].content && (_jsx("span", { className: "text-red-500", children: errors.sections?.[index].content }))] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium mb-2 block", children: "Section Image" }), _jsxs("div", { className: "space-y-4 ", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: () => sectionImageRefs.current[index]?.click(), className: "w-full sm:w-auto", children: [_jsx(ImageIcon, { className: "w-4 h-4 mr-2" }), "Upload Image"] }), _jsx("input", { ref: (el) => {
                                                                        sectionImageRefs.current[index] = el;
                                                                    }, type: "file", accept: "image/*", onChange: (e) => handleSectionImageUpload(index, e), className: "hidden" }), errors.sections?.[index].image && (_jsx("span", { className: "text-red-500", children: errors.sections?.[index].image })), section.image && (_jsx("div", { className: "relative", children: _jsx("img", { src: getImageUrl(index, section.image) ||
                                                                            "/placeholder.svg", alt: section.sectionTitle || `Section ${index + 1}`, className: "w-full max-w-sm rounded-lg shadow-md" }) }))] })] })] }) }, index)))] }), _jsxs("div", { className: "flex gap-2 mt-8 sm:hidden", children: [_jsxs(Button, { onClick: handleSave, disabled: isLoading, className: "flex-1", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), isLoading ? "Saving..." : "Save"] }), _jsxs(Button, { onClick: onCancel, variant: "outline", className: "flex-1 bg-transparent", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Cancel"] })] })] }) })] }) }));
}

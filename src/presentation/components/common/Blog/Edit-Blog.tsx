import type React from "react";

import { useState, useRef } from "react";
import { Save, Plus, Trash2, Upload, ImageIcon, ArrowLeft } from "lucide-react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import Input from "../../Input";
import { Textarea } from "../../../../components/ui/textarea";
import type { BlogPost, BlogSection } from "../../../../shared/types/global";
import toast from "react-hot-toast";
import { userService } from "../../../../services/UserService";

interface BlogEditProps {
  blogPost: BlogPost;
  onSave: () => void;
  onCancel: () => void;
}

type NewImages = {
  image?: File;
  sectionImages: Record<number, File>;
};

export default function BlogEdit({
  blogPost,
  onSave,
  onCancel,
}: BlogEditProps) {
  //   const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState<BlogPost>(blogPost);
  const [isLoading, setIsLoading] = useState(false);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const sectionImageRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newImages, setNewImages] = useState<NewImages>({
    sectionImages: {},
  });
  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    introduction?: string;
    image?: string;
    sectionlength?: string;
    sections?: {
      sectionTitle?: string;
      content?: string;
      image?: string;
    }[];
  }>({});

  const handleInputChange = (field: keyof BlogPost, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (
    index: number,
    field: keyof BlogSection,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      ),
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

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleMainImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImages((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSectionImageUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const getMainImageUrl = (originalImage: string) => {
    const newFile = newImages.image;

    if (newFile) {
      return URL.createObjectURL(newFile);
    }

    if (originalImage) {
      return `${import.meta.env.VITE_IMG_URL}${originalImage}`;
    }
  };

  const getImageUrl = (index: number, originalImage?: string) => {
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
    const newErrors: typeof errors = {};

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

    const sectionErrors: {
      sectionTitle?: string;
      content?: string;
      image?: string;
    }[] = [];

    formData.sections.forEach((section, index) => {
      const secError: {
        sectionTitle?: string;
        content?: string;
        image?: string;
      } = {};

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
      return 
    }
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "sections") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });
    console.log(newImages);
    data.append("mainImage", newImages.image as File);
    Object.entries(newImages.sectionImages).forEach(([key, file]) =>
      data.append(key, file as File)
    );
    try {
      const response = await userService.editBlog(formData._id, data);
      if (response.status === 200) {
        onSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 sm:flex-none bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <Card className="bg-white">
          <CardContent className="p-4 md:p-8">
            {/* Blog Title */}
            <div className="mb-6">
              <label htmlFor="title" className="text-sm font-medium mb-2 block">
                Blog Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter your blog title"
                className="text-lg md:text-xl font-semibold"
              />
              {errors.title && (
                <span className="text-red-500">{errors.title}</span>
              )}
            </div>

            {/* Author */}
            <div className="mb-6">
              <label
                htmlFor="author"
                className="text-sm font-medium mb-2 block"
              >
                Author
              </label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Enter author name"
              />
              {errors.author && (
                <span className="text-red-500">{errors.author}</span>
              )}
            </div>

            {/* Introduction */}
            <div className="mb-6">
              <label
                htmlFor="introduction"
                className="text-sm font-medium mb-2 block"
              >
                Introduction
              </label>
              <Textarea
                id="introduction"
                value={formData.introduction}
                onChange={(e) =>
                  handleInputChange("introduction", e.target.value)
                }
                placeholder="Write your blog introduction..."
                className="min-h-[100px] resize-none"
              />
              {errors.introduction && (
                <span className="text-red-500">{errors.introduction}</span>
              )}
            </div>

            {/* Main Image */}
            <div className="mb-8">
              <label className="text-sm font-medium mb-2 block">
                Featured Image
              </label>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => mainImageRef.current?.click()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="hidden"
                />
                {errors.image && (
                  <span className="text-red-500">{errors.image}</span>
                )}
                {formData.image && (
                  <div className="relative">
                    <img
                      src={
                        getMainImageUrl(formData.image) || "/placeholder.svg"
                      }
                      alt="Featured"
                      className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    />
                    {/* <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button> */}
                  </div>
                )}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {errors.sectionlength && (
                <span className="text-red-500">{errors.sectionlength}</span>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold">Blog Sections</h3>
                <Button
                  onClick={addSection}
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {formData.sections.map((section, index) => (
                <Card
                  key={index}
                  className="border-2 border-dashed border-gray-200"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">
                        Section {index + 1}
                      </h4>
                      <Button
                        onClick={() => removeSection(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Section Title */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">
                        Section Title
                      </label>
                      <Input
                        value={section.sectionTitle}
                        onChange={(e) =>
                          handleSectionChange(
                            index,
                            "sectionTitle",
                            e.target.value
                          )
                        }
                        placeholder="Enter section title"
                      />
                      {errors.sections?.[index].sectionTitle && (
                        <span className="text-red-500">
                          {errors.sections?.[index].sectionTitle}
                        </span>
                      )}
                    </div>

                    {/* Section Content */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">
                        Section Content
                      </label>
                      <Textarea
                        value={section.content}
                        onChange={(e) =>
                          handleSectionChange(index, "content", e.target.value)
                        }
                        placeholder="Write your section content..."
                        className="min-h-[120px] resize-none"
                      />
                      {errors.sections?.[index].content && (
                        <span className="text-red-500">
                          {errors.sections?.[index].content}
                        </span>
                      )}
                    </div>

                    {/* Section Image */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Section Image
                      </label>
                      <div className="space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            sectionImageRefs.current[index]?.click()
                          }
                          className="w-full sm:w-auto"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          ref={(el) => {
                            sectionImageRefs.current[index] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSectionImageUpload(index, e)}
                          className="hidden"
                        />
                        {errors.sections?.[index].image && (
                        <span className="text-red-500">
                          {errors.sections?.[index].image}
                        </span>
                      )}
                        {section.image && (
                          <div className="relative">
                            <img
                              src={
                                getImageUrl(index, section.image) ||
                                "/placeholder.svg"
                              }
                              alt={
                                section.sectionTitle || `Section ${index + 1}`
                              }
                              className="w-full max-w-sm rounded-lg shadow-md"
                            />
                            {/* <Button */}
                            {/* type="button" */}
                            {/* // variant="destructive" */}
                            {/* // size="sm" */}
                            {/* // onClick={() => */}
                            {/* handleSectionChange(index, "image", undefined) */}
                            {/* // } */}
                            {/* // className="absolute top-2 right-2" */}
                            {/* > */}
                            {/* <X className="w-4 h-4" /> */}
                            {/* </Button> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Save/Cancel Buttons - Mobile */}
            <div className="flex gap-2 mt-8 sm:hidden">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

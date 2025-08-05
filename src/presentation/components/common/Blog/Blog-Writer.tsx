"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Plus, Upload, X, Eye, Save, Type, List } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import Input from "../../Input";
import { Textarea } from "../../../../components/ui/textarea";

interface BlogSection {
  sectionTitle: string;
  content: string;
  image?: File | string;
}

interface BlogDTO {
  userId: string;
  title: string;
  author: string;
  introduction: string;
  sections: BlogSection[];
  image: File | string;
}

interface BlogWritterProps {
  open: boolean;
  userId: string;
  submitData: (formData: FormData) => void;
}

export default function BlogWriter({
  open,
  userId,
  submitData,
}: BlogWritterProps) {
  const [blogPost, setBlogPost] = useState<BlogDTO>({
    userId: userId,
    title: "",
    author: "",
    introduction: "",
    sections: [],
    image: "",
  });
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const coverImageRef = useRef<HTMLInputElement | null>(null);
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

  const addNewSection = () => {
    const newSection: BlogSection = {
      sectionTitle: "",
      content: "",
      image: undefined,
    };
    setBlogPost((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (
    selectedIndex: number,
    field: keyof BlogSection,
    value: string | File
  ) => {
    setBlogPost((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === selectedIndex ? { ...section, [field]: value } : section
      ),
    }));
  };

  const removeSection = (selectedIndex: number) => {
    setBlogPost((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== selectedIndex),
    }));
  };

  const handleImageUpload = (
    selectedIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the File object directly instead of converting to string
      updateSection(selectedIndex, "image", file);
    }
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  const generateTableOfContents = () => {
    return blogPost.sections.filter(
      (section) => section.sectionTitle.trim() !== ""
    );
  };

  const validate = () => {
    const newErrors: typeof errors = {};

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

    const sectionErrors: {
      sectionTitle?: string;
      content?: string;
      image?: string;
    }[] = [];

    blogPost.sections.forEach((section, index) => {
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

  const saveBlog = () => {
    console.log("Saving blog post:", blogPost);

    const newErrors = validate();

    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors)
      return
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
      const sec: object = {
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
  const getImageUrl = (image: File | string | undefined) => {
    if (!image) return "/placeholder.svg";
    if (typeof image === "string") return image;
    return URL.createObjectURL(image);
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Preview Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Blog Preview</h1>
            <div className="flex gap-2">
              <Button onClick={() => setIsPreview(false)} variant="outline">
                <Type className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={saveBlog}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Blog
              </Button>
            </div>
          </div>
          {/* Preview Content */}
          <Card className="bg-white">
            <CardContent className="p-8">
              {/* Blog Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  {blogPost.title || "Your Blog Title"}
                </h1>
                {blogPost.introduction && (
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    {blogPost.introduction}
                  </p>
                )}
                {blogPost.image && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(blogPost.image) || "/placeholder.svg"}
                      alt={blogPost.title}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
              {/* Table of Contents */}
              {generateTableOfContents().length > 0 && (
                <div className="mb-8 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h3 className="font-bold text-orange-800 mb-3">
                    Table of Contents{" "}
                    <Badge variant="secondary" className="ml-2">
                      Show
                    </Badge>
                  </h3>
                  <ul className="space-y-1">
                    {generateTableOfContents().map((section, index) => (
                      <li key={index}>
                        <a
                          href={`#${index}`}
                          className="text-blue-600 hover:underline"
                        >
                          {section.sectionTitle}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Blog Sections */}
              {blogPost.sections.map((section, index) => (
                <div key={index} id={index.toString()} className="mb-8">
                  {section.sectionTitle && (
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                      {section.sectionTitle}
                    </h2>
                  )}
                  {section.content && (
                    <div className="prose max-w-none mb-4">
                      {section.content.split("\n").map((paragraph, index) => (
                        <p
                          key={index}
                          className="mb-4 text-gray-700 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                  {section.image && (
                    <div className="mb-4">
                      <img
                        src={getImageUrl(section.image) || "/placeholder.svg"}
                        alt={section.sectionTitle}
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Blog Post</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsPreview(true)} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={saveBlog}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
        {/* Main Blog Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Type className="w-5 h-5 mr-2" />
              Blog Header
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Blog Headline *
              </label>
              <Input
                placeholder="Enter your blog headline..."
                value={blogPost.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBlogPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className="text-lg"
              />
              {errors.title && (
                <span className="text-red-500">{errors.title}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Author Name
                </label>
                <Input
                  placeholder="Your name"
                  value={blogPost.author}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBlogPost((prev) => ({ ...prev, author: e.target.value }))
                  }
                />
                {errors.author && (
                  <span className="text-red-500">{errors.author}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Introduction
              </label>
              <Textarea
                placeholder="Write a brief introduction to your blog post..."
                value={blogPost.introduction}
                onChange={(e) =>
                  setBlogPost((prev) => ({
                    ...prev,
                    introduction: e.target.value,
                  }))
                }
                rows={3}
              />
              {errors.introduction && (
                <span className="text-red-500">{errors.introduction}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBlogPost((prev) => ({
                        ...prev,
                        image: file,
                      }));
                    }
                  }}
                  ref={coverImageRef}
                  className="hidden"
                />
                {errors.image && (
                  <span className="text-red-500">{errors.image}</span>
                )}
                <Button
                  onClick={() => coverImageRef.current?.click()}
                  variant="outline"
                  className="flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                {blogPost.image && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Image uploaded
                  </Badge>
                )}
                {blogPost.image && (
                  <div className="mt-4">
                    <img
                      src={getImageUrl(blogPost.image) || "/placeholder.svg"}
                      alt="Cover preview"
                      className="max-w-xs rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
            {errors.sectionlength && (
              <span className="text-red-500">{errors.sectionlength}</span>
            )}
          </CardContent>
        </Card>
        {/* Table of Contents Preview */}
        {generateTableOfContents().length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <List className="w-5 h-5 mr-2" />
                Table of Contents Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                <h4 className="font-semibold text-orange-800 mb-2">
                  Table of Contents
                </h4>
                <ul className="space-y-1">
                  {generateTableOfContents().map((section, index) => (
                    <li key={index} className="text-blue-600">
                      {index + 1}. {section.sectionTitle}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Blog Sections */}
        <div className="space-y-6">
          {blogPost.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Section {index + 1}</CardTitle>
                  <Button
                    onClick={() => removeSection(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section Title
                  </label>
                  <Input
                    placeholder="Enter section title..."
                    value={section.sectionTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSection(index, "sectionTitle", e.target.value)
                    }
                  />
                  {errors.sections?.[index]?.sectionTitle && (
                    <span className="text-red-500">
                      {errors.sections[index].sectionTitle}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Content
                  </label>
                  <Textarea
                    placeholder="Write your content here..."
                    value={section.content}
                    onChange={(e) =>
                      updateSection(index, "content", e.target.value)
                    }
                    rows={6}
                  />
                  {errors.sections?.[index]?.content && (
                    <span className="text-red-500">
                      {errors.sections[index].content}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Section Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      ref={(el) => {
                        fileInputRefs.current[index] = el;
                      }}
                      className="hidden"
                    />
                    {errors.sections?.[index]?.image && (
                      <span className="text-red-500">
                        {errors.sections[index].image}
                      </span>
                    )}
                    <Button
                      onClick={() => fileInputRefs.current[index]?.click()}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    {section.image && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Image uploaded
                      </Badge>
                    )}
                  </div>
                  {section.image && (
                    <div className="mt-4">
                      <img
                        src={getImageUrl(section.image) || "/placeholder.svg"}
                        alt="Section preview"
                        className="max-w-xs rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Add New Section Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={addNewSection}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Section
          </Button>
        </div>
      </div>
    </div>
  );
}

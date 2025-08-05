import { Button } from "../../ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Type } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import BlogEdit from "./Edit-Blog";
import type { BlogPost } from "../../../../shared/types/global";
import { useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../../../services/UserService";
import ConfirmModal from "../../ReusableComponents/ConfirmModal";

interface BlogReadProps {
  blogPost: BlogPost;
  onBack: () => void;
}

export default function BlogRead({ blogPost, onBack }: BlogReadProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(false);

  const deleteBlog = async (id: string) => {
    try {
      const response = await userService.deleteBlog(id);
      if (response.status === 200) {
        toast.success("Blog deleted");
        onBack();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // 🔁 Toggle between blog preview and edit page
  if (editBlog) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <BlogEdit
            blogPost={blogPost}
            onSave={() => {
              setEditBlog(false);
              onBack(); // or refetch updated blog
            }}
            onCancel={() => setEditBlog(false)}
          />
        </div>
      </div>
    );
  }

  // 📰 Blog preview
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Preview</h1>
          <div className="flex gap-2">
            {user?._id === blogPost.userId && (
              <>
                <Button onClick={() => setEditBlog(true)} variant="outline">
                  <Type className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => setIsOpen(true)} variant="outline">
                  <Type className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button onClick={onBack} variant="outline">
              <Type className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <Card className="bg-white shadow-md">
          <CardContent className="p-8">
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
                    src={`${import.meta.env.VITE_IMG_URL}${blogPost.image}`}
                    alt={blogPost.title}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {blogPost.sections.map((section, index) => (
              <div key={index} id={index.toString()} className="mb-8">
                {section.sectionTitle && (
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">
                    {section.sectionTitle}
                  </h2>
                )}
                {section.content && (
                  <div className="prose max-w-none mb-4">
                    {section.content.split("\n").map((paragraph, idx) => (
                      <p
                        key={idx}
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
                      src={`${import.meta.env.VITE_IMG_URL}${section.image}`}
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

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => deleteBlog(blogPost._id)}
        title="Delete Blog"
        message="Do you want to delete this Blog?"
      />
    </div>
  );
}

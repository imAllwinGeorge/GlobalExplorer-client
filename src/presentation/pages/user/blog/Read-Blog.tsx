import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import BlogEdit from "../../../components/common/Blog/Edit-Blog";
import type { BlogPost } from "../../../../shared/types/global";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../../../services/UserService";
import ConfirmModal from "../../../components/sharedElements/ConfirmModal";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate, useParams } from "react-router-dom";
import { HttpStatusCode } from "../../../../shared/constants/constants";

export default function BlogRead() {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(false);
  const navigate = useNavigate();
  console.log(user, id);
  const deleteBlog = async (id: string) => {
    try {
      const response = await userService.deleteBlog(id);
      if (response.status === HttpStatusCode.OK) {
        toast.success("Blog deleted");
        // onBack();
        navigate(-1);
      }
    } catch (error) {
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
    console.log("Use effect triggered: ",id);
    const fetchBlog = async () => {
      try {
        const response = await userService.getBlog(id as string);
        console.log(response);
        if (response.status === HttpStatusCode.OK) {
          setBlogPost(response.data.blog);
          editor.commands.setContent(
            (response.data.blog as BlogPost).introduction
          );
        }
      } catch (error) {
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

  function ReadOnlyEditor({ html }: { html: string }) {
    const editor = useEditor({
      extensions: [StarterKit],
      content: html,
      editable: false,
    });
    return <EditorContent editor={editor} />;
  }

  // 🔁 Toggle between blog preview and edit page
  if (editBlog) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          {blogPost && (
            <BlogEdit
              blogPost={blogPost}
              onSave={() => {
                setEditBlog(false);
                // onBack(); // or refetch updated blog
              }}
              onCancel={() => setEditBlog(false)}
            />
          )}
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
            {user?._id === blogPost?.userId && (
              <>
                <Button onClick={() => setEditBlog(true)} variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => setIsOpen(true)} variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {blogPost && (
          <Card className="bg-white shadow-md">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  {blogPost.title || "Your Blog Title"}
                </h1>
                {blogPost.introduction && <EditorContent editor={editor} />}
                {blogPost.image && (
                  <div className="mb-4">
                    <img
                      src={`${blogPost.image}`}
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
                      <ReadOnlyEditor html={section.content} />
                    </div>
                  )}
                  {section.image && (
                    <div className="mb-4">
                      <img
                        src={`${section.image}`}
                        alt={section.sectionTitle}
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => blogPost && deleteBlog(blogPost._id)}
        title="Delete Blog"
        message="Do you want to delete this Blog?"
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import BlogWriter from "../../components/common/Blog/Blog-Writer";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import BlogCard from "../../components/common/Blog/BlogCard";
import type { BlogPost } from "../../../shared/types/global";
import { userService } from "../../../services/UserService";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../../components/common/Pagination";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../../../shared/constants/localStoragekeys";
import BlogRead from "../../components/common/Blog/Read-Blog";

const Blogs = () => {
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [triggerFetch, setTriggerFetch] = useState(true)
  const [selectedBlog, setSelectedBlog] = useLocalStorage<BlogPost | null>(
    LOCAL_STORAGE_KEYS.SELECTED_BLOG,
    null
  );

  const handleSave = async (formData: FormData) => {
    try {
      const response = await userService.createBlog(formData);
      if (response.status === 201) {
        console.log(response);
        setOpenModal(false);
        setTriggerFetch(prev => !prev)
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await userService.getBlogs(page, 9);
        if (response.status === 200) {
          setBlogs(response.data.blogs as BlogPost[]);
          setTotalPages(response.data.totalPages as number);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchBlogs();
  }, [page, triggerFetch]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Travel Blogs
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Discover amazing travel stories and adventures
              </p>
            </div>
            {user && (
              <Button
                onClick={() => setOpenModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
              >
                <PlusCircle className="w-5 h-5" />
                Write Blog
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Blog Grid */}
        {blogs && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {blogs.map((blog, index) => (
              <BlogCard
                key={`${blog._id}-${index}`}
                blog={blog}
                onReadMore={() => setSelectedBlog(blog)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Blog Writer Modal - Full Page Overlay */}
      {openModal && (
        <div className="fixed inset-0 z-[999] bg-white overflow-auto">
          <BlogWriter
            open={openModal}
            userId={user?._id || ""}
            submitData={handleSave}
            // onClose={() => setOpenModal(false)}
          />
        </div>
      )}

      {selectedBlog && (
        <div className="fixed inset-0 z-[999] bg-white overflow-auto">
          <BlogRead
            blogPost={selectedBlog}
            onBack={() => setSelectedBlog(null)}
          />
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      />
    </div>
  );
};

export default Blogs;

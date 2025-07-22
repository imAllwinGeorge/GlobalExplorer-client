// import { useState } from "react"
// import { Search, Grid, List } from "lucide-react"
// import Input from "../../Input"
// import { Button } from "../../ui/button"
// import BlogCard from "./BlogCard"
// import type { BlogPost } from "../../../../shared/types/global"

// interface BlogListProps {
//   blogs: BlogPost[]
//   onBlogClick?: (blog: BlogPost) => void
//   title?: string
// }

// const BlogList = ({ blogs, onBlogClick, title = "Latest Blog Posts" }: BlogListProps) => {
//     const [searchTerm, setSearchTerm] = useState("")
// //   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

// //   // Get all unique categories
// //   const allCategories = Array.from(new Set(blogs.flatMap((blog) => blog.categories.map((cat) => cat.name))))

// //   // Filter blogs based on search and category
// //   const filteredBlogs = blogs.filter((blog) => {
// //     const matchesSearch =
// //       blog.title.toLowerCase().includes(searchTerm.toLowerCase())
// //     const matchesCategory = !selectedCategory || blog.categories.some((cat) => cat.name === selectedCategory)
// //     return matchesSearch && matchesCategory
// //   })
//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{title}</h1>

//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search blogs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
//               <Grid className="w-4 h-4" />
//             </Button>
//             <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
//               <List className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Category Filter */}
//         {/* <div className="flex flex-wrap gap-2 mb-6">
//           <Button
//             variant={selectedCategory === null ? "default" : "outline"}
//             size="sm"
//             onClick={() => setSelectedCategory(null)}
//           >
//             All Categories
//           </Button>
//           {allCategories.map((category) => (
//             <Button
//               key={category}
//               variant={selectedCategory === category ? "default" : "outline"}
//               size="sm"
//               onClick={() => setSelectedCategory(category)}
//             >
//               {category}
//             </Button>
//           ))}
//         </div> */}
//       </div>

//       {/* Results Count */}
//       {/* <div className="mb-6">
//         <p className="text-gray-600">
//           Showing {filteredBlogs.length} of {blogs.length} blog posts
//         </p>
//       </div> */}

//       {/* Blog Grid */}
//       <div
//         className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
//       >
//         {blogs.map((blog) => (
//           <BlogCard
//             key={blog._id}
//             blog={blog}
//             onReadMore={onBlogClick}
//             className={viewMode === "list" ? "max-w-none" : ""}
//           />
//         ))}
//       </div>

//       {/* No Results */}
//       {blogs.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
//           <Button
//             variant="outline"
//             onClick={() => {
//               setSearchTerm("")
//             //   setSelectedCategory(null)
//             }}
//             className="mt-4"
//           >
//             Clear Filters
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default BlogList
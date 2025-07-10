import { easeOut, motion } from "framer-motion"
import { Eye, Heart, ChevronRight, Calendar } from "lucide-react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../ui/button"
import type { BlogPost } from "../../../../shared/types/global"



interface BlogCardProps {
  blog: BlogPost
  onReadMore?: (blog: BlogPost) => void
  className?: string
}

export default function BlogCard({ blog, onReadMore, className = "" }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: easeOut },
    },
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: easeOut },
    },
  }

  return (
     <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`w-full max-w-sm mx-auto sm:max-w-none ${className}`}
    >
      <Card className="overflow-hidden border-0 shadow-lg p-0 hover:shadow-xl transition-shadow duration-300 bg-white h-full">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Featured Image */}
          <div className="relative overflow-hidden">
            <motion.div variants={imageVariants} className="relative">
              <img
                src={`${import.meta.env.VITE_IMG_URL}${blog.image}` || "/placeholder.svg?height=300&width=500"}
                alt={blog.title}
                className="w-full h-68 sm:h-76 md:h-84 object-cover cursor-pointer"
                onClick={() => onReadMore?.(blog)}
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {/* Stats overlay */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col sm:flex-row gap-1 sm:gap-2">
                <Badge className="bg-black/70 text-white text-xs flex items-center justify-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {formatNumber(blog.views || 0)}
                </Badge>
                <Badge className="bg-black/70 text-white text-xs flex items-center justify-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {formatNumber(blog.likes?.length || 0)}
                </Badge>
              </div>

              {/* Read time badge */}
              {/* <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <Badge className="bg-blue-600 text-white text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {calculateReadTime()} min
                </Badge>
              </div> */}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
            {/* Title */}
            <motion.h3
              className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => onReadMore?.(blog)}
            >
              {blog.title}
            </motion.h3>

            {/* Introduction/Content */}
            <motion.p
              className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3 flex-grow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {blog.introduction || blog.sections?.[0]?.content?.substring(0, 150) + "..." || "No content available"}
            </motion.p>

            {/* Sections Preview */}
            {blog.sections && blog.sections.length > 0 && (
              <motion.div
                className="mb-3 sm:mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs text-gray-500 mb-2">
                  {blog.sections.length} section{blog.sections.length !== 1 ? "s" : ""}:
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {blog.sections
                    .filter((section) => section.sectionTitle?.trim())
                    .slice(0, 2)
                    .map((section, index) => (
                      <Badge key={index} variant="outline" className="text-xs truncate max-w-[100px] sm:max-w-[120px]">
                        {section.sectionTitle}
                      </Badge>
                    ))}
                  {blog.sections.filter((s) => s.sectionTitle?.trim()).length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{blog.sections.filter((s) => s.sectionTitle?.trim()).length - 2}
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}

            {/* Meta Information */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-1 sm:gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">By {blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </motion.div>

            {/* Tags - only show if they exist */}
            {/* {blog.tags && blog.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {blog.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{blog.tags.length - 3} more
                  </Badge>
                )}
              </motion.div>
            )} */}

            {/* Read More Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-auto"
            >
              <Button
                onClick={() => onReadMore?.(blog)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base transition-colors duration-200"
              >
                READ MORE
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

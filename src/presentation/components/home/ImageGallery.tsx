import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

type ImageGallerProps = {
  images: {
    image: string
    title: string
    _id: string
    url: string
  }[]
}

const ImageGallery = ({ images }: ImageGallerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const getVisibleImages = () => {
    const visible = []
    for (let i = 0; i < 5; i++) {
      visible.push(images[(currentIndex + i) % images.length])
    }
    return visible
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-7xl w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.6 },
            },
          }}
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="text-lg text-black text-center mb-12"
          >
            Image Gallery
          </motion.h1>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-80 flex items-center justify-center"
          >
            <div className="relative w-full flex items-center justify-center px-8">
              {getVisibleImages().map((item, index) => {
                const offset = index - 2
                const isCenter = index === 2

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="absolute"
                    style={{
                      transform: `translateX(${offset * 80}px) translateY(${Math.abs(offset) * 20}px) scale(${isCenter ? 1 : 0.85})`,
                      zIndex: 10 - Math.abs(offset),
                    }}
                  >
                    <motion.div
                      className="relative cursor-pointer group"
                      whileHover={{ scale: isCenter ? 1.05 : 0.9 }}
                      onClick={() => {
                        if (isCenter) {
                          window.location.href = item.url
                        }
                      }}
                    >
                      <img
                        className="w-48 h-64 object-cover rounded-2xl shadow-xl"
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-2xl duration-300 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-4 text-white w-full">
                          <h3 className="font-semibold text-base">{item.title}</h3>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-black" />
            </button>
            <div className="flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-black" : "bg-gray-300"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGallery

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type ImageGallerProps = {
  images: {
    image: string;
    title: string;
    _id: string;
    url: string;
  }[];
};
const ImageGallery = ({ images }: ImageGallerProps) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen ">
      <div className="max-2-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
              transition: {
                duration: 0.6,
              },
            },
          }}
        >
          <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{ duration: 0.6 }}
            className="text-lg text-black max-w-2xl mx-auto"
          >
            Image Gallery
          </motion.h1>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="grid grid-cols-1 sm:grid-cos-2 lg:grid-cols-3 gap-6"
      >
        {images.map((item) => {
          console.log(item.url)
          return (
            <motion.div
              className="relative cursor-pointer "
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate(item.url)}
            >
              <img
                className="w-full h-64 object-cover rounded-lg"
                src={item.image}
                alt={item.title}
              />
              <div className="absolute inset-0 group-hover:bg-black/60 duration-200 flex items-end">
                <div className="p-4 text-white translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duratiion-200">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ImageGallery;

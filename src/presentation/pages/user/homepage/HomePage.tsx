import { useEffect } from "react";
import toast from "react-hot-toast";
// import PrivateHeader from "../../../components/mainComponents/PrivateHeader";


import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "../../../components/ui/button";
import { userService } from "../../../../services/UserService";

const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] as const } },
}

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}


const HomePage = () => {
  
   
  
    useEffect(() => {
      const fetchUser = async (id: string, role: string) => {
        console.log(id, role)
        try {
          const response = await userService.getUserDetails(id, role);
          console.log(response)
          if(response.status === 200){
            toast.success("success")
          }
        } catch (error) {
          console.log(error);
          if(error instanceof Error){
            toast.error(error.message)
          }
        }
      }
       fetchUser("68408d0750fe22eaac47d496", "role");
    },[])
  return (
    <div>
      {/* <PrivateHeader /> */}
       <section className="w-full py-16 px-10 bg-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Text Section */}
        <motion.div
          className="w-full lg:w-1/2 space-y-6 text-center lg:text-left"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
            variants={textVariant}
          >
            Discover. Book. Explore.fffffkkkkk home page
          </motion.span>

          <motion.h1
            className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900"
            variants={textVariant}
          >
            Unforgettable Tours & Activities Await You
          </motion.h1>

          <motion.p className="text-gray-600 md:text-lg max-w-xl mx-auto lg:mx-0" variants={textVariant}>
            From thrilling adventures to peaceful agro retreats and vibrant cultural tours, Global Explorer connects
            you to authentic travel experiences around the world.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" variants={textVariant}>
            <Button size="lg" className="inline-flex items-center gap-2">
              Explore Activities
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="inline-flex items-center gap-2 bg-transparent">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
        >
          {/* Replace with actual image or illustration */}
          <img
            src="background/DSCF7704_1200-2-585x390.jpg"
            alt="Tour Adventure"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
    </div>
  )
}

export default HomePage
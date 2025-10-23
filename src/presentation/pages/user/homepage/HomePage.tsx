import PrivateHeader from "../../../components/mainComponents/PrivateHeader";

import { userService } from "../../../../services/UserService";
import ImageGallery from "@/presentation/components/home/ImageGallery";
import { useEffect, useState } from "react";
import { HttpStatusCode } from "@/shared/constants/constants";

const HomePage = () => {
  const [images, setImages] = useState();

  useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await userService.getImages();
                console.log(response)
                if(response.status === HttpStatusCode.OK){
                    setImages(response.data.images)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchImages()
    }, [])
  return (
    <div>
      <PrivateHeader />
      {images && <ImageGallery images={images} />}
    </div>
  );
};

export default HomePage;

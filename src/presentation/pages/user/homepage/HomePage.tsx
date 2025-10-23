import PrivateHeader from "../../../components/mainComponents/PrivateHeader";
import { userService } from "../../../../services/UserService";
import { useEffect, useState } from "react";
import { HttpStatusCode } from "../../../../shared/constants/constants";
import ImageGallery from "../../../components/home/ImageGallery";
import type { GalleryImages } from "../../../../shared/types/global";

const HomePage = () => {
  const [images, setImages] = useState<GalleryImages[]>();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await userService.getImages();
        console.log(response);
        if (response.status === HttpStatusCode.OK) {
          setImages(response.data.images as GalleryImages[]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages();
  }, []);
  return (
    <div>
      <PrivateHeader />
      {images && <ImageGallery images={images} />}
    </div>
  );
};

export default HomePage;

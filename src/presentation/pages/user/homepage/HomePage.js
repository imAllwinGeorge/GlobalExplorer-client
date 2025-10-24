import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PrivateHeader from "../../../components/mainComponents/PrivateHeader";
import { userService } from "../../../../services/UserService";
import { useEffect, useState } from "react";
import { HttpStatusCode } from "../../../../shared/constants/constants";
import ImageGallery from "../../../components/home/ImageGallery";
const HomePage = () => {
    const [images, setImages] = useState();
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await userService.getImages();
                console.log(response);
                if (response.status === HttpStatusCode.OK) {
                    setImages(response.data.images);
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchImages();
    }, []);
    return (_jsxs("div", { children: [_jsx(PrivateHeader, {}), images && _jsx(ImageGallery, { images: images })] }));
};
export default HomePage;

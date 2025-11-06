import { PulseLoader } from "react-spinners";

type LoaderProps = {
  isLoading: boolean;
  fullScreen?: boolean;
};
const loaderColor = "#2E5AFB";
const size = 20;
const Loader = ({ isLoading, fullScreen = true }: LoaderProps) => {
  if (!isLoading) return null;
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "fixed inset-0 z-50 bg-white/60 backdrop-blur-sm"
          : "w-full h-full"
      }`}
    >
      <PulseLoader loading={isLoading} color={loaderColor} size={size} />
    </div>
  );
};

export default Loader;

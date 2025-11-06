// // import React from 'react'

// import { cn } from "@/lib/utils";
// import { useEffect, useRef } from "react";

// type VideoProp = {
//   stream: MediaStream;
//   className?: string;
//   isLocal: boolean;
// };


// const VideoCall = ({ stream, className, isLocal }: VideoProp) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     // if(videoRef.current){
//     //     videoRef.current.srcObject = stream
//     // }
//     const el = videoRef.current
//     if (!el) return
//         console.log("📺 stream in video UI:", stream.id, "tracks:", stream.getTracks());

//     el.srcObject = stream
//     return () => {
//       el.srcObject = null
//     }
//   }, [stream]);

//   return (
//     <div>
//       <video
//         ref={videoRef}
//         className={cn(
//           "block w-full h-full rounded-lg bg-black object-cover",
//           className
//         )}
//         autoPlay
//         playsInline
//         muted = {isLocal}
//       />
//     </div>
//   );
// };

// export default VideoCall;


// VideoCall.tsx
import React, { useEffect, useRef } from "react";
import { cn } from "../../../lib/tiptap-utils";

type VideoProp = {
  stream: MediaStream;
  className?: string;
  isLocal: boolean;
};

const VideoCall = ({ stream, className, isLocal }: VideoProp) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
  const el = videoRef.current;
  if (!el) return;

  if (el.srcObject !== stream) {
    el.srcObject = stream;

    el.play().catch(err => {
      if (err.name !== "AbortError") {
        console.error("❌ Video play failed:", err);
      }
    });
  }
}, [stream]);


  return (
    <div className={cn("relative", className)}>
      <video
        ref={videoRef}
        className="block w-full h-full rounded-lg bg-black object-cover"
        autoPlay
        playsInline
        muted={isLocal}
      />
    </div>
  );
};

export default React.memo(VideoCall);
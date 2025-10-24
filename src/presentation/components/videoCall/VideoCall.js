import { jsx as _jsx } from "react/jsx-runtime";
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
import { useEffect, useRef } from "react";
import { cn } from "../../../lib/tiptap-utils";
const VideoCall = ({ stream, className, isLocal }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        const el = videoRef.current;
        if (!el)
            return;
        if (el.srcObject !== stream) {
            el.srcObject = stream;
            el.play().catch(err => {
                if (err.name !== "AbortError") {
                    console.error("❌ Video play failed:", err);
                }
            });
        }
    }, [stream]);
    return (_jsx("div", { className: cn("relative", className), children: _jsx("video", { ref: videoRef, className: "block w-full h-full rounded-lg bg-black object-cover", autoPlay: true, playsInline: true, muted: isLocal }) }));
};
export default VideoCall;

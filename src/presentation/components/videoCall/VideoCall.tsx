// import React from 'react'

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type VideoProp = {
  stream: MediaStream;
  className?: string;
};


const VideoCall = ({ stream, className }: VideoProp) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // if(videoRef.current){
    //     videoRef.current.srcObject = stream
    // }
    const el = videoRef.current
    if (!el) return
    el.srcObject = stream
    return () => {
      el.srcObject = null
    }
  }, [stream]);

  return (
    <div>
      <video
        ref={videoRef}
        className={cn(
          "block w-full h-full rounded-lg bg-black object-cover",
          className
        )}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default VideoCall;

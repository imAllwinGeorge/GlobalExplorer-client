// // import React from 'react'

// import { useSocket } from "@/contexts/SocketContext";
// import VideoCall from "@/presentation/components/videoCall/VideoCall";
// import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
// import { useState } from "react";
// import { useLocation } from "react-router-dom";

// const VideoChat = () => {
//   const socket = useSocket();
//   const location = useLocation();
//   const recieverId = location.state;
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [peerConnection, setPeerConnection] =
//     useState<RTCPeerConnection | null>(null);

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" }, // Example: Google's public STUN server
//       // You can add more STUN servers for redundancy
//       { urls: "stun:stun1.l.google.com:19302" },
//     ],
//   };

//   socket?.on(VIDEO_CALL_EVENT.ICECANDIDATE, async (data) => {
//     const candidate = new RTCIceCandidate(data.candidate);
//     await peerConnection?.addIceCandidate(candidate)
//   })

//   socket?.on(VIDEO_CALL_EVENT.ANSWER, async (data) => {
//     const answer = new RTCSessionDescription(data);
//     await peerConnection?.setRemoteDescription(answer)
//   })

//   socket?.on(VIDEO_CALL_EVENT.OFFER, async (data) => {
//     const offer = new RTCSessionDescription(data);
//     await peerConnection?.setRemoteDescription(offer);
//     const answer = await peerConnection?.createAnswer();
//     await peerConnection?.setLocalDescription(answer);

//     socket.emit(VIDEO_CALL_EVENT.ANSWER,{ sdp: data.sdp, recieverId: recieverId.userId})
//   })

//   const startCall = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream);

//       const pc = new RTCPeerConnection(configuration);
//       setPeerConnection(pc);
//       stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

//       pc.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };
//       console.log(VIDEO_CALL_EVENT.ICECANDIDATE);
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log("ice candidate data sending.......");
//           // send candidate using socket
//           socket?.emit(
//             VIDEO_CALL_EVENT.ICECANDIDATE,
//             {
//               candidate: event.candidate,
//               recieverId: recieverId.userId,
//             },
//             () => {
//               console.log("ice candidate event emitted");
//             }
//           );
//         }
//       };

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       // send offer using socket

//       socket?.emit(
//         VIDEO_CALL_EVENT.OFFER,
//         {
//           type: offer.type,
//           sdp: offer.sdp,
//           recieverId: recieverId,
//         },
//         () => console.log(VIDEO_CALL_EVENT.OFFER)
//       );
//     } catch (error) {
//       console.log("start call function error: ", error);
//     }
//   };
//   return (
//     <div>
//       {localStream && <VideoCall stream={localStream} />}
//       {remoteStream && <VideoCall stream={remoteStream} />}
//       <button onClick={startCall}>call</button>
//     </div>
//   );
// };

// export default VideoChat;
// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "@/contexts/SocketContext";
// import VideoCall from "@/presentation/components/videoCall/VideoCall";
// import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
// import type { RootState } from "@/presentation/store";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const configuration: RTCConfiguration = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//   ],
// };

// const VideoChat = () => {
//   const socket = useSocket();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const location = useLocation();
//   const receiverId = location.state.userId;

//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [inCall, setInCall] = useState(false);
//   const [incomingCall, setIncomingCall] = useState<{ callerId: string } | null>(
//     null
//   );
//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

//   const createPeerConnection = (stream?: MediaStream) => {
//     const pc = new RTCPeerConnection(configuration);

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket?.emit(VIDEO_CALL_EVENT.ICECANDIDATE, {
//           candidate: event.candidate,
//           receiverId,
//         });
//       }
//     };

//     pc.ontrack = (event) => setRemoteStream(event.streams[0]);

//     if (stream)
//       stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//     return pc;
//   };

//   const startCall = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     setLocalStream(stream);

//     const pc = createPeerConnection(stream);
//     peerRef.current = pc;

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     socket?.emit(VIDEO_CALL_EVENT.OFFER, {
//       sdp: offer,
//       callerId: user?._id,
//       calleeId: receiverId,
//     });
//   };

//   //accept

//   const acceptCall = async () => {
//     socket?.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
//       callerId: incomingCall?.callerId,
//       calleeId: user?._id,
//     });

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     setLocalStream(stream);

//     const pc = createPeerConnection(stream);
//     peerRef.current = pc;

//     setInCall(true);
//     setIncomingCall(null);
//   };

//   // rejectCall
//   const rejectCall = () => {
//     socket?.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
//       callerId: incomingCall?.callerId,
//       calleeId: user?._id,
//     });
//     setIncomingCall(null);
//   };

//   // Hangup
//   const endCall = () => {
//     peerRef.current?.close();
//     peerRef.current = null;
//     setLocalStream(null);
//     setRemoteStream(null);
//     setInCall(false);
//     socket?.emit(VIDEO_CALL_EVENT.HANGUP, { peerId: receiverId });
//   };
//   useEffect(() => {
//     if (!socket) return;

//     // Process any candidates that arrived early
//     const processPendingCandidates = async () => {
//       if (
//         pendingCandidates.current.length > 0 &&
//         peerRef.current?.remoteDescription
//       ) {
//         for (const candidate of pendingCandidates.current) {
//           try {
//             await peerRef.current.addIceCandidate(candidate);
//             console.log("Added pending ICE candidate");
//           } catch (e) {
//             console.error("Error adding pending ICE candidate:", e);
//           }
//         }
//         pendingCandidates.current = []; // Clear the queue
//       }
//     };

//     socket.on(VIDEO_CALL_EVENT.OFFER, async (data) => {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream); // Set local stream when answering
//       const pc = createPeerConnection(stream);
//       peerRef.current = pc;

//       await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
//       await processPendingCandidates(); // ✅ Process candidates after setting remote description

//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       socket.emit(VIDEO_CALL_EVENT.ANSWER, {
//         sdp: answer,
//         callerId: data.callerId,
//         calleeId: data.calleeId,
//       });
//     });

//     socket.on(VIDEO_CALL_EVENT.ANSWER, async (data) => {
//       if (peerRef.current && !peerRef.current.remoteDescription) {
//         await peerRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.sdp)
//         );
//         await processPendingCandidates(); // ✅ Process candidates after setting remote description
//       }
//     });

//     socket.on(VIDEO_CALL_EVENT.ICECANDIDATE, async (data) => {
//       const candidate = new RTCIceCandidate(data.candidate);
//       console.log("event triggered.......");
//       // ✅ Improved Check
//       if (peerRef.current?.remoteDescription) {
//         await peerRef.current.addIceCandidate(candidate);
//       } else {
//         pendingCandidates.current.push(candidate);
//         console.log("Queued an incoming ICE candidate");
//       }
//     });
//     //.............

//     socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, (data) => {
//       setIncomingCall({ callerId: data.callerId });
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_ACCEPT, async (data) => {
//       // caller now creates offer
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setLocalStream(stream);

//       const pc = createPeerConnection(stream);
//       peerRef.current = pc;

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       socket.emit(VIDEO_CALL_EVENT.OFFER, {
//         sdp: offer,
//         callerId: user?._id,
//         calleeId: receiverId,
//       });
//       setInCall(true);
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_REJECT, () => {
//       alert("call rejected");
//       setIncomingCall(null);
//     });

//     socket.on(VIDEO_CALL_EVENT.HANGUP, () => {
//       endCall();
//     });

//     return () => {
//       // socket.off(VIDEO_CALL_EVENT.OFFER);
//       // socket.off(VIDEO_CALL_EVENT.ANSWER);
//       // socket.off(VIDEO_CALL_EVENT.ICECANDIDATE);

//       socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
//       socket.off(VIDEO_CALL_EVENT.CALL_ACCEPT);
//       socket.off(VIDEO_CALL_EVENT.CALL_REJECT);
//       socket.off(VIDEO_CALL_EVENT.HANGUP);
//     };
//   }, [socket]);

//   return (
//     <div>
//       {!inCall && <button onClick={startCall}>Start Call</button>}

//       {incomingCall && (
//         <div>
//           <p>Incoming Call...........</p>
//           <button onClick={acceptCall}>Accept</button>
//           <button onClick={rejectCall}>Reject</button>
//         </div>
//       )}
//       {localStream && <VideoCall stream={localStream} />}
//       {inCall && (
//         <>
//           {remoteStream && <VideoCall stream={remoteStream} />}
//           <button onClick={endCall}> Hang UP</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default VideoChat;


import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import VideoCall from "@/presentation/components/videoCall/VideoCall";
import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
import type { RootState } from "@/presentation/store";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const VideoChat = () => {
  const socket = useSocket();
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const receiverId = location.state.userId;
  const navigate = useNavigate();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callerId: string } | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  const createPeerConnection = (stream?: MediaStream) => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit(VIDEO_CALL_EVENT.ICECANDIDATE, {
          candidate: event.candidate,
          receiverId,
        });
      }
    };

    pc.ontrack = (event) => setRemoteStream(event.streams[0]);

    if (stream) stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    return pc;
  };

  const startCall = () => {
    socket?.emit(VIDEO_CALL_EVENT.CALL_REQUEST, {
      callerId: user?._id,
      calleeId: receiverId,
    });
  };

  const acceptCall = async () => {
    if (!incomingCall) return;
    socket?.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
      callerId: incomingCall.callerId,
      calleeId: user?._id,
    });
    // setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket?.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
      callerId: incomingCall.callerId,
      calleeId: user?._id,
    });
    setIncomingCall(null);
  };

  const hangUp = () => {
    peerRef.current?.close();
    peerRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    
    if(localStream){
      localStream.getTracks().forEach((track) => track.stop())
    }
    socket?.emit(VIDEO_CALL_EVENT.CALL_END, {
      to: receiverId,
      from: user?._id,
    });
    console.log("call ended..........")
    navigate("/chat")
  };

  useEffect(() => {
    if (!socket) return;

    const processPendingCandidates = async () => {
      if (pendingCandidates.current.length > 0 && peerRef.current?.remoteDescription) {
        for (const candidate of pendingCandidates.current) {
          await peerRef.current.addIceCandidate(candidate);
        }
        pendingCandidates.current = [];
      }
    };

    // ---- Call Control ----
    socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, (data) => {
      setIncomingCall({ callerId: data.callerId });
      ///addd a incomming call alert...........
      console.log("call request arrived.................")
      toast.success("call request...");
    });

    socket.on(VIDEO_CALL_EVENT.CALL_REJECT, () => {
      alert("Call rejected");
    });

    socket.on(VIDEO_CALL_EVENT.CALL_ACCEPT, async (data) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      const pc = createPeerConnection(stream);
      peerRef.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit(VIDEO_CALL_EVENT.OFFER, {
        sdp: offer,
        callerId: user?._id,
        calleeId: data.calleeId,
      });
    });

    socket.on(VIDEO_CALL_EVENT.CALL_END, () => {
      hangUp();
      alert("Call ended");
    });

    // ---- WebRTC Negotiation ----
    socket.on(VIDEO_CALL_EVENT.OFFER, async (data) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      const pc = createPeerConnection(stream);
      peerRef.current = pc;

      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      await processPendingCandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit(VIDEO_CALL_EVENT.ANSWER, {
        sdp: answer,
        callerId: data.callerId,
        calleeId: data.calleeId,
      });
    });

    socket.on(VIDEO_CALL_EVENT.ANSWER, async (data) => {
      if (peerRef.current && !peerRef.current.remoteDescription) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        await processPendingCandidates();
      }
    });

    socket.on(VIDEO_CALL_EVENT.ICECANDIDATE, async (data) => {
      const candidate = new RTCIceCandidate(data.candidate);
      if (peerRef.current?.remoteDescription) {
        await peerRef.current.addIceCandidate(candidate);
      } else {
        pendingCandidates.current.push(candidate);
      }
    });

    return () => {
      socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
      socket.off(VIDEO_CALL_EVENT.CALL_ACCEPT);
      socket.off(VIDEO_CALL_EVENT.CALL_REJECT);
      socket.off(VIDEO_CALL_EVENT.CALL_END);
      socket.off(VIDEO_CALL_EVENT.OFFER);
      socket.off(VIDEO_CALL_EVENT.ANSWER);
      socket.off(VIDEO_CALL_EVENT.ICECANDIDATE);
      
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    // <div>
    //   {!incomingCall ? (
    //     <button onClick={startCall}>Start Call</button>
    //   ) : (
    //     <div>
    //       <p>Incoming Call...</p>
    //       <button onClick={acceptCall}>Accept</button>
    //       <button onClick={rejectCall}>Reject</button>
    //     </div>
    //   )}
    //   {localStream && <VideoCall stream={localStream} />}
    //   {remoteStream && <VideoCall stream={remoteStream} />}
    //   {(localStream || remoteStream) && <button onClick={hangUp}>Hang Up</button>}
    // </div>

    <div
      className="
        relative min-h-[60vh]
        flex flex-col md:flex-row items-center justify-center
        gap-4 p-4 md:p-6
        bg-background text-foreground
      "
    >
      {!incomingCall ? (
        <button
          onClick={startCall}
          className="
            inline-flex items-center justify-center rounded-md
            bg-primary text-primary-foreground
            px-4 py-2 text-sm font-medium
            hover:bg-primary/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            transition-colors
          "
        >
          Start Call
        </button>
      ) : (
        <div
          className="
            w-full max-w-sm
            rounded-lg border border-border
            bg-card text-card-foreground
            p-4 shadow-sm
            flex items-center justify-between gap-3
          "
        >
          <p className="text-sm font-medium">Incoming Call...</p>
          <div className="flex items-center gap-2">
            <button
              onClick={acceptCall}
              className="
                inline-flex items-center justify-center rounded-md
                bg-primary text-primary-foreground
                px-3 py-2 text-sm font-medium
                hover:bg-primary/90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                transition-colors
              "
            >
              Accept
            </button>
            <button
              onClick={rejectCall}
              className="
                inline-flex items-center justify-center rounded-md
                bg-destructive text-destructive-foreground
                px-3 py-2 text-sm font-medium
                hover:bg-destructive/90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                transition-colors
              "
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {localStream && (
        <VideoCall
          stream={localStream}
          className={`
            ${
              remoteStream
                ? `
                absolute bottom-4 right-4 z-10
                w-28 h-40 md:static md:w-full md:h-[60vh] md:max-w-md
                rounded-md ring-2 ring-background shadow-lg
              `
                : `
                w-full h-[60vh] rounded-lg
              `
            }
            order-2 md:order-1
            overflow-hidden bg-muted
          `}
        />
      )}

      {remoteStream && (
        <VideoCall
          stream={remoteStream}
          className="
            w-full h-[60vh] rounded-lg overflow-hidden bg-muted
            order-1 md:order-2
            md:flex-[2] md:max-w-[70%]
          "
        />
      )}

      {(localStream || remoteStream) && (
        <button
          onClick={hangUp}
          className="
            inline-flex items-center justify-center rounded-md
            bg-destructive text-destructive-foreground
            px-4 py-2 text-sm font-medium
            hover:bg-destructive/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            transition-colors
          "
        >
          Hang Up
        </button>
      )}
    </div>
  );
};

export default VideoChat;


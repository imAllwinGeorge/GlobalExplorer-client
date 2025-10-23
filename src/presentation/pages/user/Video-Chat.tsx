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

//-------------------------------------------------------------------------

// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "@/contexts/SocketContext";
// import VideoCall from "@/presentation/components/videoCall/VideoCall";
// import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
// import type { RootState } from "@/presentation/store";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";

// const configuration: RTCConfiguration = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//   ],
// };

// const VideoChat = () => {
//   const socket = useSocket();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const { receiverId } = useParams();
//   const navigate = useNavigate();

//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [incomingCall, setIncomingCall] = useState<{ callerId: string } | null>(null);
//   const [onCall, setOnCall] = useState(false);

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

//     if (stream) stream.getTracks().forEach((track) => pc.addTrack(track, stream));
//     return pc;
//   };

//   const startCall = () => {
//     socket?.emit(VIDEO_CALL_EVENT.CALL_REQUEST, {
//       callerId: user?._id,
//       calleeId: receiverId,
//     });
//     console.log("called...")
//   };

//   const acceptCall = async () => {
//     if (!incomingCall) return;
//     socket?.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
//       callerId: incomingCall.callerId,
//       calleeId: user?._id,
//     });
//     setIncomingCall(null);
//     setOnCall(true);
//   };

//   const rejectCall = () => {
//     if (!incomingCall) return;
//     socket?.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
//       callerId: incomingCall.callerId,
//       calleeId: user?._id,
//     });
//     setIncomingCall(null);
//   };

//   const hangUp = () => {
//     peerRef.current?.close();
//     peerRef.current = null;
//     setLocalStream(null);
//     setRemoteStream(null);

//     if(localStream){
//       localStream.getTracks().forEach((track) => track.stop())
//     }
//     socket?.emit(VIDEO_CALL_EVENT.CALL_END, {
//       to: receiverId,
//       from: user?._id,
//     });
//     console.log("call ended..........")
//     setOnCall(false)
//     navigate("/chat")
//   };

//   useEffect(() => {
//     if (!socket) return;
//     console.log("video component mounted")
//     startCall();
//     const processPendingCandidates = async () => {
//       if (pendingCandidates.current.length > 0 && peerRef.current?.remoteDescription) {
//         for (const candidate of pendingCandidates.current) {
//           await peerRef.current.addIceCandidate(candidate);
//         }
//         pendingCandidates.current = [];
//       }
//     };

//     // // ---- Call Control ----
//     // socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, (data) => {
//     //   setIncomingCall({ callerId: data.callerId });
//     //   ///addd a incomming call alert...........
//     // });

//     socket.on(VIDEO_CALL_EVENT.CALL_REJECT, () => {
//       alert("Call rejected");
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_ACCEPT, async (data) => {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//       setLocalStream(stream);

//       const pc = createPeerConnection(stream);
//       peerRef.current = pc;

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       socket.emit(VIDEO_CALL_EVENT.OFFER, {
//         sdp: offer,
//         callerId: user?._id,
//         calleeId: data.calleeId,
//       });
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_END, () => {
//       hangUp();
//       alert("Call ended");
//     });

//     // ---- WebRTC Negotiation ----
//     socket.on(VIDEO_CALL_EVENT.OFFER, async (data) => {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//       setLocalStream(stream);

//       const pc = createPeerConnection(stream);
//       peerRef.current = pc;

//       await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
//       await processPendingCandidates();

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
//         await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
//         await processPendingCandidates();
//         setOnCall(true);
//       }
//     });

//     socket.on(VIDEO_CALL_EVENT.ICECANDIDATE, async (data) => {
//       const candidate = new RTCIceCandidate(data.candidate);
//       if (peerRef.current?.remoteDescription) {
//         await peerRef.current.addIceCandidate(candidate);
//       } else {
//         pendingCandidates.current.push(candidate);
//       }
//     });

//     return () => {
//       socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
//       socket.off(VIDEO_CALL_EVENT.CALL_ACCEPT);
//       socket.off(VIDEO_CALL_EVENT.CALL_REJECT);
//       socket.off(VIDEO_CALL_EVENT.CALL_END);
//       socket.off(VIDEO_CALL_EVENT.OFFER);
//       socket.off(VIDEO_CALL_EVENT.ANSWER);
//       socket.off(VIDEO_CALL_EVENT.ICECANDIDATE);

//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [socket]);

//   return (
//     // <div>
//     //   {!incomingCall ? (
//     //     <button onClick={startCall}>Start Call</button>
//     //   ) : (
//     //     <div>
//     //       <p>Incoming Call...</p>
//     //       <button onClick={acceptCall}>Accept</button>
//     //       <button onClick={rejectCall}>Reject</button>
//     //     </div>
//     //   )}
//     //   {localStream && <VideoCall stream={localStream} />}
//     //   {remoteStream && <VideoCall stream={remoteStream} />}
//     //   {(localStream || remoteStream) && <button onClick={hangUp}>Hang Up</button>}
//     // </div>

//     <div
//       className="
//         relative min-h-[60vh]
//         flex flex-col md:flex-row items-center justify-center
//         gap-4 p-4 md:p-6
//         bg-background text-foreground
//       "
//     >
//       {!incomingCall && !onCall ? (
//         <button
//           onClick={startCall}
//           className="
//             inline-flex items-center justify-center rounded-md
//             bg-primary text-primary-foreground
//             px-4 py-2 text-sm font-medium
//             hover:bg-primary/90
//             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
//             transition-colors
//           "
//         >
//           Start Call
//         </button>
//       ) : incomingCall && !onCall ? (
//         <div
//           className="
//             w-full max-w-sm
//             rounded-lg border border-border
//             bg-card text-card-foreground
//             p-4 shadow-sm
//             flex items-center justify-between gap-3
//           "
//         >
//           <p className="text-sm font-medium">Incoming Call...</p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={acceptCall}
//               className="
//                 inline-flex items-center justify-center rounded-md
//                 bg-primary text-primary-foreground
//                 px-3 py-2 text-sm font-medium
//                 hover:bg-primary/90
//                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
//                 transition-colors
//               "
//             >
//               Accept
//             </button>
//             <button
//               onClick={rejectCall}
//               className="
//                 inline-flex items-center justify-center rounded-md
//                 bg-destructive text-destructive-foreground
//                 px-3 py-2 text-sm font-medium
//                 hover:bg-destructive/90
//                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
//                 transition-colors
//               "
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ): ""}

//       {localStream && (
//         <VideoCall
//           stream={localStream}
//           className={`
//             ${
//               remoteStream
//                 ? `
//                 absolute bottom-4 right-4 z-10
//                 w-28 h-40 md:static md:w-full md:h-[60vh] md:max-w-md
//                 rounded-md ring-2 ring-background shadow-lg
//               `
//                 : `
//                 w-full h-[60vh] rounded-lg
//               `
//             }
//             order-2 md:order-1
//             overflow-hidden bg-muted
//           `}
//         />
//       )}

//       {remoteStream && (
//         <VideoCall
//           stream={remoteStream}
//           className="
//             w-full h-[60vh] rounded-lg overflow-hidden bg-muted
//             order-1 md:order-2
//             md:flex-[2] md:max-w-[70%]
//           "
//         />
//       )}

//       {(localStream || remoteStream) && (
//         <button
//           onClick={hangUp}
//           className="
//             inline-flex items-center justify-center rounded-md
//             bg-destructive text-destructive-foreground
//             px-4 py-2 text-sm font-medium
//             hover:bg-destructive/90
//             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
//             transition-colors
//           "
//         >
//           Hang Up
//         </button>
//       )}
//     </div>
//   );
// };

// export default VideoChat;
//------------------------------------------
// // VideoChat.tsx
// import { useEffect, useRef, useState } from "react";
// import { useSocket } from "@/contexts/SocketContext";
// import VideoCall from "@/presentation/components/videoCall/VideoCall";
// import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
// import type { RootState } from "@/presentation/store";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { eventBus } from "@/lib/eventBusInstance";
// import type {
//   AnswerPayload,
//   CallAcceptPayload,
//   CallEndPayload,
//   CallRejectPayload,
//   CallRequestPayload,
//   IceCandidatePayload,
//   OfferPayload,
// } from "@/shared/types/videoCallEvent";

// const configuration: RTCConfiguration = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//   ],
// };

// type LocationState = {
//   incomingCall?: CallRequestPayload;
// };

// const VideoChat = () => {
//   const socket = useSocket();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const { receiverId } = useParams<{ receiverId?: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const locState = location.state as LocationState | null;

//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [incomingCall, setIncomingCall] = useState<CallRequestPayload | null>(
//     locState?.incomingCall ?? null
//   );
//   const [onCall, setOnCall] = useState(false);

//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
//   const mountedRef = useRef(false);

//   // Create peer connection and add local tracks if present
//   const createPeerConnection = (stream?: MediaStream) => {
//     const pc = new RTCPeerConnection(configuration);

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log("🧊 Sending ICE candidate");
//         socket?.emit(VIDEO_CALL_EVENT.ICECANDIDATE, {
//           candidate: event.candidate.toJSON
//             ? event.candidate.toJSON()
//             : event.candidate,
//           receiverId,
//           from: user?._id,
//           to: receiverId ?? incomingCall?.callerId,
//         } as IceCandidatePayload);
//       }
//     };

//     pc.ontrack = (event) => {
//       console.log("🎬 ontrack fired!");
//       console.log("📹 Remote stream:", event.streams[0]);
//       console.log(
//         "🎵 Tracks:",
//         event.streams[0]?.getTracks().map((t) => ({
//           kind: t.kind,
//           enabled: t.enabled,
//           muted: t.muted,
//           readyState: t.readyState,
//         }))
//       );

//       // Ensure tracks are enabled and not muted
//       const stream = event.streams[0];
//       if (stream) {
//         stream.getTracks().forEach((track) => {
//           track.enabled = true;
//           console.log(`✅ Enabled ${track.kind} track`);
//         });
//       }

//       setRemoteStream(stream ?? null);
//     };

//     pc.onconnectionstatechange = () => {
//       console.log("🔌 Connection state:", pc.connectionState);
//     };

//     pc.oniceconnectionstatechange = () => {
//       console.log("🧊 ICE connection state:", pc.iceConnectionState);
//     };

//     if (stream) {
//       console.log("➕ Adding local tracks to peer connection");
//       stream.getTracks().forEach((track) => {
//         console.log(`   Adding ${track.kind} track`);
//         pc.addTrack(track, stream);
//       });
//     }

//     return pc;
//   };

//   // Start local media immediately when VideoChat mounts
//   useEffect(() => {
//     mountedRef.current = true;
//     let active = true;

//     const startLocal = async () => {
//       try {
//         console.log("🎥 Requesting local media...");
//         const stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });

//         if (!active) {
//           stream.getTracks().forEach((t) => t.stop());
//           return;
//         }

//         console.log(
//           "✅ Local media acquired:",
//           stream.getTracks().map((t) => t.kind)
//         );
//         setLocalStream(stream);
//       } catch (err) {
//         console.error("❌ Failed to get local media:", err);
//       }
//     };

//     startLocal();

//     return () => {
//       console.log("🧹 Cleaning up VideoChat component");
//       mountedRef.current = false;
//       active = false;

//       if (localStream) {
//         localStream.getTracks().forEach((t) => t.stop());
//       }
//       peerRef.current?.close();
//       peerRef.current = null;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Start call: emit request to server
//   const startCall = () => {
//     if (!user?._id || !receiverId) return;
//     console.log("📞 Starting call to:", receiverId);

//     socket?.emit(VIDEO_CALL_EVENT.CALL_REQUEST, {
//       callerId: user._id,
//       calleeId: receiverId,
//       callerName: user.firstName ?? user.email ?? undefined,
//     } as CallRequestPayload);
//   };

//   const acceptCall = () => {
//     if (!incomingCall) return;
//     console.log("✅ Accepting call from:", incomingCall.callerId);

//     socket?.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
//       callerId: incomingCall.callerId,
//       calleeId: user?._id,
//     } as CallAcceptPayload);

//     setIncomingCall(null);
//     setOnCall(true);
//   };

//   const rejectCall = () => {
//     if (!incomingCall) return;
//     console.log("❌ Rejecting call from:", incomingCall.callerId);

//     socket?.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
//       callerId: incomingCall.callerId,
//       calleeId: user?._id,
//     } as CallRejectPayload);

//     setIncomingCall(null);
//     navigate("/chat");
//   };

//   const hangUp = () => {
//     console.log("📴 Hanging up call");

//     peerRef.current?.close();
//     peerRef.current = null;

//     if (localStream) {
//       localStream.getTracks().forEach((t) => t.stop());
//     }

//     setLocalStream(null);
//     setRemoteStream(null);
//     setOnCall(false);

//     socket?.emit(VIDEO_CALL_EVENT.CALL_END, {
//       from: user?._id ?? "",
//       to: receiverId ?? "",
//     } as CallEndPayload);

//     navigate("/chat");
//   };

//   // EventBus subscriptions for signaling and control flows
//   useEffect(() => {
//     // OFFER: we are callee, receive offer => set remote desc, create answer
//     const offerHandler = async (data: OfferPayload) => {
//       if (data.calleeId !== user?._id) return;
//       console.log("📨 Received OFFER");

//       // Get current stream or request new one
//       let stream = localStream;
//       if (!stream) {
//         console.log("⚠️ Local stream not ready, requesting now...");
//         stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setLocalStream(stream);
//       }

//       // Create peer connection with the stream
//       const pc = createPeerConnection(stream);
//       peerRef.current = pc;

//       console.log("📥 Setting remote description (offer)");
//       await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

//       // Add pending ICE candidates
//       console.log(
//         `🧊 Processing ${pendingCandidates.current.length} pending candidates`
//       );
//       for (const c of pendingCandidates.current) {
//         try {
//           await pc.addIceCandidate(c as RTCIceCandidateInit);
//         } catch (err) {
//           console.error("Failed to add pending candidate:", err);
//         }
//       }
//       pendingCandidates.current = [];

//       console.log("📤 Creating and sending answer");
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);

//       socket?.emit(VIDEO_CALL_EVENT.ANSWER, {
//         sdp: answer,
//         callerId: data.callerId,
//         calleeId: data.calleeId,
//       } as AnswerPayload);

//       setOnCall(true);
//     };

//     // ANSWER: we are caller, set remote description
//     const answerHandler = async (data: AnswerPayload) => {
//       if (data.callerId !== user?._id) return;
//       if (!peerRef.current) {
//         console.error("❌ No peer connection when receiving answer");
//         return;
//       }

//       console.log("📨 Received ANSWER");

//       try {
//         console.log("📥 Setting remote description (answer)");
//         await peerRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.sdp)
//         );

//         // Process pending candidates
//         console.log(
//           `🧊 Processing ${pendingCandidates.current.length} pending candidates`
//         );
//         for (const c of pendingCandidates.current) {
//           try {
//             await peerRef.current.addIceCandidate(c as RTCIceCandidateInit);
//           } catch (err) {
//             console.error("Failed to add pending candidate:", err);
//           }
//         }
//         pendingCandidates.current = [];

//         setOnCall(true);
//       } catch (err) {
//         console.error("❌ Failed to set remote answer:", err);
//       }
//     };

//     // ICE candidate handler
//     const iceHandler = async (data: IceCandidatePayload) => {
//       const relevant =
//         data.to === user?._id ||
//         data.from === user?._id ||
//         data.to === receiverId ||
//         data.from === receiverId;

//       if (!relevant) return;

//       console.log("🧊 Received ICE candidate");
//       const candidate = new RTCIceCandidate(data.candidate);

//       if (peerRef.current?.remoteDescription) {
//         try {
//           await peerRef.current.addIceCandidate(candidate);
//           console.log("✅ Added ICE candidate immediately");
//         } catch (err) {
//           console.warn("⚠️ Failed to add ICE candidate:", err);
//         }
//       } else {
//         pendingCandidates.current.push(data.candidate);
//         console.log(
//           `📝 Queued ICE candidate (total: ${pendingCandidates.current.length})`
//         );
//       }
//     };

//     // CALL_ACCEPT: server notified that callee accepted (caller receives this)
//     const acceptHandler = async (data: CallAcceptPayload) => {
//       if (data.callerId !== user?._id) return;
//       console.log("✅ Call accepted by callee");

//       // Get current stream
//       let stream = localStream;
//       if (!stream) {
//         console.log("⚠️ Local stream not ready, requesting now...");
//         stream = await navigator.mediaDevices.getUserMedia({
//           audio: true,
//           video: true,
//         });
//         setLocalStream(stream);
//       }

//       // Create peer, add local tracks, create offer
//       const pc = createPeerConnection(stream);
//       peerRef.current = pc;

//       console.log("📤 Creating and sending offer");
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);

//       socket?.emit(VIDEO_CALL_EVENT.OFFER, {
//         sdp: offer,
//         callerId: user?._id ?? "",
//         calleeId: data.calleeId,
//       } as OfferPayload);
//     };

//     // CALL_REJECT handler
//     const rejectHandler = (data: CallRejectPayload) => {
//       const relevant =
//         data.callerId === user?._id || data.calleeId === user?._id;
//       if (!relevant) return;

//       console.log("❌ Call rejected");
//       hangUp();
//       alert("Call rejected");
//     };

//     // CALL_END handler
//     const endHandler = (data: CallEndPayload) => {
//       const relevant = data.from === user?._id || data.to === user?._id;
//       if (!relevant) return;

//       console.log("📴 Call ended by peer");
//       hangUp();
//       alert("Call ended");
//     };

//     const offOffer = eventBus.on("OFFER", offerHandler);
//     const offAnswer = eventBus.on("ANSWER", answerHandler);
//     const offIce = eventBus.on("ICECANDIDATE", iceHandler);
//     const offAccept = eventBus.on("CALL_ACCEPT", acceptHandler);
//     const offReject = eventBus.on("CALL_REJECT", rejectHandler);
//     const offEnd = eventBus.on("CALL_END", endHandler);

//     return () => {
//       offOffer();
//       offAnswer();
//       offIce();
//       offAccept();
//       offReject();
//       offEnd();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [localStream, socket, receiverId, user?._id]);

//   // When the component mounts, if location.state had incomingCall, keep it visible
//   useEffect(() => {
//     if (locState?.incomingCall) {
//       setIncomingCall(locState.incomingCall);
//       // acceptCall();
//     }
//   }, [locState]);

//   return (
//     <div className="relative min-h-[60vh] flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:p-6 bg-background text-foreground">
//       {!onCall && !incomingCall && (
//         <button
//           onClick={startCall}
//           className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
//         >
//           Start Call
//         </button>
//       )}

//       {incomingCall && !onCall && (
//         <div className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-sm flex items-center justify-between gap-3">
//           <p className="text-sm font-medium">
//             Incoming Call from{" "}
//             {incomingCall.callerName ?? incomingCall.callerId}
//           </p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={acceptCall}
//               className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700"
//             >
//               Accept
//             </button>
//             <button
//               onClick={rejectCall}
//               className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600"
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Local video always visible (when available) */}
//       {localStream && (
//         <VideoCall
//           stream={localStream}
//           className={`${
//             remoteStream
//               ? "absolute bottom-4 right-4 z-10 w-28 h-40 md:w-1/4 md:h-1/3 rounded-md ring-2 ring-background shadow-lg"
//               : "w-full h-[60vh] rounded-lg"
//           } bg-muted`}
//           isLocal={true}
//         />
//       )}

//       {/* Remote video appears only when onCall is true and remoteStream exists */}
//       {onCall && remoteStream && (
//         <VideoCall
//           stream={remoteStream}
//           className="w-full h-[60vh] rounded-lg overflow-hidden"
//           isLocal={false}
//         />
//       )}

//       {onCall && (
//         <button
//           onClick={hangUp}
//           className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
//         >
//           Hang Up
//         </button>
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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { eventBus } from "@/lib/eventBusInstance";
import type {
  AnswerPayload,
  CallAcceptPayload,
  CallEndPayload,
  CallRejectPayload,
  CallRequestPayload,
  IceCandidatePayload,
  OfferPayload,
} from "@/shared/types/videoCallEvent";

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

type LocationState = {
  incomingCall?: CallRequestPayload;
};

const VideoChat = () => {
  const socket = useSocket();
  const user = useSelector((state: RootState) => state.auth.user);
  const { receiverId } = useParams<{ receiverId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locState = location.state as LocationState | null;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallRequestPayload | null>(
    locState?.incomingCall ?? null
  );
  const [onCall, setOnCall] = useState(false);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const mountedRef = useRef(false);

  const createPeerConnection = (stream?: MediaStream) => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit(VIDEO_CALL_EVENT.ICECANDIDATE, {
          candidate: event.candidate.toJSON
            ? event.candidate.toJSON()
            : event.candidate,
          receiverId,
          from: user?._id,
          to: receiverId ?? incomingCall?.callerId,
        } as IceCandidatePayload);
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) {
        stream.getTracks().forEach((track) => (track.enabled = true));
      }
      setRemoteStream(stream ?? null);
    };

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    return pc;
  };

  useEffect(() => {
    mountedRef.current = true;
    let active = true;

    const startLocal = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        setLocalStream(stream);
      } catch (err) {
        console.error("❌ Failed to get local media:", err);
      }
    };

    startLocal();

    return () => {
      mountedRef.current = false;
      active = false;
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      peerRef.current?.close();
      peerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCall = () => {
    if (!user?._id || !receiverId) return;
    socket?.emit(VIDEO_CALL_EVENT.CALL_REQUEST, {
      callerId: user._id,
      calleeId: receiverId,
      callerName: user.firstName ?? user.email ?? undefined,
    } as CallRequestPayload);
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    socket?.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
      callerId: incomingCall.callerId,
      calleeId: user?._id,
    } as CallAcceptPayload);
    setIncomingCall(null);
    setOnCall(true);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket?.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
      callerId: incomingCall.callerId,
      calleeId: user?._id,
    } as CallRejectPayload);
    setIncomingCall(null);
    navigate("/chat");
  };

  const hangUp = () => {
    peerRef.current?.close();
    peerRef.current = null;
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setOnCall(false);
    socket?.emit(VIDEO_CALL_EVENT.CALL_END, {
      from: user?._id ?? "",
      to: receiverId ?? "",
    } as CallEndPayload);
    navigate("/chat");
  };

  // 🔹 EventBus: Listen for global accept/reject
  useEffect(() => {
    const offAcceptGlobal = eventBus.on("CALL_ACCEPT", (data) => {
      if (data.calleeId === user?._id) {
        setIncomingCall({ callerId: data.callerId, calleeId: data.calleeId });
        acceptCall();
      }
    });

    const offRejectGlobal = eventBus.on("CALL_REJECT", (data) => {
      if (data.calleeId === user?._id) {
        setIncomingCall({ callerId: data.callerId, calleeId: data.calleeId });
        rejectCall();
      }
    });

    return () => {
      offAcceptGlobal();
      offRejectGlobal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, incomingCall]);

  // ✅ Existing signaling handlers (no change)
  useEffect(() => {
    const offerHandler = async (data: OfferPayload) => {
      if (data.calleeId !== user?._id) return;
      let stream = localStream;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
      }
      const pc = createPeerConnection(stream);
      peerRef.current = pc;
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      for (const c of pendingCandidates.current) {
        await pc.addIceCandidate(c);
      }
      pendingCandidates.current = [];
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket?.emit(VIDEO_CALL_EVENT.ANSWER, {
        sdp: answer,
        callerId: data.callerId,
        calleeId: data.calleeId,
      } as AnswerPayload);
      setOnCall(true);
    };

    const answerHandler = async (data: AnswerPayload) => {
      if (data.callerId !== user?._id) return;
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(data.sdp)
      );
      for (const c of pendingCandidates.current) {
        await peerRef.current.addIceCandidate(c);
      }
      pendingCandidates.current = [];
      setOnCall(true);
    };

    const iceHandler = async (data: IceCandidatePayload) => {
      const relevant =
        data.to === user?._id ||
        data.from === user?._id ||
        data.to === receiverId ||
        data.from === receiverId;
      if (!relevant) return;
      const candidate = new RTCIceCandidate(data.candidate);
      if (peerRef.current?.remoteDescription) {
        await peerRef.current.addIceCandidate(candidate);
      } else {
        pendingCandidates.current.push(data.candidate);
      }
    };

    const acceptHandler = async (data: CallAcceptPayload) => {
      if (data.callerId !== user?._id) return;
      let stream = localStream;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
      }
      const pc = createPeerConnection(stream);
      peerRef.current = pc;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit(VIDEO_CALL_EVENT.OFFER, {
        sdp: offer,
        callerId: user?._id ?? "",
        calleeId: data.calleeId,
      } as OfferPayload);
    };

    const rejectHandler = (data: CallRejectPayload) => {
      const relevant =
        data.callerId === user?._id || data.calleeId === user?._id;
      if (!relevant) return;
      hangUp();
      alert("Call rejected");
    };

    const endHandler = (data: CallEndPayload) => {
      const relevant = data.from === user?._id || data.to === user?._id;
      if (!relevant) return;
      hangUp();
      alert("Call ended");
    };

    const offOffer = eventBus.on("OFFER", offerHandler);
    const offAnswer = eventBus.on("ANSWER", answerHandler);
    const offIce = eventBus.on("ICECANDIDATE", iceHandler);
    const offAccept = eventBus.on("CALL_ACCEPT", acceptHandler);
    const offReject = eventBus.on("CALL_REJECT", rejectHandler);
    const offEnd = eventBus.on("CALL_END", endHandler);

    return () => {
      offOffer();
      offAnswer();
      offIce();
      offAccept();
      offReject();
      offEnd();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, socket, receiverId, user?._id]);

  return (
    <div className="relative min-h-[60vh] flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:p-6 bg-background text-foreground">
      {!onCall && !incomingCall && (
        <button
          onClick={startCall}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Start Call
        </button>
      )}

      {/* 🎥 Video sections */}
      {localStream && (
        <VideoCall
          stream={localStream}
          className={`${
            remoteStream
              ? "absolute bottom-4 right-4 z-10 w-28 h-40 md:w-1/4 md:h-1/3 rounded-md ring-2 ring-background shadow-lg"
              : "w-full h-[60vh] rounded-lg"
          } bg-muted`}
          isLocal={true}
        />
      )}

      {onCall && remoteStream && (
        <VideoCall
          stream={remoteStream}
          className="w-full h-[60vh] rounded-lg overflow-hidden"
          isLocal={false}
        />
      )}

      {onCall && (
        <button
          onClick={hangUp}
          className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Hang Up
        </button>
      )}
    </div>
  );
};

export default VideoChat;


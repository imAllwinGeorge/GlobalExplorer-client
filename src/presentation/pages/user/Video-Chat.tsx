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

"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import type {
  AnswerPayload,
  CallAcceptPayload,
  CallEndPayload,
  CallRejectPayload,
  CallRequestPayload,
  IceCandidatePayload,
  OfferPayload,
} from "../../../shared/types/videoCallEvent"
import { useSocket } from "../../../contexts/SocketContext"
import type { RootState } from "../../store"
import { VIDEO_CALL_EVENT } from "../../../shared/constants/constants"
import { eventBus } from "../../../lib/eventBusInstance"
import VideoCall from "../../components/videoCall/VideoCall"
import { Mic, MicOff, Video, VideoOff, Phone, MoreVertical } from "lucide-react"

const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
}

type LocationState = {
  incomingCall?: CallRequestPayload
}

const VideoChat = () => {
  const socket = useSocket()
  const user = useSelector((state: RootState) => state.auth.user)
  const { receiverId } = useParams<{ receiverId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const locState = location.state as LocationState | null

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [incomingCall, setIncomingCall] = useState<CallRequestPayload | null>(locState?.incomingCall ?? null)
  const [onCall, setOnCall] = useState(false)
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true)
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true)
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  const peerRef = useRef<RTCPeerConnection | null>(null)
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([])
  const mountedRef = useRef(false)
  const eventListenersRef = useRef<Array<() => void>>([])
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  const createPeerConnection = (stream?: MediaStream) => {
    const pc = new RTCPeerConnection(configuration)

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit(VIDEO_CALL_EVENT.ICECANDIDATE, {
          candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
          receiverId,
          from: user?._id,
          to: receiverId ?? incomingCall?.callerId,
        } as IceCandidatePayload)
      }
    }

    pc.ontrack = (event) => {
      const stream = event.streams[0]
      if (stream) {
        stream.getTracks().forEach((track) => (track.enabled = true))
      }
      setRemoteStream(stream ?? null)
    }

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))
    }

    return pc
  }

  useEffect(() => {
    mountedRef.current = true
    let active = true

    const startLocal = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })

        if (!active) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        setLocalStream(stream)
      } catch (err) {
        console.error("❌ Failed to get local media:", err)
      }
    }

    startLocal()

    return () => {
      mountedRef.current = false
      active = false
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop())
      }
      peerRef.current?.close()
      peerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleLocalAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsLocalAudioEnabled(!isLocalAudioEnabled)
    }
  }

  const toggleLocalVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsLocalVideoEnabled(!isLocalVideoEnabled)
    }
  }

  const toggleRemoteAudio = () => {
    if (remoteStream) {
      remoteStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsRemoteAudioEnabled(!isRemoteAudioEnabled)
    }
  }

  const cleanupEventListeners = () => {
    eventListenersRef.current.forEach((unsubscribe) => unsubscribe())
    eventListenersRef.current = []
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }
  }

  const startCall = () => {
    if (!user?._id || !receiverId) return
    socket?.emit(VIDEO_CALL_EVENT.CALL_REQUEST, {
      callerId: user._id,
      calleeId: receiverId,
      callerName: user.firstName ?? user.email ?? undefined,
    } as CallRequestPayload)
  }

  const acceptCall = () => {
    if (!incomingCall) return
    socket?.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
      callerId: incomingCall.callerId,
      calleeId: user?._id,
    } as CallAcceptPayload)
    setIncomingCall(null)
    setOnCall(true)
    setCallDuration(0)
  }

  const rejectCall = () => {
    if (!incomingCall) return
    socket?.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
      callerId: incomingCall.callerId,
      calleeId: user?._id,
    } as CallRejectPayload)
    setIncomingCall(null)
    navigate("/chat")
  }

  const hangUp = () => {
    peerRef.current?.close()
    peerRef.current = null
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop())
    }
    setLocalStream(null)
    setRemoteStream(null)
    setOnCall(false)
    setCallDuration(0)
    cleanupEventListeners()
    socket?.emit(VIDEO_CALL_EVENT.CALL_END, {
      from: user?._id ?? "",
      to: receiverId ?? "",
    } as CallEndPayload)
    navigate("/chat")
  }

  useEffect(() => {
    if (onCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
        callTimerRef.current = null
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
        callTimerRef.current = null
      }
    }
  }, [onCall])

  // 🔹 EventBus: Listen for global accept/reject
  useEffect(() => {
    const offAcceptGlobal = eventBus.on("CALL_ACCEPT", (data) => {
      if (data.calleeId === user?._id) {
        setIncomingCall({ callerId: data.callerId, calleeId: data.calleeId })
        acceptCall()
      }
    })

    const offRejectGlobal = eventBus.on("CALL_REJECT", (data) => {
      if (data.calleeId === user?._id) {
        setIncomingCall({ callerId: data.callerId, calleeId: data.calleeId })
        rejectCall()
      }
    })

    eventListenersRef.current.push(offAcceptGlobal, offRejectGlobal)

    return () => {
      offAcceptGlobal()
      offRejectGlobal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, incomingCall])

  // ✅ Existing signaling handlers with event listener tracking
  useEffect(() => {
    const offerHandler = async (data: OfferPayload) => {
      if (data.calleeId !== user?._id) return
      let stream = localStream
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })
        setLocalStream(stream)
      }
      const pc = createPeerConnection(stream)
      peerRef.current = pc
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
      for (const c of pendingCandidates.current) {
        await pc.addIceCandidate(c)
      }
      pendingCandidates.current = []
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socket?.emit(VIDEO_CALL_EVENT.ANSWER, {
        sdp: answer,
        callerId: data.callerId,
        calleeId: data.calleeId,
      } as AnswerPayload)
      setOnCall(true)
      setCallDuration(0)
    }

    const answerHandler = async (data: AnswerPayload) => {
      if (data.callerId !== user?._id) return
      if (!peerRef.current) return
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
      for (const c of pendingCandidates.current) {
        await peerRef.current.addIceCandidate(c)
      }
      pendingCandidates.current = []
      setOnCall(true)
      setCallDuration(0)
    }

    const iceHandler = async (data: IceCandidatePayload) => {
      const relevant =
        data.to === user?._id || data.from === user?._id || data.to === receiverId || data.from === receiverId
      if (!relevant) return
      const candidate = new RTCIceCandidate(data.candidate)
      if (peerRef.current?.remoteDescription) {
        await peerRef.current.addIceCandidate(candidate)
      } else {
        pendingCandidates.current.push(data.candidate)
      }
    }

    const acceptHandler = async (data: CallAcceptPayload) => {
      if (data.callerId !== user?._id) return
      let stream = localStream
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })
        setLocalStream(stream)
      }
      const pc = createPeerConnection(stream)
      peerRef.current = pc
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket?.emit(VIDEO_CALL_EVENT.OFFER, {
        sdp: offer,
        callerId: user?._id ?? "",
        calleeId: data.calleeId,
      } as OfferPayload)
      setCallDuration(0)
    }

    const rejectHandler = (data: CallRejectPayload) => {
      const relevant = data.callerId === user?._id || data.calleeId === user?._id
      if (!relevant) return
      hangUp()
      alert("Call rejected")
    }

    const endHandler = (data: CallEndPayload) => {
      const relevant = data.from === user?._id || data.to === user?._id
      if (!relevant) return
      hangUp()
      alert("Call ended")
    }

    const offOffer = eventBus.on("OFFER", offerHandler)
    const offAnswer = eventBus.on("ANSWER", answerHandler)
    const offIce = eventBus.on("ICECANDIDATE", iceHandler)
    const offAccept = eventBus.on("CALL_ACCEPT", acceptHandler)
    const offReject = eventBus.on("CALL_REJECT", rejectHandler)
    const offEnd = eventBus.on("CALL_END", endHandler)

    eventListenersRef.current.push(offOffer, offAnswer, offIce, offAccept, offReject, offEnd)

    return () => {
      offOffer()
      offAnswer()
      offIce()
      offAccept()
      offReject()
      offEnd()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, socket, receiverId, user?._id])

  useEffect(() => {
    return () => {
      cleanupEventListeners()
    }
  }, [])

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const remoteUserName = locState?.incomingCall?.callerName || "Remote User"

  return (
    <div className="relative w-full h-screen bg-neutral-900 text-white overflow-hidden flex flex-col">
      {!onCall && !incomingCall && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
          <button
            onClick={startCall}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-6 py-3 text-base font-medium hover:bg-blue-700 transition-colors"
          >
            Start Call
          </button>
        </div>
      )}

      {/* Video Container */}
      <div className="relative flex-1 overflow-hidden z-10">
        {/* Remote Video - Full Screen */}
        {onCall && remoteStream ? (
          <div className="relative w-full h-full">
            <VideoCall stream={remoteStream} className="w-full h-full" isLocal={false} />
            {/* Remote User Badge */}
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              {remoteUserName}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📞</span>
              </div>
              <p className="text-lg text-neutral-300">Waiting for remote user...</p>
            </div>
          </div>
        )}

        {/* Local Video - Picture in Picture */}
        {localStream && (
          <div className="absolute bottom-4 right-4 z-20 w-32 h-40 rounded-lg overflow-hidden border-2 border-neutral-600 shadow-lg bg-neutral-800">
            <VideoCall stream={localStream} className="w-full h-full" isLocal={true} />
            {/* Local User Badge */}
            <div className="absolute bottom-1 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium truncate max-w-[100px]">
              {user?.firstName || "You"}
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="shrink-0 bg-neutral-950 border-t border-neutral-800 px-4 py-4 z-50 relative">
        {onCall && (
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left: Timer */}
            <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono">
              <span>⏱️</span>
              <span>{formatDuration(callDuration)}</span>
            </div>

            {/* Center: Control Buttons */}
            <div className="flex items-center justify-center gap-3">
              {/* Mute Audio Button */}
              <button
                onClick={toggleLocalAudio}
                className={`p-3 rounded-full transition-all ${
                  isLocalAudioEnabled
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                title={isLocalAudioEnabled ? "Mute" : "Unmute"}
              >
                {isLocalAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              {/* Toggle Video Button */}
              <button
                onClick={toggleLocalVideo}
                className={`p-3 rounded-full transition-all ${
                  isLocalVideoEnabled
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
                title={isLocalVideoEnabled ? "Stop Video" : "Start Video"}
              >
                {isLocalVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              {/* Mute Remote Audio Button */}
              <button
                onClick={toggleRemoteAudio}
                className={`p-3 rounded-full transition-all ${
                  isRemoteAudioEnabled
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
                title={isRemoteAudioEnabled ? "Mute Remote" : "Unmute Remote"}
              >
                {isRemoteAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              {/* More Options Button */}
              <button
                className="p-3 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white transition-all"
                title="More options"
              >
                <MoreVertical size={20} />
              </button>

              {/* End Call Button */}
              <button
                onClick={hangUp}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all ml-2"
                title="End meeting"
              >
                <Phone size={20} />
              </button>
            </div>

            {/* Right: Placeholder for alignment */}
            <div className="w-16" />
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoChat


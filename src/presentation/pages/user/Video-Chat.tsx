import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type {
  AnswerPayload,
  CallAcceptPayload,
  CallEndPayload,
  CallRejectPayload,
  CallRequestPayload,
  IceCandidatePayload,
  OfferPayload,
} from "../../../shared/types/videoCallEvent";
import { useSocket } from "../../../contexts/SocketContext";
import type { RootState } from "../../store";
import { VIDEO_CALL_EVENT } from "../../../shared/constants/constants";
import { eventBus } from "../../../lib/eventBusInstance";
import VideoCall from "../../components/videoCall/VideoCall";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
} from "lucide-react";

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
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Refs
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventListenersRef = useRef<Array<() => void>>([]);

  // Keep Ref in sync with State
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

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

  // 1. Initial Media Setup & Safety Cleanup
  useEffect(() => {
    let active = true;
    let streamInstance: MediaStream | null = null; // Capture for cleanup

    const startLocal = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!active) {
          // Component unmounted during await, stop immediately
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamInstance = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error("❌ Failed to get local media:", err);
      }
    };

    startLocal();

    return () => {
      active = false;
      // ✅ FIX: Force stop tracks when component unmounts
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleLocalAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalAudioEnabled(!isLocalAudioEnabled);
    }
  };

  const toggleLocalVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsLocalVideoEnabled(!isLocalVideoEnabled);
    }
  };

  const toggleRemoteAudio = () => {
    if (remoteStream) {
      remoteStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsRemoteAudioEnabled(!isRemoteAudioEnabled);
    }
  };

  const cleanupEventListeners = () => {
    eventListenersRef.current.forEach((unsubscribe) => unsubscribe());
    eventListenersRef.current = [];
  };

  // ✅ FIX: HangUp now ensures tracks are stopped
  const hangUp = useCallback(() => {
    try {
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }

      // Stop local tracks using State OR Ref (to be safe)
      const stream = localStream || localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      }

      // Stop remote tracks
      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
      
      setLocalStream(null);
      setRemoteStream(null);
      setOnCall(false);
      setCallDuration(0);
      pendingCandidates.current = [];
      
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }

      socket?.emit(VIDEO_CALL_EVENT.CALL_END, {
        from: user?._id ?? "",
        to: receiverId ?? "",
      } as CallEndPayload);

      navigate("/chat");
    } catch (err) {
      console.error("Error during hangup:", err);
    }
  }, [navigate, remoteStream, socket, user?._id, receiverId, localStream]);

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
    setCallDuration(0);
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

  // 2. Signaling Effect
  useEffect(() => {
    if (!user?._id) return;

    const offerHandler = async (data: OfferPayload) => {
      if (data.calleeId !== user?._id) return;
      
      let stream = localStreamRef.current;
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
      setCallDuration(0);
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
      setCallDuration(0);
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

    const acceptHandlerSocket = async (data: CallAcceptPayload) => {
      if (data.callerId !== user?._id) return;
      
      let stream = localStreamRef.current;
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
      setCallDuration(0);
    };

    const rejectHandlerSocket = (data: CallRejectPayload) => {
      const relevant =
        data.callerId === user?._id || data.calleeId === user?._id;
      if (!relevant) return;
      hangUp();
      alert("Call rejected");
    };

    const endHandler = (data: CallEndPayload) => {
      if (data.from === user?._id) return;
      
      const relevant = data.to === user?._id || data.to === receiverId;
      if (!relevant) return;
      
      hangUp();
    };

    const offOffer = eventBus.on("OFFER", offerHandler);
    const offAnswer = eventBus.on("ANSWER", answerHandler);
    const offIce = eventBus.on("ICECANDIDATE", iceHandler);
    const offAccept = eventBus.on("CALL_ACCEPT", acceptHandlerSocket);
    const offReject = eventBus.on("CALL_REJECT", rejectHandlerSocket);
    const offEnd = eventBus.on("CALL_END", endHandler);

    // Global Accept/Reject Listeners
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

    eventListenersRef.current.push(
      offOffer, offAnswer, offIce, offAccept, offReject, offEnd, offAcceptGlobal, offRejectGlobal
    );

    return () => {
      cleanupEventListeners();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, socket, receiverId, hangUp]);

  // 3. Timer Effect
  useEffect(() => {
    if (onCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, [onCall]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const remoteUserName = locState?.incomingCall?.callerName || "Remote User";

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
      <div className="relative flex-1 overflow-hidden">
        {onCall && remoteStream ? (
          <div className="relative w-full h-full">
            <VideoCall
              stream={remoteStream}
              className="w-full h-full"
              isLocal={false}
            />
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              <button
                onClick={toggleRemoteAudio}
                disabled={!remoteStream}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isRemoteAudioEnabled
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRemoteAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <span className="text-sm font-medium">{remoteUserName}</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📞</span>
              </div>
              <p className="text-lg text-neutral-300">
                Waiting for remote user...
              </p>
            </div>
          </div>
        )}

        {localStream && (
          <div className="absolute bottom-4 right-4 z-20 w-32 h-40 rounded-lg overflow-hidden border-2 border-neutral-600 shadow-lg bg-neutral-800">
            <VideoCall
              stream={localStream}
              className="w-full h-full"
              isLocal={true}
            />
            <div className="absolute bottom-1 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium truncate max-w-[100px]">
              {user?.firstName || "You"}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 bg-neutral-950 border-t border-neutral-800 px-4 py-4">
        {onCall && (
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono">
              <span>⏱️</span>
              <span>{formatDuration(callDuration)}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleLocalAudio}
                className={`p-3 rounded-full transition-all ${
                  isLocalAudioEnabled
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isLocalAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={toggleLocalVideo}
                className={`p-3 rounded-full transition-all ${
                  isLocalVideoEnabled
                    ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isLocalVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                onClick={hangUp}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all ml-2"
              >
                <Phone size={20} />
              </button>
            </div>
            <div className="w-16" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
// import { useSocket } from "@/contexts/SocketContext"
// import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
// import { useEffect } from "react"
// import toast from "react-hot-toast";


// const GlobalCallListener = () => {
//     const socket = useSocket();
//     useEffect(() => {
//         if( !socket ) return

//         socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, () => toast.success("call...................."))

//         return () => {
//             socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
//         }
//     }, [socket])
//   return null
// }

// export default GlobalCallListener

// // src/components/videoCall/GlobalCallListener.tsx
// // src/presentation/components/videoCall/GlobalCallListener.tsx
// import { useEffect } from "react";
// import { useSocket } from "@/contexts/SocketContext";
// import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";

// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import type { AnswerPayload, CallAcceptPayload, CallEndPayload, CallRejectPayload, CallRequestPayload, IceCandidatePayload, OfferPayload } from "@/shared/types/videoCallEvent";
// import { eventBus } from "@/lib/eventBusInstance";

// /**
//  * GlobalCallListener responsibilities:
//  *  - Listen for socket events
//  *  - Forward them to the local EventBus (signaling events)
//  *  - Show an incoming-call toast with Accept/Reject actions.
//  */
// const GlobalCallListener = () => {
//   const socket = useSocket();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!socket) return;

//     // Forward generic socket events to eventBus
//     socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, (data: CallRequestPayload) => {
//       // show toast + actions
//       const { callerId, callerName } = data;
//       toast((t) => (
//         <div className="flex flex-col gap-2">
//           <p className="font-medium">{callerName ?? "Someone"} is calling...</p>
//           <div className="flex gap-2">
//             <button
//               className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 // navigate to video and pass incoming call via location state
//                 navigate(`/video/${callerId}`, { state: { incomingCall: data } });
//               }}
//             >
//               Accept
//             </button>
//             <button
//               className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
//               onClick={() => {
//                 toast.dismiss(t.id);
//                 // notify server about reject
//                 socket.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
//                   callerId: data.callerId,
//                   calleeId: data.calleeId,
//                 } as CallRejectPayload);
//               }}
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ), { duration: 10000 });

//       // forward to local event bus for any mounted call UI to react
//       eventBus.emit("CALL_REQUEST", data);
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_ACCEPT, (data: CallAcceptPayload) => {
//       eventBus.emit("CALL_ACCEPT", data);
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_REJECT, (data: CallRejectPayload) => {
//       eventBus.emit("CALL_REJECT", data);
//     });

//     socket.on(VIDEO_CALL_EVENT.OFFER, (data: OfferPayload) => {
//       eventBus.emit("OFFER", data);
//     });

//     socket.on(VIDEO_CALL_EVENT.ANSWER, (data: AnswerPayload) => {
//       eventBus.emit("ANSWER", data);
//     });

//     socket.on(VIDEO_CALL_EVENT.ICECANDIDATE, (data: IceCandidatePayload) => {
//       eventBus.emit("ICECANDIDATE", data);
//     });

//     socket.on(VIDEO_CALL_EVENT.CALL_END, (data: CallEndPayload) => {
//       eventBus.emit("CALL_END", data);
//     });

//     return () => {
//       socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
//       socket.off(VIDEO_CALL_EVENT.CALL_ACCEPT);
//       socket.off(VIDEO_CALL_EVENT.CALL_REJECT);
//       socket.off(VIDEO_CALL_EVENT.OFFER);
//       socket.off(VIDEO_CALL_EVENT.ANSWER);
//       socket.off(VIDEO_CALL_EVENT.ICECANDIDATE);
//       socket.off(VIDEO_CALL_EVENT.CALL_END);
//     };
//   }, [socket, navigate]);

//   return null;
// };

// export default GlobalCallListener;

//-------------------------------------------------

import { useEffect } from "react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../contexts/SocketContext";
import { VIDEO_CALL_EVENT } from "../../../shared/constants/constants";
import type { AnswerPayload, CallAcceptPayload, CallEndPayload, CallRejectPayload, CallRequestPayload, IceCandidatePayload, OfferPayload } from "../../../shared/types/videoCallEvent";
import { eventBus } from "../../../lib/eventBusInstance";


const GlobalCallListener = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, (data: CallRequestPayload) => {
      const { callerId, callerName } = data;
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium">
              {callerName ?? "Someone"} is calling...
            </p>
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate(`/video/${callerId}`, {
                    state: { incomingCall: data },
                  });
                  socket.emit(VIDEO_CALL_EVENT.CALL_ACCEPT, {
                    callerId: data.callerId,
                    calleeId: data.calleeId,
                  } as CallAcceptPayload);
                  eventBus.emit("CALL_ACCEPT", {
                    callerId: data.callerId,
                    calleeId: data.calleeId,
                  });
                }}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                onClick={() => {
                  toast.dismiss(t.id);
                  socket.emit(VIDEO_CALL_EVENT.CALL_REJECT, {
                    callerId: data.callerId,
                    calleeId: data.calleeId,
                  } as CallRejectPayload);
                  eventBus.emit("CALL_REJECT", {
                    callerId: data.callerId,
                    calleeId: data.calleeId,
                  });
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ),
        { duration: 10000 }
      );

      eventBus.emit("CALL_REQUEST", data);
    });

    socket.on(VIDEO_CALL_EVENT.CALL_ACCEPT, (data: CallAcceptPayload) => {
      eventBus.emit("CALL_ACCEPT", data);
    });

    socket.on(VIDEO_CALL_EVENT.CALL_REJECT, (data: CallRejectPayload) => {
      eventBus.emit("CALL_REJECT", data);
    });

    socket.on(VIDEO_CALL_EVENT.OFFER, (data: OfferPayload) => {
      eventBus.emit("OFFER", data);
    });

    socket.on(VIDEO_CALL_EVENT.ANSWER, (data: AnswerPayload) => {
      eventBus.emit("ANSWER", data);
    });

    socket.on(VIDEO_CALL_EVENT.ICECANDIDATE, (data: IceCandidatePayload) => {
      eventBus.emit("ICECANDIDATE", data);
    });

    socket.on(VIDEO_CALL_EVENT.CALL_END, (data: CallEndPayload) => {
      eventBus.emit("CALL_END", data);
    });

    return () => {
      socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
      socket.off(VIDEO_CALL_EVENT.CALL_ACCEPT);
      socket.off(VIDEO_CALL_EVENT.CALL_REJECT);
      socket.off(VIDEO_CALL_EVENT.OFFER);
      socket.off(VIDEO_CALL_EVENT.ANSWER);
      socket.off(VIDEO_CALL_EVENT.ICECANDIDATE);
      socket.off(VIDEO_CALL_EVENT.CALL_END);
    };
  }, [socket, navigate]);

  return null;
};

export default GlobalCallListener;



import { useSocket } from "@/contexts/SocketContext"
import { VIDEO_CALL_EVENT } from "@/shared/constants/constants";
import { useEffect } from "react"
import toast from "react-hot-toast";


const GlobalCallListener = () => {
    const socket = useSocket();
    useEffect(() => {
        if( !socket ) return

        socket.on(VIDEO_CALL_EVENT.CALL_REQUEST, () => toast.success("call...................."))

        return () => {
            socket.off(VIDEO_CALL_EVENT.CALL_REQUEST);
        }
    }, [socket])
  return null
}

export default GlobalCallListener
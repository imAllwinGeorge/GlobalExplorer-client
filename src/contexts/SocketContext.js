import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
export const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

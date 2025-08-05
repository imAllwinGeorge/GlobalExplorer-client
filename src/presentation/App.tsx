import { Route, Routes } from "react-router-dom";
import UserRoutes from "../routes/UserRoutes";
import AdminRoutes from "../routes/AdminRoutes";
import HostRoutes from "../routes/HostRoutes";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { useEffect, useState } from "react";
import { socketService } from "../services/SocketService";
import { SocketContext } from "../contexts/SocketContext";
import { Socket } from "socket.io-client";

const App = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const host = useSelector((state: RootState) => state.host.host);
  const admin = useSelector((state: RootState) => state.admin.admin);
  const [socket, setSocket] = useState<Socket | null>(null)

  const isAuthenticated = user ? user : host ? host : admin;

  useEffect(() => {
    const connectSocket = async () => {
      if (isAuthenticated) {
        await socketService.connect(isAuthenticated.role);

        console.log("authenticated");
        console.log(isAuthenticated.email, socketService.instance);
        setSocket(socketService.instance)
      }
    };

    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  console.log("global socket", socket)
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/host/*" element={<HostRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </SocketContext.Provider>
    </div>
  );
};

export default App;

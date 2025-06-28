import { Route, Routes } from "react-router-dom";
import UserRoutes from "../routes/UserRoutes";
import AdminRoutes from "../routes/AdminRoutes";
import HostRoutes from "../routes/HostRoutes";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<UserRoutes/>} />
        <Route path="/host/*" element={<HostRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
  );
};

export default App;

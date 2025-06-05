import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/homepage/HomePage";
import SignUP from "./pages/user/signup/SignUP";
import Otp from "./pages/otp/Otp";
import Login from "./pages/user/Loginpage/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import { UserProtectionLayout } from "./protectionLayers/UserProtectionLayout";
import { UserHomeProtection } from "./protectionLayers/UserHomeProtection";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserProtectionLayout><HomePage /></UserProtectionLayout>} />
        <Route path="/signup" element={<SignUP />} />
        <Route path="/verify_otp" element={<Otp />} />
        <Route path="/login" element = {<UserHomeProtection><Login/></UserHomeProtection>} />
        <Route path="adminlogin" element = {<AdminLogin/>} />
      </Routes>
    </div>
  );
};

export default App;

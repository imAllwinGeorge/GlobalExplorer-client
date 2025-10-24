import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from "../../components/mainComponents/Footer";
import NavBar from "../../components/mainComponents/NavBar";
import PublicHeader from "../../components/mainComponents/PublicHeader";
const role = "user";
const LandingPage = () => {
    return (_jsxs("div", { children: [_jsx(NavBar, { role: role }), _jsx(PublicHeader, {}), _jsx(Footer, {})] }));
};
export default LandingPage;

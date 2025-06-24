import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChildrenProps } from "../../shared/types/global";
import { AuthAPI } from "../../services/AuthAPI";

export const AdminProtectionLayout = ({ children }: ChildrenProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const authAPI = new AuthAPI();

  useEffect(() => {
    const isValid = async () => {
      try {
        const response = await authAPI.verifyToken();
        console.log(response);
        if (response.status === 200) {
          setIsVerified(true);
        }
      } catch (error) {
        console.log("user protection layer error", error);
        navigate("/adminlogin");
      }
    };
    isValid();
  }, []);
  return <div className="bg-white">{isVerified && children}</div>;
};

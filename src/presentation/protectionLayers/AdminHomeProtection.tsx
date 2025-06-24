import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../services/AuthAPI";

type ChildrenProps = {
  children: React.ReactNode;
};

export const AdminHomeProtection = ({ children }: ChildrenProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const authAPI = new AuthAPI();

  useEffect(() => {
    const isValid = async () => {
      try {
        const response = await authAPI.verifyToken();
        if (response.status === 200) {
          setIsVerified(true);
          navigate("/adminhome");
        } else {
          navigate("/adminlogin");
        }
      } catch (error) {
        console.log(error);
        navigate("/adminlogin");
      }
    };
    isValid();
  }, []);
  return <div className="bg-white shadow-2xl">{!isVerified && children}</div>;
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../infrastructure/api/AuthAPI";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { AuthUseCase } from "../../application/usecases/AuthUsecase";

type ChildrenProps = {
  children: React.ReactNode;
};

export const UserHomeProtection = ({ children }: ChildrenProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const api = new AuthAPI();
  const repository = new AuthRepository(api);
  const authUseCase = new AuthUseCase(repository);

  useEffect(() => {
    const isValid = async () => {
      try {
        const response = await authUseCase.verifyToken();
        if (response.status === 200) {
          
          setIsVerified(true);
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error)
        navigate("/login");
      }
    };
    isValid();
  }, []);
  return <div className="bg-white shadow-2xl">{!isVerified && children}</div>;
};

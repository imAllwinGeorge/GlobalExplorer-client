
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChildrenProps } from '../../shared/types/global'
import { AuthAPI } from '../../infrastructure/api/AuthAPI'
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository'
import { AuthUseCase } from '../../application/usecases/AuthUsecase'



export const UserProtectionLayout = ({children}:ChildrenProps) => {
    const [isVerified, setIsVerified] = useState(false)
    const navigate = useNavigate();

      const api = new AuthAPI();
      const repository = new AuthRepository(api);
      const authUseCase = new AuthUseCase(repository)

    useEffect(() => {
        const isValid = async () => {
            try {
                const response = await authUseCase.verifyToken();
                console.log(response)
                if(response.status === 200){
                   
                    setIsVerified(true);
                }

            } catch (error) {
                console.log("user protection layer error", error)
                navigate("/login")
            }
        }
        isValid();
    },[])
  return (
    <div className='bg-white'>
        {isVerified && children}
    </div>
  )
}

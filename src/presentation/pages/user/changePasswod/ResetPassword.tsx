import type React from "react"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { isValidPassword } from "../../../../shared/validation/validations"
import { AuthAPI } from "../../../../services/AuthAPI"
import toast from "react-hot-toast"

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const {id, token, role} = useParams();
  const authAPI = new AuthAPI()
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if(newPassword !== confirmPassword){
      setError("New password and Confirm password should be same")
      return
    }

    const errors = isValidPassword(newPassword)
    if(!errors){
      setError("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.")
      return;
    }

    

    try {
      // Simulate API call
      if(id && token && newPassword && role) {
        const response = await authAPI.resetPassword(id, role, token, newPassword)
        if(response.status === 200){
          // setIsSuccess(true)
          toast.success(response.data.message || "password updated")
          navigate('/login')
        }
      
      }else {
        toast.error("something went wrong")
      }
    } catch (err) {
        console.log(err)
        if(err instanceof Error){
          console.log('sgvsiog',err.message)
          toast.error(err.message)
        }
      setError("Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // const resetForm = () => {
  //   setNewPassword("")
  //   setConfirmPassword("")
  //   setIsSuccess(false)
  //   setError("")
  // }

  // if (isSuccess) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
  //       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
  //         <div className="text-center">
  //           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <span className="text-green-600 text-2xl">✓</span>
  //           </div>
  //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Changed Successfully</h1>
  //           <p className="text-gray-600 mb-6">
  //             Your password has been updated successfully. You can now use your new password to sign in.
  //           </p>
  //           <button
  //             onClick={resetForm}
  //             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-3"
  //           >
  //             Change Password Again
  //           </button>
  //           <button
  //             onClick={() => console.log("Go to dashboard")}
  //             className="w-full text-gray-500 py-2 px-4 hover:text-gray-700"
  //           >
  //             Go to Dashboard
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
          <p className="text-gray-600">Enter your current password and choose a new one.</p>
        </div>

        <form onSubmit={handleSubmit}>
          

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => {setNewPassword(e.target.value); setIsLoading(false)}}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => {setConfirmPassword(e.target.value); setIsLoading(false)}}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>

        <div className="text-center">
          <button onClick={() => {setError(""); setIsLoading(false)}} className="text-gray-500 text-sm hover:text-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

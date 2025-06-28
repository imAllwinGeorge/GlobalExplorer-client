import type React from "react"

import { useState } from "react"
import { isValidEmail } from "../../../../shared/validation/validations"
import { AuthAPI } from "../../../../services/AuthAPI"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
export default function VerifyEmail() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const location = useLocation();

  const navigate = useNavigate();
  const authAPI = new AuthAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const errors = isValidEmail(email);
    if(!errors){
      setError("please Enter valid email")
    }
    try {
      const response = await authAPI.verifyEmail(email, location.state);
      if(response.status === 200){
        setIsSubmitted(true)
        toast.success(response.data.message || "Recovery link sented to you email")
      }
    } catch (error) {
      console.log(error)
      if(error instanceof Error){
        toast.error(error.message)
      }
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <button
              onClick={() => navigate("/login")}
              className="w-full text-gray-500 py-2 px-4 hover:text-gray-700"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
            disabled={isLoading || !email.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="text-center">
          <button onClick={() => navigate("/login")} className="text-gray-500 text-sm hover:text-gray-700">
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  )
}

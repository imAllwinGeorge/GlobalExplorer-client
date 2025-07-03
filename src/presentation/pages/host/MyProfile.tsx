"use client"

import { useState } from "react"
import { Edit, Save, X, User, Mail, Phone, CreditCard, FileText, Shield, Eye, EyeOff, Download } from "lucide-react"
import type { HostFormData } from "../host/HostSignUp/HostSignUp"
import type { HostSignupFormErrors } from "../../../shared/types/auth.type"
import Input from "../../components/Input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import type { Host } from "../../../shared/types/global"

interface HostDetailsDisplayProps {
  initialData: Host
//   onSave?: (data: HostFormData) => void
}

export default function MyProfile({ initialData}: HostDetailsDisplayProps) {
  const [data, setData] = useState<Host>(initialData)
  const [editingSections, setEditingSections] = useState<{
    personal: boolean
    bank: boolean
    kyc: boolean
    legal: boolean
  }>({
    personal: false,
    bank: false,
    kyc: false,
    legal: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<HostSignupFormErrors>({})

  const handleEdit = (section: keyof typeof editingSections) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: true,
    }))
    setErrors({})
  }

  const handleCancel = (section: keyof typeof editingSections) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: false,
    }))
    setData(initialData)
    setErrors({})
  }

  const handleSave = (section: keyof typeof editingSections) => {
    // Basic validation
    const newErrors: HostSignupFormErrors = {}

    if (section === "personal") {
      if (!data.firstName.trim()) newErrors.firstName = "First name is required"
      if (!data.lastName.trim()) newErrors.lastName = "Last name is required"
      if (!data.email.trim()) newErrors.email = "Email is required"
      if (!data.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    }

    if (section === "bank") {
      if (!data.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required"
      if (!data.ifsc.trim()) newErrors.ifsc = "IFSC is required"
      if (!data.accountNumber.trim()) newErrors.accountNumber = "Account number is required"
      if (!data.branch.trim()) newErrors.branch = "Branch is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setEditingSections((prev) => ({
      ...prev,
      [section]: false,
    }))
    setErrors({})
    // onSave?.(data)
  }

  const handleInputChange = (field: keyof HostFormData, value: string | File) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (field: keyof HostFormData, file: File | null) => {
    setData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

  const FileDisplay = ({
    file,
    label,
    field,
    isEditing,
  }: {
    file: string | null
    label: string
    field: keyof HostFormData
    isEditing: boolean
  }) => {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{label}</label>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
              className="flex-1"
            />
            {file && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <FileText size={12} />
                <span className="text-xs">{file}</span>
              </Badge>
            
            )}
          </div>
        </div>
      )
    }
    console.log(file)
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <FileText className="text-gray-500" size={20} />
          <div>
            <p className="font-medium text-sm">{label}</p>
            {file ? (
            //   <p className="text-xs text-gray-500">
            //     {file.name} ({formatFileSize(file.size)})
            //   </p>
            <img src= {`http://localhost:3000/uploads/images/${file}`} alt={label} className="w-32 h-32 object-cover border roounded-md" />
            ) : (
              <p className="text-xs text-red-500">No file uploaded</p>
            )}
          </div>
        </div>
        {file && (
          <Button variant="ghost" size="sm">
            <Download size={16} />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Host Profile Details</h1>
        <p className="text-gray-600 mt-2">View and manage your registration information</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="text-blue-600" size={24} />
            <CardTitle>Personal Information</CardTitle>
          </div>
          {!editingSections.personal ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit("personal")}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCancel("personal")}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave("personal")}>
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingSections.personal ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName">Last Name</label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber">Phone Number</label>
                <Input
                  id="phoneNumber"
                  value={data.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">
                    {data.firstName} {data.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{data.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{data.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <Badge variant="secondary">{data.role}</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="text-green-600" size={24} />
            <CardTitle>Bank Details</CardTitle>
          </div>
          {!editingSections.bank ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit("bank")}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCancel("bank")}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave("bank")}>
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingSections.bank ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="accountHolderName">Account Holder Name</label>
                <Input
                  id="accountHolderName"
                  value={data.accountHolderName}
                  onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                  className={errors.accountHolderName ? "border-red-500" : ""}
                />
                {errors.accountHolderName && <p className="text-red-500 text-xs">{errors.accountHolderName}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="ifsc">IFSC Code</label>
                <Input
                  id="ifsc"
                  value={data.ifsc}
                  onChange={(e) => handleInputChange("ifsc", e.target.value)}
                  className={errors.ifsc ? "border-red-500" : ""}
                />
                {errors.ifsc && <p className="text-red-500 text-xs">{errors.ifsc}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="accountNumber">Account Number</label>
                <Input
                  id="accountNumber"
                  value={data.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className={errors.accountNumber ? "border-red-500" : ""}
                />
                {errors.accountNumber && <p className="text-red-500 text-xs">{errors.accountNumber}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="branch">Branch</label>
                <Input
                  id="branch"
                  value={data.branch}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  className={errors.branch ? "border-red-500" : ""}
                />
                {errors.branch && <p className="text-red-500 text-xs">{errors.branch}</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Account Holder Name</p>
                <p className="font-medium">{data.accountHolderName || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IFSC Code</p>
                <p className="font-medium">{data.ifsc || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium">
                  {data.accountNumber ? `****${data.accountNumber.slice(-4)}` : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{data.branch || "Not provided"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="text-orange-600" size={24} />
            <CardTitle>KYC Documents</CardTitle>
          </div>
          {!editingSections.kyc ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit("kyc")}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCancel("kyc")}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave("kyc")}>
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FileDisplay file={data.kyc_panCard} label="PAN Card" field="kyc_panCard" isEditing={editingSections.kyc} />
            <FileDisplay file={data.kyc_idProof} label="ID Proof" field="kyc_idProof" isEditing={editingSections.kyc} />
            <FileDisplay
              file={data.kyc_addressProof}
              label="Address Proof"
              field="kyc_addressProof"
              isEditing={editingSections.kyc}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="text-purple-600" size={24} />
            <CardTitle>Legal Documents</CardTitle>
          </div>
          {!editingSections.legal ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit("legal")}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCancel("legal")}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave("legal")}>
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FileDisplay
              file={data.registrationCertificate}
              label="Registration Certificate"
              field="registrationCertificate"
              isEditing={editingSections.legal}
            />
            <FileDisplay
              file={data.safetyCertificate}
              label="Safety Certificate"
              field="safetyCertificate"
              isEditing={editingSections.legal}
            />
            <FileDisplay file={data.license} label="License" field="license" isEditing={editingSections.legal} />
            <FileDisplay file={data.insurance} label="Insurance" field="insurance" isEditing={editingSections.legal} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

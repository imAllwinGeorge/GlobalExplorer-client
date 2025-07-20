"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ImageOffIcon, UploadCloudIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import Input from "../Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import type { Host, User } from "../../../shared/types/global"


// Define interfaces for different profile types
interface AdminProfile {
  email: string
  password?: string // Password is optional for display, but required for update
}

// Union type for all possible profile data
type ProfileData = AdminProfile | User | Host

interface ProfilePageProps {
  role: "admin" | "user" | "host"
  initialData: ProfileData
  onEdit:(data: object) => Promise<void>
}
interface NewImgFields {
  kyc_idProof?: File;
  Kyc_addressProof?: File;
  kyc_panCard?: File;
  registrationCertificate?:File;
  safetyCertificate?: File;
  license?: File;
  insurance?: File;
}

const fieldVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
}

// --- ImageUploadField Component (nested within this file) ---
interface ImageUploadFieldProps {
  id: string
  label: string
  currentImageUrl: string // The URL currently stored in the form data
  onChange: (id: string, value: File) => void // Callback to update the form data with the new URL
}

function ImageUploadField({ id, label, currentImageUrl, onChange }: ImageUploadFieldProps) {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  // const [tempUrl, setTempUrl] = useState("") // For direct URL input

  // Effect to create and revoke object URLs for file previews
  // useEffect(() => {
  //   if (selectedFile) {
  //     const url = URL.createObjectURL(selectedFile)
  //     setFilePreviewUrl(url)
  //     return () => {
  //       URL.revokeObjectURL(url)
  //     }
  //   }
  //   setFilePreviewUrl(null)
  // }, [selectedFile])

  // Reset internal state when currentImageUrl changes from parent (e.g., role switch)
  useEffect(() => {
    // setSelectedFile(null)
    setFilePreviewUrl(null)
    // setTempUrl("")
    setShowUrlInput(false)
  }, [currentImageUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // setSelectedFile(e.target.files[0])
      onChange(id, e.target.files[0])
      const url = URL.createObjectURL(e.target.files[0])
      setFilePreviewUrl(url)
      // Simulate upload and update parent state with a new URL (e.g., a placeholder)
      // In a real app, you'd upload the file and get a real URL back.
      // onChange(id, `/placeholder.svg?height=128&width=256&text=${label.replace(/\s/g, "+")}+Uploaded`)
      setShowUrlInput(false) // Hide URL input after file selection
    }
  }

  // const handleSaveUrl = () => {
  //   onChange(id, tempUrl)
  //   setShowUrlInput(false)
  //   setSelectedFile(null) // Clear any file preview if URL is manually saved
  // }

  // const handleDelete = () => {
    
  //   setSelectedFile(null)
  //   setFilePreviewUrl(null)
  //   setTempUrl("")
  //   setShowUrlInput(false)
  // }

  const handleUploadNew = () => {
    // setSelectedFile(null) // Clear any existing file selection
    setFilePreviewUrl(null)
    // setTempUrl("") // Clear temp URL when opening for new upload
    setShowUrlInput(true)
  }

  const displayImageSrc = filePreviewUrl || `${import.meta.env.VITE_IMG_URL}${currentImageUrl}` 

  return (
    <motion.div className="space-y-2" variants={fieldVariants}>
      <label htmlFor={id}>{label}</label>
      <AnimatePresence mode="wait">
        {(currentImageUrl || filePreviewUrl) && !showUrlInput ? (
          <motion.div
            key="image-preview"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fieldVariants}
            className="relative group"
          >
            <img
              src={displayImageSrc || "/placeholder.svg"}
              alt={label}
              className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=128&width=256&text=Image+Load+Error"
                e.currentTarget.alt = "Image not found or failed to load"
              }}
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
              {/* <Button type="button" variant="destructive" size="icon" onClick={handleDelete} aria-label={`Delete ${label}`}>
                <Trash2Icon className="h-5 w-5" />
              </Button> */}
              <Button type="button" variant="secondary" size="icon" onClick={handleUploadNew} aria-label={`Upload new ${label}`}>
                <UploadCloudIcon className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload-input"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fieldVariants}
            className="flex flex-col gap-2"
          >
            <Input id={id} type="file" onChange={handleFileChange} accept="image/*" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
             
              <Button type="button" variant="outline" onClick={() => setShowUrlInput(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!currentImageUrl && !filePreviewUrl && !showUrlInput && (
        <Button variant="outline" onClick={() => setShowUrlInput(true)} className="w-full">
          <UploadCloudIcon className="mr-2 h-4 w-4" /> Upload {label}
        </Button>
      )}
      {!currentImageUrl && !filePreviewUrl && !showUrlInput && (
        <div className="flex items-center justify-center h-32 w-full rounded-md border border-dashed text-muted-foreground">
          <ImageOffIcon className="h-8 w-8" />
        </div>
      )}
    </motion.div>
  )
}
// --- End ImageUploadField Component ---

export default function MyProfile({ role, initialData, onEdit }: ProfilePageProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [newImgFields, setNewImgFields] = useState<NewImgFields>({})

  // Reset formData when role changes to ensure correct initial data for the new role
  useEffect(() => {
    setFormData(initialData)
  }, [role, initialData])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }, [])

  // const handleDelete = useCallback((id: string) => {
  //   const {id: __unused, ...rest} = formData
  //   setFormData({...rest})
  // })

  // Handler for ImageUploadField
  const handleImageChange = useCallback((id: string, value: File) => {
    console.log(id, value)
    setNewImgFields((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    console.log(newImgFields)
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Saving profile data:", formData)

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if(typeof value === "string") {
        data.append(key, value);
      }
    })

    Object.entries(newImgFields).forEach(([key, file]) => {
      if(file instanceof File) {
        data.append(key, file);
      }
    })

    await onEdit(data);

    setIsSaving(false)
    // alert("Profile updated successfully!")
  }

  const renderFields = () => {
    switch (role) {
      case "admin":{
        const adminData = formData as AdminProfile
        return (
          <>
            <motion.div key="admin-email" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" value={adminData.email} onChange={handleChange} required />
            </motion.div>
            <motion.div key="admin-password" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="password">Password</label>
              <Input id="password" type="password" value={adminData.password || ""} onChange={handleChange} />
            </motion.div>
          </>
        )}
      case "user":{
        const userData = formData as User
        return (
          <>
            <motion.div
              key="user-name-fields"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={fieldVariants}
            >
              <div className="space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input id="firstName" type="text" value={userData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName">Last Name</label>
                <Input id="lastName" type="text" value={userData.lastName} onChange={handleChange} required />
              </div>
            </motion.div>
            <motion.div key="user-email" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" value={userData.email} onChange={handleChange} required />
            </motion.div>
            <motion.div key="user-phone" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <Input id="phoneNumber" type="tel" value={userData.phoneNumber} onChange={handleChange} required />
            </motion.div>
            {/* <motion.div key="user-password" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="password">Password</label>
              <Input id="password" type="password" value={userData.password || ""} onChange={handleChange} />
            </motion.div> */}
          </>
        )}
      case "host":{
        const hostData = formData as Host
        return (
          <>
            <motion.div
              key="host-name-fields"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={fieldVariants}
            >
              <div className="space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input id="firstName" type="text" value={hostData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName">Last Name</label>
                <Input id="lastName" type="text" value={hostData.lastName} onChange={handleChange} required />
              </div>
            </motion.div>
            <motion.div key="host-email" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" value={hostData.email} onChange={handleChange} required />
            </motion.div>
            <motion.div key="host-phone" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <Input id="phoneNumber" type="tel" value={hostData.phoneNumber} onChange={handleChange} required />
            </motion.div>
            {/* <motion.div key="host-password" className="space-y-2" variants={fieldVariants}>
              <label htmlFor="password">Password</label>
              <Input id="password" type="password" value={hostData.password || ""} onChange={handleChange} />
            </motion.div> */}

            <h3 className="text-lg font-semibold mt-6 border-b pb-2">KYC Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ImageUploadField
                id="kyc_idProof"
                label="KYC ID Proof"
                currentImageUrl={hostData.kyc_idProof || ""}
                onChange={handleImageChange}
              />
              <ImageUploadField
                id="kyc_addressProof"
                label="KYC Address Proof"
                currentImageUrl={hostData.kyc_addressProof || ""}
                onChange={handleImageChange}
              />
              <ImageUploadField
                id="kyc_panCard"
                label="KYC Pan Card"
                currentImageUrl={hostData.kyc_panCard || ""}
                onChange={handleImageChange}
              />
            </div>

            <h3 className="text-lg font-semibold mt-6 border-b pb-2">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="accountNumber">Account Number</label>
                <Input id="accountNumber" type="text" value={hostData.accountNumber} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="accountHolderName">Account Holder Name</label>
                <Input
                  id="accountHolderName"
                  type="text"
                  value={hostData.accountHolderName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="branch">Branch</label>
                <Input id="branch" type="text" value={hostData.branch} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="ifsc">IFSC Code</label>
                <Input id="ifsc" type="text" value={hostData.ifsc} onChange={handleChange} required />
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 border-b pb-2">Certificates & Licenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ImageUploadField
                id="registrationCertificate"
                label="Registration Certificate"
                currentImageUrl={hostData.registrationCertificate || ""}
                onChange={handleImageChange}
              />
              <ImageUploadField
                id="safetyCertificate"
                label="Safety Certificate"
                currentImageUrl={hostData.safetyCertificate || ""}
                onChange={handleImageChange}
              />
              <ImageUploadField
                id="license"
                label="License"
                currentImageUrl={hostData.license || ""}
                onChange={handleImageChange}
              />
              <ImageUploadField
                id="insurance"
                label="Insurance"
                currentImageUrl={hostData.insurance || ""}
                onChange={handleImageChange}
              />
            </div>
          </>
        )}
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="capitalize">{role} Profile</CardTitle>
        <CardDescription>Manage your {role} account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">{renderFields()}</AnimatePresence>
          <CardFooter className="flex justify-end p-0 pt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

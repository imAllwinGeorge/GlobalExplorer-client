"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Shield,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { Host } from "../../../shared/types/global";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { adminService } from "../../../services/AdminService";
import ConfirmModal from "../../components/ReusableComponents/ConfirmModal";
import RejectionModal from "../../components/ReusableComponents/RejectionModal";

type NewStatus = {
  isVerified?: string,
  reasonForRejection?: string
  kyc_verified?: boolean
}

export default function AdminHostDetails() {
  const [data, setData] = useState({} as Host);
  const [status, setStatus] = useState({} as { newStatus: NewStatus; id: string, role: string });
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const location = useLocation();

  // const [errors, setErrors] = useState<HostSignupFormErrors>({})

  // const handleEdit = (section: keyof typeof editingSections) => {
  //   setEditingSections((prev) => ({
  //     ...prev,
  //     [section]: true,
  //   }))
  //   setErrors({})
  // }

  // const handleCancel = (section: keyof typeof editingSections) => {
  //   setEditingSections((prev) => ({
  //     ...prev,
  //     [section]: false,
  //   }))
  //   setData(initialData)
  //   setErrors({})
  // }

  // const handleSave = (section: keyof typeof editingSections) => {
  //   // Basic validation
  //   const newErrors: HostSignupFormErrors = {}

  //   if (section === "personal") {
  //     if (!data.firstName.trim()) newErrors.firstName = "First name is required"
  //     if (!data.lastName.trim()) newErrors.lastName = "Last name is required"
  //     if (!data.email.trim()) newErrors.email = "Email is required"
  //     if (!data.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
  //   }

  //   if (section === "bank") {
  //     if (!data.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required"
  //     if (!data.ifsc.trim()) newErrors.ifsc = "IFSC is required"
  //     if (!data.accountNumber.trim()) newErrors.accountNumber = "Account number is required"
  //     if (!data.branch.trim()) newErrors.branch = "Branch is required"
  //   }

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors)
  //     return
  //   }

  //   setEditingSections((prev) => ({
  //     ...prev,
  //     [section]: false,
  //   }))
  //   setErrors({})
  //   // onSave?.(data)

  // }

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Verified", value: "verify" },
    { label: "Rejected", value: "reject" },
  ];

  const handleStatusChange = (newStatus: NewStatus, id: string, role: string) => {
    setStatus({ newStatus, id, role });
    if(newStatus.isVerified === "reject"){
      setIsRejected(true);
    }else{
      setIsModelOpen(true)
    }
    
  };
  const handleStatus = async (statusObj = status) => {
    try {
      console.log(statusObj)
      const response = await adminService.updateStatus(statusObj.id, statusObj.newStatus, statusObj.role);
      console.log("host verifiction response ", response)
      if(response.status === 200) {
        toast.success("status updated!")
        setTriggerFetch(prev => !prev)
      }
    } catch (error) {
      console.log(error);
      if(error instanceof Error) {
        toast.error(error.message)
      }
    }
    finally{
      setIsModelOpen(false)
      setIsRejected(false)
    }
  }

  useEffect(() => {
    const fetchUser = async (id: string, role: string) => {
      try {
        const response = await adminService.getUserDetails(id, role);
        if (response && response.status === 200 && role === "host") {
          setData(response.data.user as Host); // type cast safely
        } else {
          toast.error("Invalid user data");
        }
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };
    fetchUser(location.state.id, location.state.role);
  }, [location.state.id, location.state.role, triggerFetch]);

  const FileDisplay = ({
    file,
    label,
  }: {
    file: string | null;
    label: string;
  }) => {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <FileText className="text-gray-500" size={20} />
          <div>
            <p className="font-medium text-sm">{label}</p>
            {file ? (
              <img
                src={`http://localhost:3000/uploads/images/${file}`}
                alt={label}
                className="w-32 h-32 object-cover border roounded-md"
              />
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
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Host Profile Details
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your registration information
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="text-blue-600" size={24} />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="text-green-600" size={24} />
            <CardTitle>Bank Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Account Holder Name</p>
              <p className="font-medium">
                {data.accountHolderName || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IFSC Code</p>
              <p className="font-medium">{data.ifsc || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Number</p>
              <p className="font-medium">
                {data.accountNumber
                  ? `****${data.accountNumber.slice(-4)}`
                  : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium">{data.branch || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="text-orange-600" size={24} />
            <CardTitle>KYC Documents</CardTitle>
            <Button className="bg-orange-400 font-bold" 
            onClick={() => {
              const newStatus = {kyc_verified: !data.kyc_verified}
              handleStatus({newStatus, id:data._id, role:data.role})
            }} >{data.kyc_verified?"Verified": "pending"}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FileDisplay file={data.kyc_panCard} label="PAN Card" />
            <FileDisplay file={data.kyc_idProof} label="ID Proof" />
            <FileDisplay file={data.kyc_addressProof} label="Address Proof" />
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FileDisplay
              file={data.registrationCertificate}
              label="Registration Certificate"
            />
            <FileDisplay
              file={data.safetyCertificate}
              label="Safety Certificate"
            />
            <FileDisplay file={data.license} label="License" />
            <FileDisplay file={data.insurance} label="Insurance" />
          </div>
        </CardContent>
      </Card>
      <div className="w-48">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          value={data.isVerified}
          onChange={(e) => handleStatusChange({isVerified:e.target.value}, data._id, data.role)}
          className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option disabled value="">
            Select Status
          </option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModelOpen(false)}
        onConfirm={handleStatus}
        title={"Verify Host Details"}
        message={`Are you sure you want to ${
          status.newStatus?.isVerified
        }?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="warning"
      />
      <RejectionModal isOpen={isRejected} onclose={() => setIsRejected(false)} 
      onConfirm={(message) => {
    const updatedStatus = {
      ...status,
      newStatus: {
        ...status.newStatus,
        reasonForRejection: message,
      },
    };

    handleStatus(updatedStatus); // ✅ Safely use the new data
  }} />
    </div>
  );
}

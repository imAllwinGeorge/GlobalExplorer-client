"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Input from "../../components/Input"
import type { AddCategoryError } from "../../../shared/types/auth.type"
import { isValidName } from "../../../shared/validation/validations"
import { adminService } from "../../../services/AdminService"
import type { Category } from "../../../shared/types/global"
import ConfirmModal from "../../components/ReusableComponents/ConfirmModal"
import toast from "react-hot-toast"
import { Pencil, Plus, X } from "lucide-react"

const CategoryPage = () => {
  const [data, setData] = useState({
    categoryName: "",
    description: "",
  })
  const [editData, setEditData] = useState({
    categoryName: "",
    description: " "
  })
  const [category, setCategory] = useState<Category[] | null>(null)
  const [error, setError] = useState<AddCategoryError>({})
  const [triggerFetch, setTriggerFetch] = useState(true)
  const [isModalOpen, setIsModelOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [openEditModal, setOpenEditModal] = useState(false)

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [key]: e.target.value })
  }

  const handleEditChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({...editData, [key]: e.target.value})
  }

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const errors: AddCategoryError = {}
    if (!isValidName(data.categoryName)) {
      errors.categoryName = "category Name can only contain alphabets"
    } else if (!data.description.trim()) {
      errors.description = "This field cannot be empty"
    }
    if (Object.keys(errors).length > 0) {
      return setError(errors)
    }
    try {
      const response = await adminService.addCategory(data)
      if (response.status === 201) {
        setTriggerFetch((prev) => !prev)
        setData({ categoryName: "", description: "" })
        setError({})
        toast.success("Success. Category Added")
      }
    } catch (error) {
      console.log(error)
    }
  }

  interface CategoryResponse {
    category: Category[]
  }

  const handleCategoryState = async () => {
    if (!selectedCategory) return
    const toastId = toast.loading("Loading....")
    try {
      const response = await adminService.updateCategoryStatus(
        {_id:selectedCategory?._id,
        value: { isActive: !selectedCategory?.isActive }}
        
      )
      if (response.status === 200) {
        toast.dismiss(toastId)
        toast.success(`Category ${!selectedCategory.isActive ? "activated" : "deactivated"}`)
        setSelectedCategory(null)
        setTriggerFetch((prev) => !prev)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const editCategory = async () => {
    if (!editData || !selectedCategory) return
    console.log("sghiwghwsghhsgjksdhgkhasklghjklasdhgjklvasdjklfgjklsdhgjkhasdkjfg",editData)
    try {
      const response = await adminService.editCategory({_id: selectedCategory._id, value: {categoryName: editData.categoryName, description: editData.description}})
      if (response.status === 200) {
        setTriggerFetch((prev) => !prev)
        setOpenEditModal(false)
        setData({ categoryName: "", description: "" })
        setSelectedCategory(null)
        toast.success("Category Edited successfully...")
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await adminService.getCategories()
        if (response.status === 200) {
          const data = response.data as CategoryResponse
          setCategory(data.category)
        }
      } catch (error) {
        console.log(error)
        if(error instanceof Error){
          toast.error(error.message)
        }
      }
    }
    fetchCategory()
  }, [triggerFetch])

  useEffect(() => {
    if (selectedCategory && openEditModal) {
      setData({
        categoryName: selectedCategory.categoryName,
        description: selectedCategory.description,
      })
    }
  }, [selectedCategory, openEditModal])

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Add Category Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Add Category
            </h1>
          </div>

          <div className="p-6">
            <form className="space-y-6">
              {/* Category Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <div className="relative">
                  <Input
                    id="categoryName"
                    type="text"
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={data.categoryName}
                    onChange={handleChange("categoryName")}
                  />
                </div>
                <AnimatePresence>
                  {error.categoryName && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm"
                    >
                      {error.categoryName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="relative">
                  <Input
                    id="description"
                    type="text"
                    placeholder="Enter category description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={data.description}
                    onChange={handleChange("description")}
                  />
                </div>
                <AnimatePresence>
                  {error.description && (
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm"
                    >
                      {error.description}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Add Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={submitForm}
                disabled={!data.categoryName || !data.description}
                className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                Add Category
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Categories Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Category Details</h1>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-orange-50 border-b border-orange-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">Category Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {category &&
                    category.map((cate, index) => (
                      <motion.tr
                        key={cate._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <td className="px-6 py-4 text-gray-900 font-medium">{index + 1}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{cate.categoryName}</td>
                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{cate.description}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                cate.isActive
                                  ? "bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50"
                                  : "bg-gradient-to-r from-orange-400 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                              }`}
                              onClick={() => {
                                setIsModelOpen(true)
                                setSelectedCategory(cate)
                              }}
                            >
                              {cate.isActive ? "Deactivate" : "Activate"}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-white text-orange-700 border-2 border-orange-500 hover:bg-orange-50 flex items-center justify-center"
                              onClick={() => {
                                setSelectedCategory(cate)
                                setOpenEditModal(true)
                                setEditData(cate);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {openEditModal && selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Edit Category</h1>
                <button
                  onClick={() => {
                    setOpenEditModal(false)
                    setSelectedCategory(null)
                    setData({ categoryName: "", description: "" })
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form className="space-y-6">
                  {/* Category Name */}
                  <div className="space-y-2">
                    <label htmlFor="editCategoryName" className="text-sm font-medium text-gray-700">
                      Category Name
                    </label>
                    <div className="relative">
                      <Input
                        id="editCategoryName"
                        type="text"
                        placeholder="Category Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        value={editData.categoryName}
                        onChange={handleEditChange("categoryName")}
                      />
                    </div>
                    <AnimatePresence>
                      {error.categoryName && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm"
                        >
                          {error.categoryName}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="editDescription" className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="relative">
                      <Input
                        id="editDescription"
                        type="text"
                        placeholder="Description"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        value={editData.description}
                        onChange={handleEditChange("description")}
                      />
                    </div>
                    <AnimatePresence>
                      {error.description && (
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm"
                        >
                          {error.description}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setOpenEditModal(false)
                        setSelectedCategory(null)
                        setData({ categoryName: "", description: "" })
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={editCategory}
                      disabled={!data.categoryName || !data.description}
                      className="flex-1 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      Update
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModelOpen(false)}
        onConfirm={handleCategoryState}
        title={`${selectedCategory?.isActive ? "Deactivate" : "Activate"} Category`}
        message={`Are you sure you want to ${
          selectedCategory?.isActive ? "Deactivate" : "Activate"
        } ${selectedCategory?.categoryName}?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  )
}

export default CategoryPage

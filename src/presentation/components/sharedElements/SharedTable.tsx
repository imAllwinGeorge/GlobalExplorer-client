"use client"

import { motion } from "framer-motion"
import type React from "react"

type ReusableTableProps<T, ExtraColumn extends string = never> = {
  data: T[]
  columns: (keyof T | ExtraColumn)[]
  columnHeaders: Partial<Record<keyof T | ExtraColumn, string>>
  renderCell?: (col: keyof T | ExtraColumn, row: T) => React.ReactNode
  title?: string
}

const ReusableTable = <T, ExtraColumn extends string = never>({
  data,
  columns,
  columnHeaders,
  renderCell,
  title,
}: ReusableTableProps<T, ExtraColumn>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {title && (
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-bold text-amber-700 mb-6"
        >
          {title}
        </motion.h2>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-amber-50 border-b border-amber-100">
              {columns.map((col, index) => (
                <motion.th
                  key={String(col)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-6 py-4 text-left text-sm font-semibold text-amber-700 uppercase tracking-wider"
                >
                  {columnHeaders[col]}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                className={`hover:bg-amber-25 transition-colors duration-200 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-amber-25"
                }`}
              >
                {columns.map((col) => (
                  <td key={String(col)} className="px-6 py-4 text-sm text-gray-900">
                    {renderCell ? renderCell(col, row) : String(row[col as keyof T])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            {columns.map((col) => (
              <div
                key={String(col)}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-amber-700">{columnHeaders[col]}:</span>
                <span className="text-sm text-gray-900 text-right max-w-[60%]">
                  {renderCell ? renderCell(col, row) : String(row[col as keyof T])}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ReusableTable

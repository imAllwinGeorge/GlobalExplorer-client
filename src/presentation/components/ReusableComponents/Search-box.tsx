"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Input from "../Input"

interface SearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
  debounceMs?: number
}

export default function SearchBox({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
  debounceMs = 500,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 py-2 w-full"
      />
    </div>
  )
}

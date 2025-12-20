import { useState, useEffect, useRef } from "react"
import { useImageStore } from "@/store/imageStore";

const SearchImageByname = () => {
  const { searcbyname, isFetchingImages, images, suggestions, fetchSuggestions, clearSuggestions, isFetchingSuggestions } = useImageStore()
  const [quary, setQuary] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Debounced suggestion fetching
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!quary || quary.trim() === "") {
      clearSuggestions()
      setShowSuggestions(false)
      return
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(quary)
      setShowSuggestions(true)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [quary, fetchSuggestions, clearSuggestions])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handelInputChange = (e) => {
    const value = e.target.value
    setQuary(value)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuary(suggestion.name)
    setShowSuggestions(false)
    searcbyname(suggestion.name)
  }

  const handelsearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    searcbyname(quary)
  }

  return (
    <div className="w-full">
      <div ref={searchRef} className="relative">
        <form onSubmit={handelsearch} className="border p-2 rounded w-full flex gap-2">
          <input
            type="text"
            value={quary}
            onChange={handelInputChange}
            onFocus={() => quary && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="enter the image name"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={isFetchingImages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingImages ? "Searching..." : "Search"}
          </button>
        </form>

        {/* suggestion dropdown */}
        {showSuggestions && (
          <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-auto">
            {isFetchingSuggestions ? (
              <div className="p-3 text-center text-gray-500">Loading suggestions...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((img) => (
                <div
                  key={img._id}
                  onClick={() => handleSuggestionClick(img)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <p className="text-sm font-medium">{img.name}</p>
                  {img.addedby?.name && (
                    <p className="text-xs text-gray-500">by {img.addedby.name}</p>
                  )}
                </div>
              ))
            ) : quary.trim() !== "" ? (
              <div className="p-3 text-center text-gray-500">No suggestions found</div>
            ) : null}
          </div>
        )}
      </div>
      {isFetchingImages && (
        <p className="text-center mt-4">Loading Images...</p>
      )}

      {!isFetchingImages && images.length === 0 && quary && (
        <p className="text-center mt-4">No images found</p>
      )}

      {!isFetchingImages && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {images.map((img) => (
            <div key={img._id} className="border rounded overflow-hidden">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <p className="text-sm font-medium truncate">{img.name}</p>
                <p className="text-xs text-gray-500">
                  by {img.addedby?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchImageByname
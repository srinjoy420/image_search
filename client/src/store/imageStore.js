import { axiosInstance } from "@/lib/axios"
import { create } from "zustand"
import toast from "react-hot-toast"





export const useImageStore = create((set, get) => ({
    images: [],
    isLoadingImages: false,
    isFetchingImages: false,
    isFetchingSuggestions: false,
    error: null,
    suggestions: [],

    clearError: () => set({ error: null }),

    clearSuggestions: () => set({ suggestions: [] }),

    uploadImage: async ({ imageBase64, name }) => {
        set({ isLoadingImages: true, error: null })
        try {
            const res = await axiosInstance.post("/api/image/upload", {
                url: imageBase64,
                name
            })
            if (res.data.success) {
                set((state) => ({
                    images: [res.data.data, ...state.images],
                    error: null,
                }))
                toast.success("Image uploaded succesfully")
                return { success: true, image: res.data.data }

            }
            else {
                set({ error: res.data.message })
                toast.error(res.data.message || "there is a problem in uploading a image")
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
            console.log("❌ image uploading failed:", errorMessage || error.message);

            set({ error: errorMessage || "uploading error image" })
        }
        finally {
            set({ isLoadingImages: false })
        }

    },

    fetchingallImages: async () => {
        set({ isFetchingImages: true, error: null })
        try {
            const res = await axiosInstance.get("/api/image/getall")
            if (res.data.success) {
                set({ images: res.data.data, error: null })
            }
            else {
                set({ error: res.data.message })

            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
            console.log("❌ image fetching failed:", errorMessage || error.message);

            set({ error: errorMessage || "fetching error image" })

        }
        finally {
            set({ isFetchingImages: false })

        }

    },

    fetchSuggestions: async (name) => {
        if (!name || !name.trim()) {
            set({ suggestions: [], isFetchingSuggestions: false })
            return
        }
        set({ isFetchingSuggestions: true, error: null })
        try {
            const res = await axiosInstance.get(`/api/image/search?name=${name}`)
            if (res.data.success) {
                set({ suggestions: res.data.data, error: null })
            }
            else {
                set({ suggestions: [], error: res.data.message })
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
            console.log("❌ suggestions fetching failed:", errorMessage || error.message);
            set({ suggestions: [], error: errorMessage || "suggestions fetching error" })
        }
        finally {
            set({ isFetchingSuggestions: false })
        }
    },
    searcbyname: async (name) => {
        if (!name || !name.trim()) {
            set({ images: [], error: null, isFetchingImages: false })
            return
        }
        set({ isFetchingImages: true, error: null })
        try {
            const res = await axiosInstance.get(`/api/image/search?name=${name}`)
            if (res.data.success) {
                set({ images: res.data.data, error: null })

            }
            else {
                set({ error: res.data.message })

            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
            console.log("❌ image fetching failed:", errorMessage || error.message);

            set({ error: errorMessage || "image fetching error" })

        }
        finally {
            set({ isFetchingImages: false })
        }

    }
}))

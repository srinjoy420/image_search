import { axiosInstance } from "@/lib/axios"
import { create } from "zustand"
import toast from "react-hot-toast"


export const useImageStore = create((set, get) => ({
    images: [],
    isLoadingImages: false,
    isFetchingImages: false,
    error: null,

    clearError: () => set({ error: null }),

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

    }
}))

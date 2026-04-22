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

    uploadImage: async ({ file, name }) => {
        set({ isLoadingImages: true, error: null })
        try {
            const fromData=new FormData()
            fromData.append("image",file)
            fromData.append("name",name)

            // upload image to cloudinary
            const res=await axiosInstance.post("/api/image/upload",fromData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            if(res.data.success){
                set({images:[res.data.data,...state.images]})
            }
            toast.success("Image uploaded successfully")
        } catch (error) {
            console.log("error to upload image in cloudenary");
            set({error:"Image uploading error"})
            toast.error("Image uploading error")
            
            
        }
        finally{
            set({isLoadingImages:false})
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

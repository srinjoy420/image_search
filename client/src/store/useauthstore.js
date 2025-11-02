import { axiosInstance } from "@/lib/axios"
import { create } from "zustand"
import toast from "react-hot-toast";
import { error } from "console";


export const useauthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    error: null,

    clearError: () => set({ error: null }),

    checkauth: async () => {
        set({ isCheckingAuth: true, error: null })
        try {
            const res = await axiosInstance.get("/api/auth/checkauth")
            if (res.data.success) {
                set({ authUser: res.data.user, error: null })
            } else {
                set({ authUser: null, error: res.data.message })
            }



        } catch (error) {
            console.log("❌ Authentication check failed:", error.response?.data?.message || error.message);
            set({
                authUser: null,
                error: error.response?.data?.message || "Authentication failed"
            });

        }
        finally {
            set({ isCheckingAuth: false });
        }
    },
    // singup method
    singUp: async (data) => {
        set({ isSigningUp: true, error: null })
        try {
            const res = await axiosInstance.post("/api/auth/signup", data)
            if (res.data.success) {
                set({ authUser: res.data.user, error: null });
                toast.success("Account created succesfully")
                console.log("user registered succesfully", res.data.user);
                return { success: true, user: res.data.user };
            }
            else {
                set({ error: res.data.message });
                return { success: false, error: res.data.message };
                return
            }


        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed";
            set({ error: errorMessage });
            console.log("❌ Signup failed:", errorMessage);
            toast.error(errorMessage)
            return { success: false, error: errorMessage };

        }
        finally{
            set({ isSigningUp: false });
        }

    }
}))

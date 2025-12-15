import { axiosInstance } from "@/lib/axios"
import { create } from "zustand"
import toast from "react-hot-toast";




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
                // Now matches signup/login structure: res.data.data.user
                set({ authUser: res.data.data.user, error: null })
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
                // Fix: Access user from res.data.data.user (not res.data.user)
                set({ authUser: res.data.data.user, error: null });
                toast.success("Account created succesfully")
                console.log("user registered succesfully", res.data.data.user);
                return { success: true, user: res.data.data.user };
            }
            else {
                set({ error: res.data.message });
                return { success: false, error: res.data.message };
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
    },
    // loggin method
    login:async(data)=>{
        set({isLoggingIn:true,error:null})
        try {
            const res=await axiosInstance.post("/api/auth/login",data)
            if(res.data.success){
                set({authUser:res.data.data.user,error:null})
                toast.success("Logged in succesfully")
                console.log("user loggrdin succesfully", res.data.data.user);
                return {success:true,user:res.data.data.user}
            }
            else{
                set({ error: res.data.message });
                return { success: false, error: res.data.message };
            }
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Signup failed";
            set({ error: errorMessage });
            console.log("❌ Signup failed:", errorMessage);
            toast.error(errorMessage)
            return { success: false, error: errorMessage };
            
        }
        finally{
            set({isLoggingIn:false})
        }

    },

    // logout method
    logout:async()=>{
        try {
            await axiosInstance.get("/api/auth/logout")
            set({authUser:null,error:null})
            console.log("user log out succefully");
            
        } catch (error) {
            console.log("❌ Logout error:", error.response?.message || error.message);
              set({authUser:null,error:null})
            
        }
    }

}))

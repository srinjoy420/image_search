import React, { useState } from 'react'

import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";
import { useauthStore } from '@/store/useauthstore';

const SingupPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const { isSigningUp, singUp } = useauthStore()
  const navigate = useNavigate()

  const handelSubmit = async (e) => {
    e.preventDefault()
    const res=await singUp(formData)
    if(res.success){
      navigate("/")
    }
  }
  return (
    <div className='w-full flex items-center justify-center p-4'>
      <Card className="w-full max-w-sm shadow-lg">
        {/* the card header */}
        <CardHeader>
          <div>
            <h1 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Welcome to Images community
            </h1>
          </div>
          <CardTitle className="text-center">Create your account</CardTitle>
          <CardDescription className="text-center">Enter your details to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handelSubmit} className="space-y-6">
            {/* Name field */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                className="focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your name"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email field */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                className="focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your email"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password field */}
            <div className="grid gap-2 relative">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                className="pr-10 focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your password"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-cyan-500 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
              </button>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderIcon className="animate-spin" size={18} /> Signing up...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Go to login page
                  </Link>
                </div>
        </CardContent>


      </Card>

    </div>
  )
}

export default SingupPage
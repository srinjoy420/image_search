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
import { id } from 'zod/v4/locales';

const LoginPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  const { isLoggingIn, login } = useauthStore()
  const navigate = useNavigate()

  const handelsubmit = async (e) => {
    e.preventDefault()
    const res=await login(formData)
    if(res.success){
      navigate("/")
    }
  }
  return (
    <div className='w-full flex items-center justify-center p-4'>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <div>
            <h1 className="text-xl font-semibold text-center text-gray-800 mb-2">
              Welcome to Images community
            </h1>
          </div>
          <CardTitle className="text-center">login to your account</CardTitle>
          <CardDescription className="text-center">Enter your login details to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handelsubmit}>
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

            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderIcon className="animate-spin" size={18} /> Signing up...
                </span>
              ) : (
                "login to Account"
              )}
            </Button>

          </form>
          <div className="mt-6 text-center">
            <Link to="/singup" className="auth-link">
              don't have an account? Go to singuop page
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default LoginPage
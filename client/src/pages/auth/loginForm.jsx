'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { LOGIN_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const LoginForm = () => {
  const navigate = useNavigate()
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validateLogin = () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return false
    }
    if (!email) {
      toast.error("Email is required")
      return false
    }
    return true
  }

  const handleSubmit = async(e, email, password) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, {  email, password },{withCredentials:true});
        console.log(response);
        if(response.data.user.id){
          setUserInfo(response.data.user);
          if(response.data.user.profileSetup){
            navigate("/chat");
          }
          else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  }

    return (
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={(e) => { handleSubmit(e, email, password) }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 transition-all duration-300 mt-6"
        >
          Login
        </Button>
      </motion.form>
    )
  }

  export default LoginForm


'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'

import {apiClient} from '@/lib/api-client'
import { SIGNUP_ROUTE } from '@/utils/constants'
import { useAppStore } from '@/store'

const SignupForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const {setUserInfo} = useAppStore();
  // const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  // useEffect(() => {
  //   const checkUsernameAvailability = async () => {
  //     if (name) {
  //       try {
  //         const response = await axios.get(`/api/check-username?username=${name}`);
  //         setIsUsernameAvailable(response.data.isAvailable);
  //       } catch (error) {
  //         console.error('Error checking username availability', error);
  //       }
  //     }
  //   };

  //   const delayDebounceFn = setTimeout(() => {
  //     checkUsernameAvailability();
  //   }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [name]);


  const validateSignup = () => {
    if(password != confirmPassword){
      toast.error("Passwords do not match");
      return false;
    }
    if(password.length < 6){
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if(username.length<4){
      toast.error("Username is required");
      return false;
    }
    return true;
  }
  const handleSubmit = async (e,username,email,password) => {
    e.preventDefault(); 
    if(validateSignup()){
      try{
      const response = await apiClient.post(SIGNUP_ROUTE,{username,email,password},{withCredentials:true});
      console.log(response);
      if(response.status === 201){
        setUserInfo(response.data.user);
        navigate("/profile")
      }
      }catch (error) {
        console.error("Error during signup:", error);
      }
    }
    
    // console.log('Signup:', { username, email, password })
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={(e)=>{  handleSubmit(e,username,email,password)}}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-medium">UserName</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="pl-10"
          />
          {/* {!isUsernameAvailable && <p className="text-red-500 text-sm">Username is already taken</p>} */}
        </div>
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="password" className="text-base font-medium">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            id="confirm password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full h-11 bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 transition-all duration-300 mt-6"
      >
        Sign Up
      </Button>
    </motion.form>
  )
}

export default SignupForm


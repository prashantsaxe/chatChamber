'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from './loginForm'
import SignupForm from './signupForm'
import login2 from '../../assets/login2.png'

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Form Section */}
            <div className="p-6  font-sans">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-red-500 text-transparent bg-clip-text mb-6"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className='flex justify-center'>ChatChamber</div>
                <div className='text-sm flex justify-center font-thin'> an end to end encrypted chatting app  </div>
                
              </motion.h1>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login" className="text-lg font-medium">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="text-lg font-medium">Sign Up</TabsTrigger>
                </TabsList>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="login">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="signup">
                    <SignupForm />
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>

            {/* Image Section */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 translate-x-11 " />
              <img
                src={login2}
                alt="Character Illustration"
                width={200}
                height={400}
                className="  w-full h-full"
                
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Auth

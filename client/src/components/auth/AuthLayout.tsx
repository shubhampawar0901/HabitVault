import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: 'login' | 'register';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  type
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Text content */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/[0.1] via-transparent to-violet-200/[0.1] blur-3xl"></div>

        {/* Decorative elements */}
        <div className="absolute top-[15%] left-[-5%] w-[300px] h-[100px] bg-gradient-to-r from-blue-400/[0.2] to-transparent rounded-full transform rotate-12 blur-2xl"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[250px] h-[80px] bg-gradient-to-r from-violet-400/[0.2] to-transparent rounded-full transform -rotate-12 blur-2xl"></div>
        <div className="absolute top-[60%] left-[10%] w-[150px] h-[150px] bg-gradient-to-r from-blue-300/[0.2] to-transparent rounded-full blur-2xl"></div>

        <div className="flex flex-col justify-center px-12 py-8 relative z-10 w-full">
          {/* Logo */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white h-10 w-10 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                    fill="white"
                  />
                  <path d="M16 10.8L14.8 9.6L11 13.4L9.2 11.6L8 12.8L11 15.8L16 10.8Z" fill="white" />
                  <path d="M11 7H13V9H11V7Z" fill="white" />
                  <path d="M7 11H9V13H7V11Z" fill="white" />
                  <path d="M15 11H17V13H15V11Z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                HabitVault
              </span>
            </div>
          </motion.div>

          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/[0.5] border border-blue-200/[0.5] mb-6 w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm text-blue-600 tracking-wide font-medium">
              {type === 'login' ? 'Welcome Back' : 'Join Us Today'}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-blue-800">
              {type === 'login' ? 'Sign In' : 'Sign Up'}
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500">
              {type === 'login' ? 'To Your Account' : 'For Free Access'}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 mb-8 font-medium max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            HabitVault helps you build lasting habits with a minimalist, distraction-free approach. Track your daily
            progress, visualize your consistency, and achieve your goals one day at a time.
          </motion.p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Back to Home Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </motion.div>

          <div className="text-center mb-10">
            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

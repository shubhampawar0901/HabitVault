import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-blue-200/[0.3]",
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className || "")}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
          filter: [
            "drop-shadow(0 10px 15px rgba(59, 130, 246, 0.3))",
            "drop-shadow(0 20px 30px rgba(59, 130, 246, 0.5))",
            "drop-shadow(0 10px 15px rgba(59, 130, 246, 0.3))",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-blue-200/[0.3]",
            "shadow-[0_10px_50px_0_rgba(59,130,246,0.4)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

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
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-50 to-violet-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/[0.1] via-transparent to-violet-200/[0.1] blur-3xl" />

        {/* Animated shapes from HeroGeometric */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-blue-400/[0.25]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />

          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-violet-400/[0.25]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />

          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-blue-300/[0.25]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />

          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-violet-300/[0.25]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />

          <ElegantShape
            delay={0.7}
            width={150}
            height={40}
            rotate={-25}
            gradient="from-blue-300/[0.25]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        <div className="flex flex-col justify-center items-center text-center h-full px-12 py-8 relative z-10 w-full">
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
            <Circle className="h-2 w-2 fill-blue-500" />
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

        {/* Subtle overlay at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-50 via-transparent to-blue-50/80 pointer-events-none" />
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

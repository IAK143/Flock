import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle2, CircleDashed } from 'lucide-react';
import { cn } from './AppLayout';

export const ActivePrompt: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((180 - timeLeft) / 180) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-soft-lg relative overflow-hidden"
    >
      {/* Background Pulse Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse-slow" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              LIVE SESSION
            </span>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 leading-tight">
              What are you up to right now?
            </h2>
          </div>

          {/* Countdown Ring */}
          <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={cn(
                  "transition-all duration-1000 ease-linear",
                  timeLeft < 30 ? "text-red-500" : "text-accent"
                )}
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className="text-[10px] font-medium text-gray-500 flex items-center gap-0.5">
                  {formatTime(timeLeft)}
               </span>
            </div>
          </div>
        </div>

        {/* Participation Progress */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-5">
          <div className="flex -space-x-3">
            {/* Posted */}
            <div className="relative z-30">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704a" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="User 1" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                 <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
            </div>
            <div className="relative z-20">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704b" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="User 2" />
               <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                 <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </div>
            </div>

            {/* Uploading / Typing */}
            <div className="relative z-10 w-10 h-10 rounded-full border-2 border-white bg-gray-50 shadow-sm flex items-center justify-center">
               <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
               </span>
               <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                 <CircleDashed className="w-3.5 h-3.5 text-accent animate-spin-slow" />
              </div>
            </div>

             {/* Missing */}
             <div className="relative z-0 w-10 h-10 rounded-full border-2 border-dashed border-gray-200 bg-transparent flex items-center justify-center">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704c" className="w-full h-full rounded-full opacity-40 grayscale" alt="Missing User" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">2/4 Posted</p>
            <p className="text-xs text-gray-500">Night Owls Flock</p>
          </div>
        </div>

        <button className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl py-3.5 font-medium transition-colors shadow-soft flex items-center justify-center gap-2">
           <Camera className="w-5 h-5" />
           Share Moment
        </button>
      </div>
    </motion.div>
  );
};

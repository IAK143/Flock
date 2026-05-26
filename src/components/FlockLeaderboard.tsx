import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, TrendingUp, Share } from 'lucide-react';

export const FlockLeaderboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-3xl p-6 text-white shadow-float relative overflow-hidden"
    >
      {/* Cinematic Gradient Overlays */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-gray-400 text-xs font-medium tracking-widest uppercase mb-1">Global Rank</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold">#12</span>
              <span className="text-green-400 text-sm font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +3
              </span>
            </div>
          </div>

          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors">
            <Share className="w-4 h-4 text-white/80" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl font-semibold mb-0.5">Night Owls</h2>
              <p className="text-white/60 text-xs">4 Members • Top 5%</p>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Weekly XP</span>
                <span className="font-medium flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  12.4k
                </span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Streak</span>
                <span className="font-medium flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-accent" />
                  14 Days
                </span>
              </div>
            </div>
          </div>

          {/* Group Energy Indicator (Visualized as a smooth gauge/ring) */}
          <div className="relative w-20 h-20">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
               {/* Background Track */}
              <path
                className="text-white/10"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Energy Level */}
              <path
                className="text-accent"
                strokeWidth="4"
                strokeDasharray="85, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold">85%</span>
              <span className="text-[8px] text-white/60 uppercase tracking-wide">Energy</span>
            </div>
          </div>
        </div>

        {/* Visual representation of member avatars in the card */}
        <div className="mt-6 flex -space-x-2">
           {[1,2,3,4].map((i) => (
             <img key={i} src={`https://i.pravatar.cc/150?u=a042581f4e29026704${i}`} className="w-8 h-8 rounded-full border border-white/20 object-cover opacity-80" alt={`Member ${i}`} />
           ))}
        </div>
      </div>
    </motion.div>
  );
};

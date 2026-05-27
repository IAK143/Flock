import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, TrendingUp, TrendingDown, Share } from 'lucide-react';

export interface LeaderboardStats {
  rank: number;
  rankChange: number;
  flockName: string;
  memberCount: number;
  percentile: number;
  weeklyXp: number; // e.g. 12400
  streak: number;
  energyPercent: number;
  members: { id: string; avatar: string }[];
}

interface FlockLeaderboardProps {
  stats: LeaderboardStats;
}

export const FlockLeaderboard: React.FC<FlockLeaderboardProps> = ({ stats }) => {
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
              <span className="font-serif text-4xl font-bold">#{stats.rank}</span>
              {stats.rankChange !== 0 && (
                <span className={`text-sm font-medium flex items-center ${stats.rankChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.rankChange > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(stats.rankChange)}
                </span>
              )}
            </div>
          </div>

          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors">
            <Share className="w-4 h-4 text-white/80" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl font-semibold mb-0.5">{stats.flockName}</h2>
              <p className="text-white/60 text-xs">{stats.memberCount} Members • Top {stats.percentile}%</p>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Weekly XP</span>
                <span className="font-medium flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  {(stats.weeklyXp / 1000).toFixed(1)}k
                </span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Streak</span>
                <span className="font-medium flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-accent" />
                  {stats.streak} Days
                </span>
              </div>
            </div>
          </div>

          {/* Group Energy Indicator */}
          <div className="relative w-20 h-20 shrink-0 ml-2">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent transition-all duration-1000 ease-out"
                strokeWidth="4"
                strokeDasharray={`${stats.energyPercent}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold">{Math.round(stats.energyPercent)}%</span>
              <span className="text-[8px] text-white/60 uppercase tracking-wide">Energy</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex -space-x-2">
           {stats.members.map((member, i) => (
             <img key={member.id} src={member.avatar} className="w-8 h-8 rounded-full border border-white/20 object-cover opacity-80" alt={`Member ${i}`} style={{ zIndex: 10 - i }} />
           ))}
        </div>
      </div>
    </motion.div>
  );
};

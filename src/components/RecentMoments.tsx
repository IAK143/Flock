import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';

export interface Moment {
  id: string;
  user: string;
  avatar: string;
  image: string;
  timestamp: number; // created at
  expiresAt: number; // when it disappears (usually timestamp + 22h)
  reactions: number;
}

interface RecentMomentsProps {
  moments: Moment[];
}

export const RecentMoments: React.FC<RecentMomentsProps> = ({ moments }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Update the "now" state every minute to refresh relative times and progress bars
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (timestamp: number) => {
    const diffMins = Math.floor((now - timestamp) / 60000);
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  const getTimeLeftPct = (timestamp: number, expiresAt: number) => {
    const totalDuration = expiresAt - timestamp;
    const timePassed = now - timestamp;
    const pct = 100 - ((timePassed / totalDuration) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  if (moments.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Recent Moments</h3>
        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">Disappearing in 22h</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {moments.map((moment, idx) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring" }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm"
          >
            {/* Image */}
            <img
              src={moment.image}
              alt={`${moment.user}'s moment`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />

            {/* Ephemeral Progress Bar (Top) */}
            <div className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
               <div
                 className="h-full bg-white/90 rounded-full transition-all duration-1000"
                 style={{ width: `${getTimeLeftPct(moment.timestamp, moment.expiresAt)}%` }}
               />
            </div>

            {/* Header / User */}
            <div className="absolute top-4 left-3 right-3 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <img src={moment.avatar} className="w-6 h-6 rounded-full border border-white/50 object-cover" alt={moment.user} />
                 <span className="text-white text-xs font-medium drop-shadow-md">{moment.user}</span>
               </div>
               <span className="text-white/80 text-[10px] font-medium drop-shadow-md">{getRelativeTime(moment.timestamp)}</span>
            </div>

            {/* Interactions (Bottom) */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <button className="flex items-center gap-1 text-white/90 hover:text-white transition-colors">
                   <Heart className="w-4 h-4" />
                   <span className="text-xs font-medium">{moment.reactions}</span>
                 </button>
               </div>
               <button className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

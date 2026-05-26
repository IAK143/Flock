import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';

const MOMENTS = [
  {
    id: 1,
    user: 'Sarah',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop',
    timeLabel: '2h ago',
    timeLeftPct: 30, // represents how much of the 24h is left visually
    reactions: 3
  },
  {
    id: 2,
    user: 'Alex',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop',
    timeLabel: '5h ago',
    timeLeftPct: 60,
    reactions: 1
  }
];

export const RecentMoments: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Recent Moments</h3>
        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">Disappearing in 24h</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOMENTS.map((moment, idx) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
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
                 className="h-full bg-white/90 rounded-full"
                 style={{ width: `${moment.timeLeftPct}%` }}
               />
            </div>

            {/* Header / User */}
            <div className="absolute top-4 left-3 right-3 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <img src={moment.avatar} className="w-6 h-6 rounded-full border border-white/50" alt={moment.user} />
                 <span className="text-white text-xs font-medium drop-shadow-md">{moment.user}</span>
               </div>
               <span className="text-white/80 text-[10px] font-medium drop-shadow-md">{moment.timeLabel}</span>
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

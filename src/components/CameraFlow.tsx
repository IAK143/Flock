import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Send, Globe, Users } from 'lucide-react';
import { cn } from './AppLayout';

interface CameraFlowProps {
  onClose: () => void;
  onSend: (data: { image: string, caption: string, shareGlobally: boolean }) => void;
}

export const CameraFlow: React.FC<CameraFlowProps> = ({ onClose, onSend }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [shareGlobally, setShareGlobally] = useState(false);

  const handleCapture = () => {
    // Simulate capturing an image
    setCapturedImage('https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop');
  };

  const handleSend = () => {
    if (capturedImage) {
      onSend({
        image: capturedImage,
        caption,
        shareGlobally
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 pt-12 absolute top-0 w-full z-20">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {capturedImage ? (
           <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-white/20" />
           </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pb-safe pt-20">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
             <motion.div
               key="capture"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="flex justify-center"
             >
                <button
                  onClick={handleCapture}
                  className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1"
                >
                   <div className="w-full h-full rounded-full bg-white transition-transform active:scale-90" />
                </button>
             </motion.div>
          ) : (
             <motion.div
               key="preview"
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
               className="flex flex-col gap-4"
             >
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-black/40 text-white placeholder:text-white/50 border-none rounded-2xl px-4 py-3 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <div className="flex items-center justify-between">
                   <button
                     onClick={() => setShareGlobally(!shareGlobally)}
                     className={cn(
                       "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-md",
                       shareGlobally ? "bg-accent/20 text-accent" : "bg-white/10 text-white"
                     )}
                   >
                      {shareGlobally ? <Globe className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      {shareGlobally ? "Global" : "Flock Only"}
                   </button>

                   <button
                     onClick={handleSend}
                     className="bg-accent hover:bg-accent-dark text-white rounded-full px-6 py-3 font-medium flex items-center gap-2 transition-transform active:scale-95"
                   >
                      Send <Send className="w-4 h-4 ml-1" />
                   </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

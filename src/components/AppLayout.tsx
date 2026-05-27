/* eslint-disable react-refresh/only-export-components */
import { motion } from 'framer-motion';
import React from 'react';
import { Camera, Users, Zap, User, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TabState = 'flocks' | 'activity' | 'profile' | 'settings';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabState;
  onTabChange: (tab: TabState) => void;
  onCaptureClick: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, onTabChange, onCaptureClick }) => {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden pb-20">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <motion.h1 layoutId="flock-logo" className="font-serif text-2xl font-semibold tracking-tight text-gray-900">
          Flock
        </motion.h1>
        <button
          onClick={() => onTabChange('profile')}
          className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center overflow-hidden border border-gray-100"
        >
           <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 overflow-y-auto no-scrollbar relative z-10 flex flex-col gap-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-safe">
        <NavItem
          icon={<Users className="w-6 h-6" />}
          label="Flocks"
          active={activeTab === 'flocks'}
          onClick={() => onTabChange('flocks')}
        />
        <NavItem
          icon={<Zap className="w-6 h-6" />}
          label="Activity"
          active={activeTab === 'activity'}
          onClick={() => onTabChange('activity')}
        />
        <div className="relative -top-6">
          <button
            onClick={onCaptureClick}
            className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-float hover:scale-105 transition-transform duration-300 active:scale-95"
          >
            <Camera className="w-7 h-7" />
          </button>
        </div>
        <NavItem
          icon={<User className="w-6 h-6" />}
          label="Profile"
          active={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
        <NavItem
          icon={<Settings className="w-6 h-6" />}
          label="Settings"
          active={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 transition-colors duration-200",
        active ? "text-accent" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
};

import React from 'react';
import { Camera, Users, Zap, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen shadow-soft-lg flex flex-col relative overflow-hidden pb-20">

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-40">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-gray-900">
            Flock
          </h1>
          <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center overflow-hidden border border-gray-100">
             <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 overflow-y-auto no-scrollbar relative z-10 flex flex-col gap-6">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-safe">
          <NavItem icon={<Users className="w-6 h-6" />} label="Flocks" active />
          <NavItem icon={<Zap className="w-6 h-6" />} label="Activity" />
          <div className="relative -top-6">
            <button className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-float hover:scale-105 transition-transform duration-300 active:scale-95">
              <Camera className="w-7 h-7" />
            </button>
          </div>
          <NavItem icon={<User className="w-6 h-6" />} label="Profile" />
          <NavItem icon={<div className="w-6 h-6 rounded-full border-2 border-gray-400" />} label="Settings" />
        </nav>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active }) => {
  return (
    <button className={cn(
      "flex flex-col items-center justify-center gap-1.5 transition-colors duration-200",
      active ? "text-accent" : "text-gray-400 hover:text-gray-600"
    )}>
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
};

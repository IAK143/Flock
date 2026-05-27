import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout, type TabState } from './components/AppLayout';
import { ActivePrompt, type PromptState } from './components/ActivePrompt';
import { FlockLeaderboard, type LeaderboardStats } from './components/FlockLeaderboard';
import { RecentMoments, type Moment } from './components/RecentMoments';
import { DeviceAuth } from './components/DeviceAuth';
import { supabase } from './services/supabase';
import { CameraFlow } from './components/CameraFlow';
import { syncService } from './services/SyncService';

// Mock Views
const ActivityView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">👋</span>
    </div>
    <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">No Recent Activity</h3>
    <p className="text-sm text-gray-500">When your flock is active, you'll see updates here.</p>
  </motion.div>
);

const ProfileView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-6">
    <div className="flex flex-col items-center mb-8">
       <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-24 h-24 rounded-full border-4 border-white shadow-soft mb-4 object-cover" alt="Profile" />
       <h2 className="font-serif text-2xl font-semibold text-gray-900">Alex Walker</h2>
       <p className="text-accent text-sm font-medium">@alexw • Trusted Device</p>
    </div>

    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm">
         <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Flocks</h4>
         <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm font-medium">Night Owls</span>
            <span className="text-xs text-gray-500">4 Members</span>
         </div>
      </div>
    </div>
  </motion.div>
);

const SettingsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 p-6 flex flex-col items-center justify-center">
    <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Settings</h3>
    <p className="text-sm text-gray-500 text-center">Manage your cryptographic identity and preferences here.</p>
  </motion.div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabState>('flocks');
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);


  // Realtime State
  const [prompt, setPrompt] = useState<PromptState | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [leaderboardStats, setLeaderboardStats] = useState<LeaderboardStats | null>(null);

  useEffect(() => {
    // Initial Load
    const timer = setTimeout(() => setShowSplash(false), 2000);

    // Setup Sync Service
    const initialState = syncService.getInitialState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrompt(initialState.activePrompt);
    setMoments(initialState.moments);
    setLeaderboardStats(initialState.leaderboardStats);

    // Listeners
    const handlePrompt = (data: PromptState | null) => setPrompt(data);
    const handleMoments = (data: Moment[]) => setMoments(data);

    syncService.on('prompt_updated', handlePrompt);
    syncService.on('moments_updated', handleMoments);

    return () => {
      clearTimeout(timer);
      syncService.off('prompt_updated', handlePrompt);
      syncService.off('moments_updated', handleMoments);
    };
  }, []);

  const handleSendMoment = (data: { image: string, caption: string, shareGlobally: boolean }) => {
    syncService.shareMoment(data.image, data.caption, data.shareGlobally);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'activity':
        return <ActivityView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'flocks':
      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
             <ActivePrompt prompt={prompt} onShareClick={() => setIsCameraActive(true)} />
             {leaderboardStats && <FlockLeaderboard stats={leaderboardStats} />}
             <RecentMoments moments={moments} />
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {showSplash ? (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
              className="absolute inset-0 flex items-center justify-center z-50 bg-background"
            >
              <motion.h1
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="font-serif text-5xl font-bold tracking-tight text-gray-900"
              >
                Flock
              </motion.h1>
            </motion.div>
          ) : !isAuthenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              <header className="px-6 py-5 flex items-center justify-center">
                <motion.h1 layoutId="flock-logo" className="font-serif text-2xl font-semibold tracking-tight text-gray-900">
                  Flock
                </motion.h1>
              </header>
              <DeviceAuth onAuthenticated={() => setIsAuthenticated(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col w-full h-full relative"
            >
              <AppLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCaptureClick={() => setIsCameraActive(true)}
              >
                {renderContent()}
              </AppLayout>

              <AnimatePresence>
                {isCameraActive && (
                   <CameraFlow
                     onClose={() => setIsCameraActive(false)}
                     onSend={handleSendMoment}
                   />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

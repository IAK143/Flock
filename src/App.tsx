import { useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { ActivePrompt } from './components/ActivePrompt';
import { FlockLeaderboard } from './components/FlockLeaderboard';
import { RecentMoments } from './components/RecentMoments';
import { DeviceAuth } from './components/DeviceAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background font-sans flex justify-center">
        <div className="w-full max-w-md bg-background min-h-screen flex flex-col relative overflow-hidden">
          <header className="px-6 py-5 flex items-center justify-center">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-gray-900">
              Flock
            </h1>
          </header>
          <DeviceAuth onAuthenticated={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <ActivePrompt />
      <FlockLeaderboard />
      <RecentMoments />
    </AppLayout>
  );
}

export default App;

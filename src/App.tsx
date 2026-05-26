import { AppLayout } from './components/AppLayout';
import { ActivePrompt } from './components/ActivePrompt';
import { FlockLeaderboard } from './components/FlockLeaderboard';
import { RecentMoments } from './components/RecentMoments';

function App() {
  return (
    <AppLayout>
      <ActivePrompt />
      <FlockLeaderboard />
      <RecentMoments />
    </AppLayout>
  );
}

export default App;

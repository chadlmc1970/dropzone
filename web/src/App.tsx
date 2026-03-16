import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import DJController from './components/DJController/DJController';
import TeamDashboard from './components/TeamDashboard/TeamDashboard';
import { useAudioEngine } from './hooks/useAudioEngine';

function AppContent() {
  useAudioEngine();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DJController />} />
        <Route path="/team" element={<TeamDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

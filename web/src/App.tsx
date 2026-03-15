import { Provider } from 'react-redux';
import { store } from './store';
import DJController from './components/DJController/DJController';
import { useAudioEngine } from './hooks/useAudioEngine';

function AppContent() {
  useAudioEngine();

  return <DJController />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

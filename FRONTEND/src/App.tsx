import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';
import FriendSearchModal from './components/Modal/FriendSearchModal';
import SettingsModal from './components/Modal/SettingsModal';

const ModalSwitch = () => {
  const location = useLocation();
  const state = location.state as { from?: string };

  return (
    <>
      <Routes location={state?.from ? state.from : location}>
        <Route path="/" element={<StartPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>

      {state?.from && (
        <Routes>
          <Route
            path="/friend-search"
            element={<FriendSearchModal isOpen={true} onClose={() => window.history.back()} />}
          />
          <Route
            path="/settings"
            element={<SettingsModal isOpen={true} onClose={() => window.history.back()} />}
          />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <ModalSwitch />
    </Router>
  );
};

export default App;

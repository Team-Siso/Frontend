import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
//import MainPage from "./pages/MainPage";
import FriendPage from "./pages/FriendPage";
import FriendSearchModal from "./components/Modal/FriendSearchModal";
import SettingsModal from "./components/Modal/SettingsModal";

const App: React.FC = () => {
  const [isFriendSearchModalOpen, setIsFriendSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openFriendSearchModal = () => setIsFriendSearchModalOpen(true);
  const closeFriendSearchModal = () => setIsFriendSearchModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route
          path="/main"
          element={
            <FriendPage
              openFriendSearchModal={openFriendSearchModal} // 핸들러 전달
              openSettingsModal={openSettingsModal} // 핸들러 전달
            />
          }
        />
      </Routes>

      {/* 모달 렌더링 */}
      <FriendSearchModal isOpen={isFriendSearchModalOpen} onClose={closeFriendSearchModal} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />
    </Router>
  );
};

export default App;

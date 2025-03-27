import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/MainPage";
import FriendPage from "./pages/FriendPage";
import FriendSearchModal from "./components/Modal/FriendSearchModal";
import SettingsModal from "./components/Modal/SettingsModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient 생성
const queryClient = new QueryClient();

const App: React.FC = () => {
  const [isFriendSearchModalOpen, setIsFriendSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openFriendSearchModal = () => setIsFriendSearchModalOpen(true);
  const closeFriendSearchModal = () => setIsFriendSearchModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route
            path="/main"
            element={
              <MainPage
                openFriendSearchModal={openFriendSearchModal}
                openSettingsModal={openSettingsModal}
              />
            }
          />
          <Route
            path="/friend"
            element={
              <FriendPage
                openFriendSearchModal={openFriendSearchModal}
                openSettingsModal={openSettingsModal}
              />
            }
          />
        </Routes>

        {/* 모달 렌더링 */}
        <FriendSearchModal isOpen={isFriendSearchModalOpen} onClose={closeFriendSearchModal} />
        <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />
      </Router>
    </QueryClientProvider>
  );
};

export default App;

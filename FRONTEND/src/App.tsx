import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/MainPage";
import FriendPage from "./pages/FriendPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy-load 대상 모달 컴포넌트
const FriendSearchModal = lazy(() => import("./components/Modal/FriendSearchModal"));
const SettingsModal = lazy(() => import("./components/Modal/SettingsModal"));

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

        {/* 모달 Lazy-loading */}
        {isFriendSearchModalOpen && (
          <Suspense fallback={null}>
            <FriendSearchModal
              isOpen={isFriendSearchModalOpen}
              onClose={closeFriendSearchModal}
            />
          </Suspense>
        )}

        {isSettingsModalOpen && (
          <Suspense fallback={null}>
            <SettingsModal
              isOpen={isSettingsModalOpen}
              onClose={closeSettingsModal}
            />
          </Suspense>
        )}
      </Router>
    </QueryClientProvider>
  );
};

export default App;

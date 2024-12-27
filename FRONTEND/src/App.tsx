import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query 추가
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Devtools (선택)
import StartPage from "./pages/StartPage";
import MainPage from "./pages/MainPage";
import FriendSearchModal from "./components/Modal/FriendSearchModal";
import SettingsModal from "./components/Modal/SettingsModal";

// QueryClient 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // 실패 시 2번 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리패치 비활성화
    },
  },
});

const App: React.FC = () => {
  const [isFriendSearchModalOpen, setIsFriendSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openFriendSearchModal = () => setIsFriendSearchModalOpen(true);
  const closeFriendSearchModal = () => setIsFriendSearchModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    // QueryClientProvider로 애플리케이션 감싸기
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route
            path="/main"
            element={
              <MainPage
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

      {/* React Query Devtools 추가 (선택) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

import React from "react";

// Modal 컴포넌트의 props 인터페이스 정의
interface ModalProps {
  isOpen: boolean; // 모달 열림 여부
  onClose: () => void; // 모달 닫기 핸들러
  children: React.ReactNode; // 모달 내부에 렌더링할 콘텐츠
  className?: string; // 추가 스타일 클래스 (선택적)
}

// Modal 컴포넌트 정의
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  // 모달이 열리지 않은 경우 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  // 모달 배경 클릭 핸들러: 배경을 클릭하면 모달 닫기
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose(); // 배경 클릭 시 onClose 콜백 호출
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className={`bg-white p-8 rounded text-center ${className || "w-96"}`} // 추가 스타일 클래스
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 중단
      >
        {children} {/* 모달 내부 콘텐츠 */}
        <button
          onClick={onClose} // 닫기 버튼 클릭 시 모달 닫기
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          &times; {/* 닫기 아이콘 */}
        </button>
      </div>
    </div>
  );
};

export default Modal;

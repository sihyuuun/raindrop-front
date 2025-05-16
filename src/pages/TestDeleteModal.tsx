import { useState } from "react";
import { ModalMessageDelete } from "@/components/common/ModalMessageDelete.tsx"; // 경로는 프로젝트에 맞게 조정

export default function TestDeleteModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
      >
        🗑️ 삭제 모달 열기
      </button>

      {showModal && (
        <ModalMessageDelete
          animateIn={true}
          onClose={() => {
            console.log("❌ 닫기 클릭");
            setShowModal(false);
          }}
          onConfirm={() => {
            console.log("✅ 삭제 확인");
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

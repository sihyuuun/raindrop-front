import React, { useState, useEffect } from "react";
import { sceneApi } from "@/api/sceneApi";
import { messageApi } from "@/api/messageApi";
import { userApi } from "@/api/userApi";
import { useAuthStore, checkAuthTokens } from "@/stores/authStore";
import {
  SceneRequest,
  SceneThemeUpdateRequest,
  SceneUpdateVisibilityRequest,
} from "@/types/scene.types";
import { MessageRequest, MessageDeleteRequest } from "@/types/message.types";
import axios from "axios";

const ApiTester: React.FC = () => {
  // 상태 정의
  const [activeTab, setActiveTab] = useState<"scene" | "message" | "user">(
    "scene",
  );
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Auth Store에서 로그인 상태 가져오기
  const { isAuthenticated, user, accessToken, refreshToken } = useAuthStore();

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    console.log("ApiTester 컴포넌트 마운트됨");
    checkAuthTokens();
  }, []);

  // 입력 값을 위한 상태들
  const [sceneTheme, setSceneTheme] = useState<string>("DEFAULT");
  const [sceneId, setSceneId] = useState<string>("");
  const [encryptedSceneId, setEncryptedSceneId] = useState<string>("");
  const [sceneVisibility, setSceneVisibility] = useState<boolean>(true);
  const [messageContent, setMessageContent] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [messageIdToDelete, setMessageIdToDelete] = useState<number>(0);
  const [sceneIdForMessages, setSceneIdForMessages] = useState<string>("");

  // API 호출 함수들
  const callApi = async (apiFunction: () => Promise<any>) => {
    setLoading(true);
    setError(null);

    // API 호출 전 인증 상태 다시 확인
    checkAuthTokens();

    try {
      const result = await apiFunction();
      setResponse(result.data);
      console.log("API 응답:", result.data);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
      console.error("API 오류:", err);

      // 오류 응답 세부 정보 확인
      if (err.response) {
        console.error("오류 상태:", err.response.status);
        console.error("오류 데이터:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Scene API 테스트 함수들
  const handleGetScenes = () => {
    callApi(() => sceneApi.getScenes());
  };

  const handleGetSceneById = () => {
    if (!encryptedSceneId) {
      setError("암호화된 Scene ID를 입력해주세요.");
      return;
    }
    callApi(() => sceneApi.getSceneById(encryptedSceneId));
  };

  const handleCreateScene = () => {
    const sceneData: SceneRequest = {
      theme: sceneTheme,
    };
    callApi(() => sceneApi.createScene(sceneData));
  };

  const handleUpdateSceneTheme = () => {
    if (!sceneId) {
      setError("Scene ID를 입력해주세요.");
      return;
    }
    const themeData: SceneThemeUpdateRequest = {
      sceneId: parseInt(sceneId),
      theme: sceneTheme,
    };
    callApi(() => sceneApi.updateSceneTheme(themeData));
  };

  const handleUpdateSceneVisibility = () => {
    if (!sceneId) {
      setError("Scene ID를 입력해주세요.");
      return;
    }
    const visibilityData: SceneUpdateVisibilityRequest = {
      sceneId: parseInt(sceneId),
      isPublic: sceneVisibility,
    };
    callApi(() => sceneApi.updateSceneVisibility(visibilityData));
  };

  // Message API 테스트 함수들
  const handleGetMessages = () => {
    if (!sceneIdForMessages) {
      setError("메시지를 조회할 Scene ID를 입력해주세요.");
      return;
    }

    // 직접 axios로 호출하여 쿼리 파라미터 전달
    callApi(() =>
      axios.get(`http://www.raindrop.my/messages`, {
        params: { scene: sceneIdForMessages },
        headers: { "access-token": accessToken },
        withCredentials: true,
      }),
    );
  };

  const handleCreateMessage = () => {
    if (!messageContent) {
      setError("메시지 내용을 입력해주세요.");
      return;
    }

    // 직접 요청 구성
    const messageData = {
      sceneId: sceneId ? sceneId : "",
      nickname: nickname,
      content: messageContent,
    };

    callApi(() =>
      axios.post(`http://www.raindrop.my/messages`, messageData, {
        headers: { "access-token": accessToken },
        withCredentials: true,
      }),
    );
  };

  const handleDeleteMessage = () => {
    if (!messageIdToDelete || !sceneId) {
      setError("삭제할 메시지 ID와 Scene ID를 입력해주세요.");
      return;
    }

    const deleteData = {
      sceneId: sceneId,
      messageId: messageIdToDelete,
    };

    callApi(() =>
      axios.delete(`http://www.raindrop.my/messages`, {
        headers: { "access-token": accessToken },
        data: deleteData,
        withCredentials: true,
      }),
    );
  };

  // User API 테스트 함수들
  const handleGetUserInfo = () => {
    callApi(() => userApi.getUserInfo());
  };

  // 토큰 갱신 테스트 함수
  const handleRefreshToken = () => {
    if (!refreshToken) {
      setError("리프레시 토큰이 없습니다.");
      return;
    }

    callApi(() =>
      axios.post(`http://www.raindrop.my/api/user/refresh`, null, {
        params: { refreshToken: refreshToken },
        withCredentials: true,
      }),
    );
  };

  // 카카오 로그인 페이지로 리다이렉트하는 함수
  const redirectToKakaoLogin = () => {
    const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
    const CLIENT_ID = "8162b95c200bcd82ce88d8c5468f41c5";
    const REDIRECT_URI = "http://localhost:5173/auth/login/kakao";

    window.location.href = `${KAKAO_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  // 수동으로 인증 상태를 다시 확인하는 함수
  const manualCheckAuth = () => {
    checkAuthTokens();
    // 현재 상태도 업데이트하여 UI가 갱신되도록 함
    const { isAuthenticated, user, accessToken, refreshToken } =
      useAuthStore.getState();
    setResponse({
      isAuthenticated,
      hasUser: !!user,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenPreview: accessToken
        ? `${accessToken.substring(0, 15)}...`
        : null,
      refreshTokenPreview: refreshToken
        ? `${refreshToken.substring(0, 15)}...`
        : null,
    });
  };

  return (
    <div className="api-tester container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API 테스터</h1>

      {/* 로그인 상태 표시 */}
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="font-semibold">인증 상태</h2>
        <p>인증됨: {isAuthenticated ? "예" : "아니오"}</p>
        {user && (
          <div>
            <p>사용자 이름: {user.userName}</p>
            <p>이메일: {user.email}</p>
          </div>
        )}
        {accessToken && (
          <div className="mt-2">
            <p className="font-semibold">액세스 토큰:</p>
            <p className="text-xs overflow-auto break-words bg-white p-2 rounded">
              {accessToken}
            </p>
          </div>
        )}
        {refreshToken && (
          <div className="mt-2">
            <p className="font-semibold">리프레시 토큰:</p>
            <p className="text-xs overflow-auto break-words bg-white p-2 rounded">
              {refreshToken}
            </p>
          </div>
        )}
        {/* 인증 상태 수동 확인 버튼 추가 */}
        <button
          className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
          onClick={manualCheckAuth}
        >
          인증 상태 확인
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${activeTab === "scene" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("scene")}
        >
          Scene API
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "message" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("message")}
        >
          Message API
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("user")}
        >
          User API
        </button>
      </div>

      {/* Scene API 테스트 영역 */}
      {activeTab === "scene" && (
        <div className="scene-api-test">
          <h2 className="text-xl font-semibold mb-3">Scene API 테스트</h2>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">모든 Scene 조회</h3>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleGetScenes}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">암호화된 Scene ID로 조회</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">암호화된 Scene ID:</label>
              <input
                type="text"
                value={encryptedSceneId}
                onChange={(e) => setEncryptedSceneId(e.target.value)}
                className="border p-1 w-full"
                placeholder="encryptedSceneId"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleGetSceneById}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">Scene 생성</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">테마:</label>
              <input
                type="text"
                value={sceneTheme}
                onChange={(e) => setSceneTheme(e.target.value)}
                className="border p-1 w-full"
                placeholder="테마 (예: DEFAULT, DARK)"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleCreateScene}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">Scene 테마 수정</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Scene ID:</label>
              <input
                type="text"
                value={sceneId}
                onChange={(e) => setSceneId(e.target.value)}
                className="border p-1 w-full"
                placeholder="sceneId (숫자)"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">새 테마:</label>
              <input
                type="text"
                value={sceneTheme}
                onChange={(e) => setSceneTheme(e.target.value)}
                className="border p-1 w-full"
                placeholder="테마 (예: DEFAULT, DARK)"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleUpdateSceneTheme}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">Scene 공개 상태 수정</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Scene ID:</label>
              <input
                type="text"
                value={sceneId}
                onChange={(e) => setSceneId(e.target.value)}
                className="border p-1 w-full"
                placeholder="sceneId (숫자)"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">공개 상태:</label>
              <select
                value={sceneVisibility.toString()}
                onChange={(e) => setSceneVisibility(e.target.value === "true")}
                className="border p-1 w-full"
              >
                <option value="true">공개</option>
                <option value="false">비공개</option>
              </select>
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleUpdateSceneVisibility}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>
        </div>
      )}

      {/* Message API 테스트 영역 */}
      {activeTab === "message" && (
        <div className="message-api-test">
          <h2 className="text-xl font-semibold mb-3">Message API 테스트</h2>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">특정 Scene의 메시지 조회</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Scene ID:</label>
              <input
                type="text"
                value={sceneIdForMessages}
                onChange={(e) => setSceneIdForMessages(e.target.value)}
                className="border p-1 w-full"
                placeholder="scene (쿼리 파라미터)"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleGetMessages}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">메시지 추가</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Scene ID:</label>
              <input
                type="text"
                value={sceneId}
                onChange={(e) => setSceneId(e.target.value)}
                className="border p-1 w-full"
                placeholder="sceneId"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">닉네임:</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-1 w-full"
                placeholder="닉네임"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">메시지 내용:</label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="border p-1 w-full"
                rows={3}
                placeholder="메시지 내용"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleCreateMessage}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">메시지 삭제</h3>
            <div className="mb-2">
              <label className="block text-sm mb-1">Scene ID:</label>
              <input
                type="text"
                value={sceneId}
                onChange={(e) => setSceneId(e.target.value)}
                className="border p-1 w-full"
                placeholder="sceneId"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">메시지 ID:</label>
              <input
                type="number"
                value={messageIdToDelete || ""}
                onChange={(e) =>
                  setMessageIdToDelete(parseInt(e.target.value) || 0)
                }
                className="border p-1 w-full"
                placeholder="삭제할 메시지 ID"
              />
            </div>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleDeleteMessage}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>
        </div>
      )}

      {/* User API 테스트 영역 */}
      {activeTab === "user" && (
        <div className="user-api-test">
          <h2 className="text-xl font-semibold mb-3">User API 테스트</h2>

          {/* 카카오 OAuth 로그인 시작 버튼 추가 */}
          <div className="mb-4 p-3 border rounded bg-yellow-50">
            <h3 className="font-semibold mb-2">카카오 OAuth 로그인</h3>
            <p className="text-sm mb-2">
              카카오 로그인 페이지로 이동하여 인증을 진행합니다.
            </p>
            <button
              className="bg-yellow-400 text-black py-1 px-3 rounded"
              onClick={redirectToKakaoLogin}
              disabled={loading}
            >
              카카오 로그인
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">사용자 정보 조회</h3>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleGetUserInfo}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "API 호출"}
            </button>
          </div>

          <div className="mb-4 p-3 border rounded">
            <h3 className="font-semibold mb-2">토큰 갱신</h3>
            <p className="text-sm mb-2">
              저장된 리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.
            </p>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded"
              onClick={handleRefreshToken}
              disabled={loading}
            >
              {loading ? "로딩 중..." : "토큰 갱신"}
            </button>
          </div>
        </div>
      )}

      {/* 응답 및 오류 표시 영역 */}
      <div className="mt-6">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded mb-4">
            <h3 className="font-semibold text-red-700">오류 발생</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <h3 className="font-semibold">API 응답</h3>
            <pre className="bg-white p-2 mt-2 rounded overflow-auto max-h-96">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;

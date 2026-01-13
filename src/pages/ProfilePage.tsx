import Button from "../components/atoms/Button";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-xl font-medium text-bodyText">
          로그인이 필요합니다.
        </p>
        <Button onClick={() => (window.location.href = "/login")}>
          로그인하러 가기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto bg-bodyBg rounded-2xl shadow-lg border border-border p-8 text-bodyText">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.nickname}
                referrerPolicy="no-referrer"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-blue-600">
                {user.nickname ? user.nickname.charAt(0) : "?"}
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold">{user.nickname}</h1>
            <p className="text-bodyTextMuted mt-1">{user.email}</p>
          </div>

          <div className="w-full border-t border-border pt-8 mt-4 space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-bodyTextMuted">회원 ID</span>
              <span>{user.id}</span>
            </div>
            {/* 추가 정보를 여기에 표시할 수 있습니다 */}
          </div>

          <div className="flex gap-4 mt-8">
            <Button variant="ghost" className="border border-border">
              정보 수정
            </Button>
            <Button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

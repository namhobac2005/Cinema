import { useState } from "react";
import { Film, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
// tabs removed — only login is needed
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { login } from "../api/auth";

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail || !loginPassword) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await login({ username: loginEmail, password: loginPassword });
      // success: inform parent (App will show dashboard)
      try { onLogin(); } catch {}
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  // registration removed — only login is supported

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1666698907755-672d406ea71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjB0aGVhdGVyJTIwZGFya3xlbnwxfHx8fDE3NjIzMjk2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cinema background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1629] via-[#0F1629]/95 to-[#1C253A]/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Film className="w-12 h-12" style={{ color: '#8B5CF6' }} />
            <div className="absolute inset-0 blur-xl opacity-50" style={{ backgroundColor: '#8B5CF6' }} />
          </div>
          <div>
            <h1 className="text-[28px] font-bold" style={{ color: '#FFC107' }}>
              CinemaHub
            </h1>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Hệ thống quản lý rạp chiếu phim
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-[#8B5CF6]/30 shadow-2xl shadow-[#8B5CF6]/10">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center" style={{ color: '#E5E7EB' }}>
              Chào mừng trở lại
            </CardTitle>
            <CardDescription className="text-center" style={{ color: '#9CA3AF' }}>
              Đăng nhập hoặc tạo tài khoản mới
            </CardDescription>
          </CardHeader>
          <CardContent>
              {/* Login Form */}
              <div className="w-full">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Tên đăng nhập</Label>
                    <Input
                      id="login-email"
                      type="text"
                      placeholder=""
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder=""
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-[#1C253A] border-[#8B5CF6]/30 focus:border-[#FFC107] transition-colors pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#FFC107] transition-colors"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#9CA3AF' }}>
                      <input type="checkbox" className="rounded border-[#8B5CF6]/30" />
                      Ghi nhớ đăng nhập
                    </label>
                    <button
                      type="button"
                      className="text-sm hover:underline transition-colors"
                      style={{ color: '#8B5CF6' }}
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0F1629] shadow-lg shadow-[#FFC107]/20"
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
                  </Button>
                  {error && (
                    <p className="text-sm mt-2" style={{ color: '#F87171' }}>{error}</p>
                  )}
                </form>
              </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-sm" style={{ color: '#9CA3AF' }}>
          © 2025 CinemaHub. Bản quyền thuộc về công ty.
        </p>
      </div>
    </div>
  );
}

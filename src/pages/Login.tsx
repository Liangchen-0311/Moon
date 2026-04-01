import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

const SCHOOL_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@.*(hku\.hk|ust\.hk|cuhk\.edu\.hk|polyu\.edu\.hk|edu\.hk|sustech\.edu\.cn|szu\.edu\.cn)$/i;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = SCHOOL_EMAIL_REGEX.test(email);

  const handleSendLink = async () => {
    if (!isEmailValid) return;
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <AppShell>
      <div className="p-8 pt-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-muted-foreground text-sm mb-8 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> 返回首页
        </button>

        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl mb-4"
          >
            🌙
          </motion.div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            {sent ? "查看你的邮箱 📬" : "用学校邮箱登录"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {sent
              ? "我们已发送 Magic Link 到你的邮箱，点击链接即可登录"
              : "无需密码，我们会发送登录链接到你的学校邮箱"}
          </p>
        </div>

        {!sent ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">
                学校邮箱
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@connect.hku.hk"
                  className="lunar-input"
                  onKeyDown={(e) => e.key === "Enter" && handleSendLink()}
                />
                {isEmailValid && (
                  <CheckCircle2
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    size={20}
                    style={{ color: "hsl(var(--lunar-teal))" }}
                  />
                )}
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <button
              className="lunar-btn-primary"
              disabled={!isEmailValid || loading}
              onClick={handleSendLink}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  发送中…
                </span>
              ) : (
                <>
                  <Mail size={16} /> 发送登录链接
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              仅限港深高校学校邮箱 · 完全匿名
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Mail className="text-primary" size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-medium">{email}</p>
              <p className="text-xs text-muted-foreground">
                没收到？检查垃圾邮件文件夹，或
                <button
                  onClick={() => { setSent(false); setError(""); }}
                  className="text-primary font-medium ml-1"
                >
                  重新发送
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
};

export default Login;

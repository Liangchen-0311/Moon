import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import { supabaseAuth } from "@/integrations/supabase/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const SCHOOL_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@.*(hku\.hk|ust\.hk|cuhk\.edu\.hk|polyu\.edu\.hk|edu\.hk|sustech\.edu\.cn|szu\.edu\.cn)$/i;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = SCHOOL_EMAIL_REGEX.test(email);

  const handleSendOtp = async () => {
    if (!isEmailValid) return;
    setLoading(true);
    setError("");

    const { error } = await supabaseAuth.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (token: string) => {
    if (token.length !== 6) return;
    setLoading(true);
    setError("");

    const { error } = await supabaseAuth.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <AppShell>
      <div className="p-8 pt-12">
        <button
          onClick={() => step === "otp" ? setStep("email") : navigate("/")}
          className="flex items-center gap-1 text-muted-foreground text-sm mb-8 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> {step === "otp" ? "修改邮箱" : "返回首页"}
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
            {step === "otp" ? "输入验证码" : "用学校邮箱登录"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === "otp"
              ? `验证码已发送到 ${email}`
              : "无需密码，我们会发送 6 位验证码到你的学校邮箱"}
          </p>
        </div>

        {step === "email" ? (
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
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
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
              onClick={handleSendOtp}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  发送中…
                </span>
              ) : (
                <>
                  <Mail size={16} /> 发送验证码
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
            className="space-y-6 flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <ShieldCheck className="text-primary" size={28} />
            </div>

            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (value.length === 6) handleVerifyOtp(value);
              }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            {loading && (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}

            <p className="text-xs text-muted-foreground text-center">
              没收到？检查垃圾邮件文件夹，或
              <button
                onClick={() => { setOtp(""); setError(""); handleSendOtp(); }}
                className="text-primary font-medium ml-1"
              >
                重新发送
              </button>
            </p>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
};

export default Login;

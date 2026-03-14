import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/AppShell";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("男生");
  const [target, setTarget] = useState("女生");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const isEmailValid =
    /^[a-zA-Z0-9._%+-]+@.*(hku\.hk|ust\.hk|cuhk\.edu\.hk|polyu\.edu\.hk|edu\.hk|sustech\.edu\.cn|szu\.edu\.cn)$/i.test(
      email
    );

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const isOtpFilled = otp.every((d) => d !== "");

  return (
    <AppShell>
      <div className="p-8 pt-12">
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">验证你的学生身份</h2>
          <p className="text-muted-foreground">为了确保社区纯粹，我们需要验证你的校友身份</p>
        </div>

        {step === 1 ? (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">学校邮箱</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@connect.hku.hk"
                  className="lunar-input"
                />
                {isEmailValid && (
                  <CheckCircle2 className="absolute right-4 top-4 text-lunar-teal" size={20} />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">昵称</label>
              <input
                maxLength={8}
                minLength={2}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="怎么称呼你？"
                className="lunar-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">你的性别</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="lunar-input appearance-none"
                >
                  <option>男生</option>
                  <option>女生</option>
                  <option>不想说</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">想认识</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="lunar-input appearance-none"
                >
                  <option>女生</option>
                  <option>男生</option>
                  <option>都可以</option>
                </select>
              </div>
            </div>

            <button
              className="lunar-btn-primary"
              disabled={!isEmailValid}
              onClick={() => setStep(2)}
            >
              发送验证码
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-6">验证码已发送至 {email}</p>
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-10 h-14 bg-muted rounded-xl border-2 border-border text-center text-xl font-bold outline-none focus:border-primary transition-colors"
                  />
                ))}
              </div>
            </div>
            <button
              className="lunar-btn-primary"
              disabled={!isOtpFilled}
              onClick={() => navigate("/quiz")}
            >
              进入测评
            </button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
};

export default Onboarding;

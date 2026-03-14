import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import { Target, Heart, Sparkles, Lock, CheckCircle2 } from "lucide-react";

interface Crush {
  id: string;
  target: string;
  timestamp: number;
}

function getCrushes(): Crush[] {
  try {
    return JSON.parse(localStorage.getItem("shoot_crushes") || "[]");
  } catch {
    return [];
  }
}

function saveCrushes(crushes: Crush[]) {
  localStorage.setItem("shoot_crushes", JSON.stringify(crushes));
}

// Mock "mutual match" — simulates the other person also submitted your email
const MOCK_MUTUAL_EMAIL = "match@hku.hk";

const ShootYourShot: React.FC = () => {
  const [input, setInput] = useState("");
  const [crushes, setCrushes] = useState<Crush[]>(getCrushes);
  const [justMatched, setJustMatched] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const myEmail = localStorage.getItem("user_email") || "";

  useEffect(() => {
    setCrushes(getCrushes());
  }, []);

  const isValidInput = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (trimmed.length < 3) return false;
    // Accept email-like or student ID (alphanumeric 6-12 chars)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const studentIdPattern = /^[a-z0-9]{6,12}$/i;
    return emailPattern.test(trimmed) || studentIdPattern.test(trimmed);
  };

  const handleSubmit = () => {
    const trimmed = input.trim().toLowerCase();
    if (!isValidInput(trimmed)) return;
    if (crushes.some((c) => c.target === trimmed)) return;

    const newCrush: Crush = {
      id: Date.now().toString(),
      target: trimmed,
      timestamp: Date.now(),
    };
    const updated = [...crushes, newCrush];
    saveCrushes(updated);
    setCrushes(updated);
    setInput("");
    setShowSuccess(true);

    // Check for mock mutual match
    if (trimmed === MOCK_MUTUAL_EMAIL) {
      setTimeout(() => {
        setJustMatched(trimmed);
        setShowSuccess(false);
      }, 1500);
    } else {
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleRemove = (id: string) => {
    const updated = crushes.filter((c) => c.id !== id);
    saveCrushes(updated);
    setCrushes(updated);
  };

  return (
    <AppShell showNav>
      <div className="p-6 pt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4"
          >
            <Target className="text-primary" size={28} />
          </motion.div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Shoot Your Shot 🎯
          </h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            偷偷填写心仪对象的学号或邮箱
            <br />
            如果 TA 也填了你，系统自动匹配 💘
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <input
              className="lunar-input pl-12 pr-4"
              placeholder="输入 TA 的学号或邮箱…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              maxLength={50}
            />
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
          </div>
          <button
            className="lunar-btn-primary"
            disabled={!isValidInput(input.trim())}
            onClick={handleSubmit}
          >
            <Heart size={16} /> 悄悄提交
          </button>
          <p className="text-center text-muted-foreground text-[11px]">
            🔒 完全保密 · 只有双向匹配才会通知双方
          </p>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-secondary text-center"
            >
              <CheckCircle2
                className="mx-auto mb-2 text-primary"
                size={24}
              />
              <p className="text-sm font-medium text-foreground">
                已悄悄记录，等待 TA 的回应…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mutual Match Celebration */}
        <AnimatePresence>
          {justMatched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6 p-6 rounded-3xl text-center border-2 border-primary"
              style={{
                background:
                  "linear-gradient(135deg, hsl(340 55% 58% / 0.08), hsl(245 50% 67% / 0.08))",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-4xl mb-3"
              >
                💘
              </motion.div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                双向匹配成功！
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                你和 <span className="text-primary font-bold">{justMatched}</span>{" "}
                互相选择了对方
              </p>
              <p className="text-xs text-muted-foreground">
                系统已通知双方，勇敢迈出下一步吧 ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* My Crushes List */}
        {crushes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> 我的心动列表
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {crushes.map((crush) => {
                  const isMutual = crush.target === MOCK_MUTUAL_EMAIL;
                  return (
                    <motion.div
                      key={crush.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`flex items-center justify-between p-4 rounded-2xl ${
                        isMutual
                          ? "bg-secondary border-2 border-primary"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                            isMutual
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground"
                          }`}
                        >
                          {isMutual ? "💘" : "🤫"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {crush.target.replace(
                              /(.{2})(.*)(@)/,
                              (_, a, b, c) => a + "•".repeat(b.length) + c
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {isMutual ? "✨ 双向匹配！" : "等待中…"}
                          </p>
                        </div>
                      </div>
                      {!isMutual && (
                        <button
                          onClick={() => handleRemove(crush.id)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          撤回
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        {crushes.length === 0 && !showSuccess && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🫣</p>
            <p className="text-sm text-muted-foreground">
              还没有提交过心动对象
              <br />
              勇敢迈出第一步吧！
            </p>
          </div>
        )}

        {/* How it works */}
        <div className="mt-10 p-5 bg-muted rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            玩法说明
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex gap-2">
              <span>1️⃣</span> 输入你心仪的人的学号或邮箱
            </p>
            <p className="flex gap-2">
              <span>2️⃣</span> 系统完全保密，对方不会知道
            </p>
            <p className="flex gap-2">
              <span>3️⃣</span> 如果 TA 也填了你 → 双向匹配成功！
            </p>
            <p className="flex gap-2">
              <span>4️⃣</span> 只有匹配成功时，双方才会收到通知
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ShootYourShot;

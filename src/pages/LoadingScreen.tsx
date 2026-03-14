import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AppShell from "@/components/AppShell";

const STEPS = ["解析你的性格维度…", "跨校筛选候选人…", "计算深度兼容度…", "生成匹配报告…"];

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => s + 1);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step >= STEPS.length) {
      const timeout = setTimeout(() => navigate("/result"), 800);
      return () => clearTimeout(timeout);
    }
  }, [step, navigate]);

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-secondary border-t-primary rounded-full mb-8"
        />
        <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">AI 正在为你匹配</h2>
        <p className="text-muted-foreground mb-12">分析你在 19 所高校中的最佳缘分</p>

        <div className="space-y-4 w-full max-w-[240px]">
          {STEPS.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: step > i ? 1 : 0, y: step > i ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-muted-foreground font-medium"
            >
              <Sparkles size={16} className="text-primary flex-shrink-0" />
              {s}
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default LoadingScreen;

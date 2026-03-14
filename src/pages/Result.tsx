import React from "react";
import { motion } from "framer-motion";
import AppShell from "@/components/AppShell";

const MATCH = {
  name: "陈晓晴",
  initials: "CX",
  school: "香港科技大学 · 计算机科学 · 大三",
  score: 91,
  tags: ["独立思考", "夜猫子", "喜欢爬山", "INFJ"],
  reasons: [
    "你们都是夜猫子，深夜长聊会很自然",
    "同样重视三观契合，不只看颜值",
    "她也想毕业后留港发展，目标相近",
  ],
};

function getNextMatchDate(): { label: string; countdown: string } {
  const now = new Date();
  const day = now.getDay();
  let daysUntil: number;
  // Next Wednesday (3) or Sunday (0), whichever is closer
  const daysToWed = (3 - day + 7) % 7 || 7;
  const daysToSun = (0 - day + 7) % 7 || 7;
  const isWed = daysToWed <= daysToSun;
  daysUntil = isWed ? daysToWed : daysToSun;
  const dayLabel = isWed ? "周三" : "周日";
  const hours = 20 - now.getHours();
  return {
    label: `下${dayLabel} 20:00`,
    countdown: `倒计时 ${daysUntil}天 ${Math.max(0, hours)}小时`,
  };
}

const Result: React.FC = () => {
  const next = getNextMatchDate();

  return (
    <AppShell showNav>
      <div className="p-6 pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
            本周匹配结果
          </span>
          <div className="flex items-baseline justify-center gap-1 mt-4">
            <h2 className="font-serif text-6xl font-bold text-primary">{MATCH.score}</h2>
            <span className="font-serif text-2xl font-bold text-primary">%</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">兼容度 · 基于15维性格模型</p>
        </div>

        {/* Match Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-card rounded-[2rem] p-6 border border-border relative overflow-hidden"
          style={{ boxShadow: "0 20px 50px rgba(212, 83, 126, 0.15)" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              {MATCH.initials}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">{MATCH.name}</h3>
              <p className="text-xs text-muted-foreground font-medium">{MATCH.school}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {MATCH.tags.map((t, i) => (
              <span key={t} className={i < 2 ? "lunar-tag-match" : "lunar-tag-neutral"}>
                {t}
              </span>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              为什么 AI 觉得你们合适
            </h4>
            <ul className="space-y-3">
              {MATCH.reasons.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-primary">✦</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button className="lunar-btn-primary">接受配对 💌</button>
          <button className="lunar-btn-secondary">了解更多</button>
        </div>

        {/* Next delivery */}
        <div className="mt-12 p-6 bg-foreground rounded-3xl text-center">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-2">
            下次投递时间
          </p>
          <p className="text-primary-foreground font-serif text-lg">{next.label}</p>
          <p className="text-muted-foreground text-xs mt-1">{next.countdown}</p>
        </div>
      </div>
    </AppShell>
  );
};

export default Result;

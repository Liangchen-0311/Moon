import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";

const HK_SCHOOLS = ["HKU", "HKUST", "CUHK", "PolyU", "CityU", "HKBU", "LingU", "EdUHK", "HSUHK", "HKMU"];
const SZ_SCHOOLS = ["南科大", "深大", "港中大(深圳)", "清华深圳", "北大深圳", "上海交大深圳", "哈工大深圳", "暨南深圳", "中山大学深圳"];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="p-8 pt-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-5xl mb-4"
        >
          🌙
        </motion.div>

        <h1 className="font-serif text-3xl font-bold text-primary mb-2">月亮 🌙</h1>
        <p className="text-muted-foreground font-medium mb-8">不刷脸，不内卷，帮你找对的人</p>

        <div className="bg-secondary/50 rounded-3xl p-6 w-full mb-8">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
            每周三 &amp; 周日 · 跨校精准匹配
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {HK_SCHOOLS.map((s) => (
              <span key={s} className="lunar-badge-hk">{s}</span>
            ))}
            {SZ_SCHOOLS.map((s) => (
              <span key={s} className="lunar-badge-sz">{s}</span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div>
              <p className="text-lg font-bold text-foreground">3,200+</p>
              <p className="text-[10px] text-muted-foreground">在校用户</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">87%</p>
              <p className="text-[10px] text-muted-foreground">成功约出来</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">8min</p>
              <p className="text-[10px] text-muted-foreground">完成测评</p>
            </div>
          </div>
        </div>

        <button className="lunar-btn-primary" onClick={() => navigate("/onboarding")}>
          开始匹配测评 <ArrowRight size={18} />
        </button>
        <p className="mt-6 text-xs text-muted-foreground">需要学生邮箱验证 · 完全匿名</p>
      </div>
    </AppShell>
  );
};

export default Landing;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const HK_SCHOOLS = ["HKU", "HKUST", "CUHK", "PolyU", "CityU", "HKBU", "LingU", "EdUHK", "HSUHK", "HKMU"];
const SZ_SCHOOLS = ["南科大", "深大", "港中大(深圳)", "清华深圳", "北大深圳", "上海交大深圳", "哈工大深圳", "暨南深圳", "中山大学深圳"];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecking(false);
      return;
    }
    // Check if user has completed quiz (profile_summary exists)
    const checkProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("profile_summary")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.profile_summary) {
        setHasQuiz(true);
        navigate("/match", { replace: true });
      } else if (data) {
        // Has profile but no quiz
        setHasQuiz(false);
      }
      setChecking(false);
    };
    checkProfile();
  }, [user, authLoading, navigate]);

  if (authLoading || checking) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  // Logged in but hasn't completed quiz
  if (user && !hasQuiz) {
    return (
      <AppShell showNav>
        <div className="p-8 pt-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl mb-4"
          >
            🌙
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">月亮 🌙</h1>
          <p className="text-muted-foreground font-medium mb-8">完成测评，开启你的匹配之旅</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="p-5 rounded-2xl bg-muted text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">📝 你还没有完成性格测评</p>
              <p className="text-xs text-muted-foreground">
                完成 15 道趣味问题，AI 将为你生成专属性格画像，并每周三为你匹配最合适的人
              </p>
            </div>
            <button className="lunar-btn-primary" onClick={() => navigate("/quiz")}>
              开始测评 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Not logged in — show landing
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

        <button className="lunar-btn-primary" onClick={() => navigate("/login")}>
          开始匹配测评 <ArrowRight size={18} />
        </button>
        <p className="mt-6 text-xs text-muted-foreground">需要学生邮箱验证 · 完全匿名</p>
      </div>
    </AppShell>
  );
};

export default Landing;

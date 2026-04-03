import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseAuth } from "@/integrations/supabase/auth-client";

const HK_SCHOOLS = ["HKU", "HKUST", "CUHK", "PolyU", "CityU", "HKBU", "LingU", "EdUHK", "HSUHK", "HKMU"];
const SZ_SCHOOLS = ["南科大", "深大", "港中大(深圳)", "清华深圳", "北大深圳", "上海交大深圳", "哈工大深圳", "暨南深圳", "中山大学深圳"];

const getWeekStart = () => {
  const now = new Date();
  const currentDay = now.getDay();
  const offset = currentDay === 0 ? 6 : currentDay - 1;
  const start = new Date(now);
  start.setDate(now.getDate() - offset);
  start.setHours(0, 0, 0, 0);
  return start.toISOString().slice(0, 10);
};

const getNextWednesday8pm = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  let daysUntilWed = (3 - day + 7) % 7;
  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilWed);
  target.setHours(20, 0, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 7);
  }
  return target;
};

const formatCountdown = (ms: number) => {
  if (ms <= 0) return "即将揭晓！";
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const minutes = totalMin % 60;
  return `${days}天 ${hours}小时 ${minutes}分`;
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileSummary, setProfileSummary] = useState<string | null>(null);
  const [hasWeeklyMatch, setHasWeeklyMatch] = useState(false);
  const [poolCount, setPoolCount] = useState(0);
  const [countdown, setCountdown] = useState("");

  const summaryPreview = useMemo(() => {
    if (!profileSummary) return "完成测评后将生成你的专属性格画像";
    return profileSummary.length > 80 ? `${profileSummary.slice(0, 80)}...` : profileSummary;
  }, [profileSummary]);

  // Countdown timer
  useEffect(() => {
    const update = () => setCountdown(formatCountdown(getNextWednesday8pm().getTime() - Date.now()));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const loadHome = async () => {
      if (!user) { setChecking(false); return; }

      const { data: { user: authUser } } = await supabaseAuth.auth.getUser();
      if (!authUser) { setChecking(false); return; }

      const weekStart = getWeekStart();

      const [{ data: quizRow }, { data: userRow }, { count }] = await Promise.all([
        supabaseAuth.from("quiz_answers").select("user_id").eq("user_id", authUser.id).maybeSingle(),
        supabaseAuth.from("users").select("id, nickname, profile_summary").eq("user_id", authUser.id).maybeSingle(),
        supabaseAuth.from("users").select("id", { count: "exact", head: true }).eq("opt_in", true),
      ]);

      const completedQuiz = !!quizRow;
      setHasQuiz(completedQuiz);
      setNickname(userRow?.nickname ?? null);
      setProfileSummary(userRow?.profile_summary ?? null);
      setPoolCount(count ?? 0);

      if (completedQuiz && userRow?.id) {
        const { data: matchRow } = await supabaseAuth
          .from("matches")
          .select("id")
          .or(`user_a.eq.${userRow.id},user_b.eq.${userRow.id}`)
          .gte("week_of", weekStart)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        setHasWeeklyMatch(!!matchRow);
      }

      setChecking(false);
    };

    loadHome();
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  // Logged in + quiz done → dashboard
  if (user && hasQuiz) {
    return (
      <AppShell showNav>
        <div className="p-6 pt-10 space-y-5">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-2"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">月亮 🌙</p>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {nickname ? `Hi, ${nickname} 🌙` : "Hi there 🌙"}
            </h1>
          </motion.div>

          {/* Countdown */}
          <div className="rounded-3xl border border-border bg-card p-5 text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">距离下次匹配</p>
            <p className="text-2xl font-bold text-primary">{countdown}</p>
          </div>

          {/* Match status */}
          <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">本周匹配状态</p>
              <h2 className="text-xl font-semibold text-foreground">
                {hasWeeklyMatch ? "本周匹配已揭晓 🎉" : "本周三晚 8 点揭晓你的匹配对象 ✨"}
              </h2>
            </div>
            {hasWeeklyMatch && (
              <button
                className="w-full py-3 rounded-2xl font-semibold text-primary-foreground bg-primary flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                onClick={() => navigate("/match")}
              >
                查看匹配 <ArrowRight size={18} />
              </button>
            )}
          </div>

          {/* Profile summary */}
          <button
            onClick={() => navigate("/profile")}
            className="w-full rounded-3xl border border-border bg-secondary/40 p-5 text-left transition-transform active:scale-[0.99]"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">你的性格画像 ✨</p>
              <p className="text-sm leading-relaxed text-foreground">{summaryPreview}</p>
              <p className="text-xs font-medium text-primary">点击查看完整版</p>
            </div>
          </button>

          <p className="pt-1 text-center text-xs text-muted-foreground">已有 {poolCount} 人加入匹配池</p>
        </div>
      </AppShell>
    );
  }

  // Logged in + no quiz
  if (user && !hasQuiz) {
    return (
      <AppShell showNav>
        <div className="p-8 pt-16 flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-4">🌙</motion.div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">月亮 🌙</h1>
          <p className="text-muted-foreground font-medium mb-8">完成测评，开启你的匹配之旅</p>
          <div className="w-full max-w-sm space-y-4">
            <div className="p-5 rounded-2xl bg-muted text-left space-y-2">
              <p className="text-sm font-semibold text-foreground">📝 你还没有完成性格测评</p>
              <p className="text-xs text-muted-foreground">完成 15 道趣味问题后，我们会为你生成专属性格画像，并加入每周匹配。</p>
            </div>
            <button className="lunar-btn-primary" onClick={() => navigate("/quiz")}>
              开始测评 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Not logged in → public landing
  return (
    <AppShell>
      <div className="p-8 pt-16 flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className="text-5xl mb-4">🌙</motion.div>
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">月亮 🌙</h1>
        <p className="text-muted-foreground font-medium mb-8">不刷脸，不内卷，帮你找对的人</p>
        <div className="bg-secondary/50 rounded-3xl p-6 w-full mb-8">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">每周三 &amp; 周日 · 跨校精准匹配</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {HK_SCHOOLS.map((s) => (<span key={s} className="lunar-badge-hk">{s}</span>))}
            {SZ_SCHOOLS.map((s) => (<span key={s} className="lunar-badge-sz">{s}</span>))}
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div><p className="text-lg font-bold text-foreground">3,200+</p><p className="text-[10px] text-muted-foreground">在校用户</p></div>
            <div><p className="text-lg font-bold text-foreground">87%</p><p className="text-[10px] text-muted-foreground">成功约出来</p></div>
            <div><p className="text-lg font-bold text-foreground">8min</p><p className="text-[10px] text-muted-foreground">完成测评</p></div>
          </div>
        </div>
        <button className="lunar-btn-primary" onClick={() => navigate("/login")}>开始匹配测评 <ArrowRight size={18} /></button>
        <p className="mt-6 text-xs text-muted-foreground">需要学生邮箱验证 · 完全匿名</p>
      </div>
    </AppShell>
  );
};

export default Landing;

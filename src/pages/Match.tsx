import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseAuth } from "@/integrations/supabase/auth-client";
import AppShell from "@/components/AppShell";
import { CalendarClock, Heart } from "lucide-react";

interface MatchData {
  nickname: string;
  school: string;
  matchScore: number;
  matchReason: string;
  matchType: string;
  weekOf: string;
}

const Match: React.FC = () => {
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noMatch, setNoMatch] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchMatch = async () => {
      const { data: { user: authUser } } = await supabaseAuth.auth.getUser();
      if (!authUser) { setNoMatch(true); setLoading(false); return; }

      const myId = authUser.id;

      // Query matches where user is either user_a or user_b
      const { data: matchRows } = await supabaseAuth
        .from("matches")
        .select("*")
        .or(`user_a.eq.${myId},user_b.eq.${myId}`)
        .order("created_at", { ascending: false })
        .limit(1);

      const row = (matchRows as any)?.[0];
      if (!row) {
        setNoMatch(true);
        setLoading(false);
        return;
      }

      // Get the other person's info
      const otherId = row.user_a === myId ? row.user_b : row.user_a;
      const { data: otherUser } = await supabaseAuth
        .from("users")
        .select("nickname")
        .eq("id", otherId)
        .maybeSingle();

      setMatch({
        nickname: otherUser?.nickname || "一位神秘人",
        school: "",
        matchScore: row.match_score,
        matchReason: row.match_reason || "",
        matchType: row.match_type || "weekly",
        weekOf: row.week_of,
      });
      setLoading(false);
    };

    fetchMatch();
  }, [user]);

  if (loading) {
    return (
      <AppShell showNav>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-10 h-10 border-4 border-secondary border-t-primary rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (noMatch || !match) {
    return (
      <AppShell showNav>
        <div className="p-8 pt-16 flex flex-col items-center text-center min-h-[80vh] justify-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl mb-6">🌙</motion.div>
          <h1 className="font-serif text-xl font-bold text-foreground mb-3">本周还没有匹配结果</h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mb-8">每周三晚 8 点会收到新的匹配。确保你已开启「参加匹配」开关。</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock size={16} className="text-primary" />
            <span>下次匹配：周三 20:00</span>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showNav>
      <div className="p-6 pt-12">
        <div className="text-center mb-8">
          <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">你的本周匹配 🌙</span>
          {match.matchType === "crush" && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold"
            >
              <Heart size={16} fill="currentColor" /> 双向心动匹配 💘
            </motion.div>
          )}
          <div className="flex items-baseline justify-center gap-1 mt-4">
            <h2 className="font-serif text-6xl font-bold text-primary">{Math.round(match.matchScore)}</h2>
            <span className="font-serif text-2xl font-bold text-primary">%</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">兼容度</p>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-card rounded-[2rem] p-6 border border-border"
          style={{ boxShadow: "0 20px 50px rgba(212, 83, 126, 0.15)" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl">🌙</div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">{match.nickname}</h3>
              {match.school && <p className="text-xs text-muted-foreground font-medium">{match.school}</p>}
            </div>
          </div>
          {match.matchReason && (
            <div className="pt-6 border-t border-border">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">AI 分析</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{match.matchReason}</p>
            </div>
          )}
        </motion.div>

        <div className="mt-8 space-y-3">
          <button className="lunar-btn-primary">接受配对 💌</button>
          <button className="lunar-btn-secondary">了解更多</button>
        </div>
      </div>
    </AppShell>
  );
};

export default Match;

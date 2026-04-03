import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseAuth } from "@/integrations/supabase/auth-client";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [profileSummary, setProfileSummary] = useState("");
  const [hasQuiz, setHasQuiz] = useState(false);
  const [hasMatch, setHasMatch] = useState(false);
  const [poolCount, setPoolCount] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabaseAuth.auth.getUser();
        if (!authUser) return;

        // 获取用户信息
        const { data: userData } = await supabase
          .from("users")
          .select("nickname, profile_summary")
          .eq("id", authUser.id)
          .maybeSingle();

        if (userData) {
          setNickname(userData.nickname || "");
          setProfileSummary(userData.profile_summary || "");
        }

        // 检查是否完成问卷
        const { data: quizData } = await supabase
          .from("quiz_answers")
          .select("user_id")
          .eq("user_id", authUser.id)
          .maybeSingle();

        setHasQuiz(!!quizData);

        // 检查本周是否有匹配
        const { data: matchData } = await supabase
          .from("matches")
          .select("id")
          .or(`user_a.eq.${authUser.id},user_b.eq.${authUser.id}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setHasMatch(!!matchData);

        // 匹配池人数
        const { count } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("opt_in", true);

        setPoolCount(count || 0);
      } catch (err) {
        console.error("加载首页数据失败:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, navigate]);

  // 倒计时到下周三晚 8 点
  useEffect(() => {
    const calcCountdown = () => {
      const now = new Date();
      const target = new Date(now);
      const day = now.getDay();
      const diff = day <= 3 ? 3 - day : 10 - day;
      target.setDate(now.getDate() + diff);
      target.setHours(20, 0, 0, 0);

      if (target <= now) {
        target.setDate(target.getDate() + 7);
      }

      const ms = target.getTime() - now.getTime();
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(`${days}天 ${hours}小时 ${minutes}分`);
    };

    calcCountdown();
    const timer = setInterval(calcCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-4">🌙</div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  // 未完成测评
  if (!hasQuiz) {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌙</div>
          <h1 className="text-2xl font-bold text-foreground">Hi{nickname ? `, ${nickname}` : ""} 🌙</h1>
          <p className="text-muted-foreground mt-2">完成测评，开启你的匹配之旅</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm border mb-6">
          <h3 className="font-semibold text-foreground mb-2">📝 性格测评</h3>
          <p className="text-sm text-muted-foreground">
            完成 15 道趣味问题，AI 将为你生成专属性格画像，并每周三为你匹配最合适的人。
          </p>
        </div>

        <button
          onClick={() => navigate("/quiz")}
          className="w-full py-4 rounded-2xl text-white font-semibold text-lg"
          style={{ background: "linear-gradient(135deg, #e8788a, #d4607a)" }}
        >
          开始测评 →
        </button>

        <p className="text-center text-sm text-muted-foreground mt-8">已有 {poolCount} 人加入匹配池</p>
      </div>
    );
  }

  // 已完成测评
  return (
    <div className="min-h-screen bg-background px-6 py-12 pb-24">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌙</div>
        <h1 className="text-2xl font-bold text-foreground">Hi{nickname ? `, ${nickname}` : ""} 🌙</h1>
      </div>

      {/* 倒计时卡片 */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border mb-4">
        <h3 className="font-semibold text-foreground mb-1">⏰ 下次匹配倒计时</h3>
        <p className="text-2xl font-bold text-pink-500">{countdown}</p>
        <p className="text-xs text-muted-foreground mt-1">每周三晚 8 点揭晓</p>
      </div>

      {/* 匹配状态卡片 */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border mb-4">
        {hasMatch ? (
          <>
            <h3 className="font-semibold text-foreground mb-2">🎉 本周匹配已揭晓！</h3>
            <button
              onClick={() => navigate("/match")}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ background: "linear-gradient(135deg, #e8788a, #d4607a)" }}
            >
              查看匹配对象
            </button>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-foreground mb-1">✨ 等待匹配中</h3>
            <p className="text-sm text-muted-foreground">本周三晚 8 点将揭晓你的匹配对象</p>
          </>
        )}
      </div>

      {/* 性格画像卡片 */}
      {profileSummary && (
        <div
          className="bg-card rounded-2xl p-5 shadow-sm border mb-4 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <h3 className="font-semibold text-foreground mb-2">✨ 你的性格画像</h3>
          <p className="text-sm text-muted-foreground">{profileSummary.slice(0, 80)}...</p>
          <p className="text-xs text-pink-500 mt-2">点击查看完整画像 →</p>
        </div>
      )}

      {/* 匹配池人数 */}
      <p className="text-center text-sm text-muted-foreground mt-6">已有 {poolCount} 人加入匹配池</p>
    </div>
  );
};

export default Index;

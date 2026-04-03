import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAuth } from "@/integrations/supabase/auth-client";
import { useAuth } from "@/contexts/AuthContext";

const QUESTIONS = [
  {
    id: 1,
    icon: "🌙",
    q: "周末你更可能在做什么？",
    options: ["宿舍追剧", "跟朋友聚餐", "图书馆学习", "打游戏/搞创作"],
  },
  {
    id: 2,
    icon: "💬",
    q: "你刚认识新朋友，你更倾向于？",
    options: ["快速聊开话题", "慢慢来先观察", "靠段子梗破冰", "直接找共同话题"],
  },
  {
    id: 3,
    icon: "🗺️",
    q: "约会地点你更喜欢？",
    options: ["小众咖啡店/书店", "户外/海边/爬山", "电影或展览", "找好吃的宵夜"],
  },
  {
    id: 4,
    icon: "😤",
    q: "争吵之后你一般怎么处理？",
    options: ["马上面对面解决", "冷静一下再谈", "发文字写清楚", "沉默等对方来找我"],
  },
  {
    id: 5,
    icon: "🌏",
    q: "你更希望另一半来自哪里？",
    options: ["香港本地", "内地", "海外华人/国际生", "哪里都好看缘分"],
  },
  {
    id: 6,
    icon: "📱",
    q: "你怎么跟喜欢的人联系？",
    options: ["随时发消息", "有事才联系但通话长", "发表情包/梗图", "喜欢发语音"],
  },
  {
    id: 7,
    icon: "🎓",
    q: "毕业后最理想的生活状态？",
    options: ["留港或去大城市", "出国读书或工作", "稳定工作好好生活", "创业/做自己想做的"],
  },
  {
    id: 8,
    icon: "❤️",
    q: "感情中最重要的是？",
    options: ["三观和思维方式一致", "能互相逗笑有趣", "互相支持陪伴", "有激情和心动感"],
  },
  {
    id: 9,
    icon: "🌙",
    q: "你是哪种人？",
    options: ["早起型早上效率高", "夜猫子深夜才进入状态", "随机看心情", "任何时候都很困"],
  },
  {
    id: 10,
    icon: "🎭",
    q: "第一次见面你希望对方怎么做？",
    options: ["提前规划好带着我走", "随性走着看", "一起商量平等决定", "我来主导就好"],
  },
  {
    id: 11,
    icon: "🍽️",
    q: "你对吃的态度是？",
    options: ["为了好吃愿意排队", "随便吃饱就行", "喜欢自己做饭", "最爱探索新餐厅"],
  },
  {
    id: 12,
    icon: "🐾",
    q: "你喜欢养宠物吗？",
    options: ["猫派！已经有/想养", "狗派！越大只越好", "都喜欢来者不拒", "不太想养怕麻烦"],
  },
  {
    id: 13,
    icon: "💰",
    q: "约会的时候费用怎么处理？",
    options: ["AA制最舒服", "谁约的谁请", "轮流请客", "看情况不纠结"],
  },
  {
    id: 14,
    icon: "🎵",
    q: "你最常听什么类型的音乐？",
    options: ["华语流行/粤语歌", "欧美/K-pop", "独立/民谣/电子", "什么都听看心情"],
  },
  {
    id: 15,
    icon: "🏠",
    q: "你的理想居住状态是？",
    options: ["热闹市中心", "安静郊区有空间", "能走路到海边", "哪里工作就住哪里"],
  },
];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setSaving(true);
      localStorage.setItem("quiz_results", JSON.stringify(newAnswers));

      if (user) {
        try {
          // Get the real auth uid from supabaseAuth
          const {
            data: { user: authUser },
          } = await supabaseAuth.auth.getUser();
          if (!authUser) throw new Error("No auth user");

          const questionsWithAnswers = QUESTIONS.map((q, i) => ({
            question: q.q,
            answer: q.options[newAnswers[i]] || "",
          }));

          // Delete existing then insert (no unique constraint on user_id)
          await supabaseAuth.from("quiz_answers").delete().eq("user_id", authUser.id);
          const { error: insertError } = await supabaseAuth.from("quiz_answers").insert({
            user_id: authUser.id,
            answers: questionsWithAnswers,
            submitted_at: new Date().toISOString(),
          });

          if (insertError) {
            console.error("quiz_answers insert failed:", JSON.stringify(insertError));
          } else {
            console.log("quiz_answers saved for auth uid:", authUser.id);
            // Then call generate-profile
            const { error: fnError } = await supabaseAuth.functions.invoke("generate-profile", {
              body: { user_id: authUser.id },
            });
            if (fnError) {
              console.error("generate-profile error:", fnError);
            }
          }
        } catch (err) {
          console.error("Failed to save answers or generate profile:", err);
        }
      }

      setSaving(false);
      navigate("/confirmation");
    }
  };

  const q = QUESTIONS[current];

  return (
    <AppShell showNav>
      <div className="p-8 pt-12">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full mb-12 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
            transition={{ ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-4xl">{q.icon}</span>
              <h2 className="font-serif text-2xl font-bold leading-tight text-foreground">{q.q}</h2>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => setSelected(idx)}
                  className={selected === idx ? "lunar-option-selected" : "lunar-option"}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12">
          <button className="lunar-btn-primary" disabled={selected === null || saving} onClick={handleNext}>
            {saving ? "生成画像中…" : current === QUESTIONS.length - 1 ? "查看我的匹配 →" : "下一题 →"}
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default Quiz;

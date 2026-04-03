import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/AppShell";

const MatchPoolConfirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppShell showNav>
      <div className="p-8 pt-16 flex flex-col items-center text-center min-h-[80vh] justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="text-primary" size={40} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-2xl font-bold text-foreground mb-2"
        >
          已加入匹配池 🎉
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-10 max-w-[280px]"
        >
          你的性格档案已生成，AI 将在下次匹配中为你寻找最合适的人
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm space-y-4"
        >
          <div className="p-5 rounded-2xl bg-muted space-y-3">
            <div className="flex items-center gap-3">
              <CalendarClock size={20} className="text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">每周三晚 8:00</p>
                <p className="text-xs text-muted-foreground">匹配结果将通过邮件发送给你</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">查看邮箱</p>
                <p className="text-xs text-muted-foreground">匹配成功后会收到对方的匿名简介</p>
              </div>
            </div>
          </div>

          <button className="lunar-btn-primary" onClick={() => navigate("/profile")}>
            查看我的资料
          </button>
          <button className="lunar-btn-secondary" onClick={() => navigate("/shoot")}>
            有心仪的人？去心动一下 💘
          </button>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default MatchPoolConfirmation;

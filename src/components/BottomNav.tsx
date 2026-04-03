import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ClipboardCheck, Heart, Target, User } from "lucide-react";
import { useQuizStatus } from "@/hooks/useQuizStatus";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasCompletedQuiz } = useQuizStatus();

  const allNavs = [
    { icon: Home, label: "首页", path: "/" },
    { icon: ClipboardCheck, label: "测评", path: "/quiz", hideWhenQuizDone: true },
    { icon: Target, label: "心动", path: "/shoot" },
    { icon: Heart, label: "匹配", path: "/match" },
    { icon: User, label: "我的", path: "/profile" },
  ];

  const navs = allNavs.filter((n) => !n.hideWhenQuizDone || !hasCompletedQuiz);

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-lunar-surface/80 backdrop-blur-md border-t border-border flex items-center justify-around px-6 pb-4">
      {navs.map((n) => (
        <button
          key={n.label}
          onClick={() => navigate(n.path)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            location.pathname === n.path ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <n.icon size={20} />
          <span className="text-[10px] font-medium">{n.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;

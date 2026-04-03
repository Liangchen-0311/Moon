import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import { supabaseAuth } from "@/integrations/supabase/auth-client";
import { useAuth } from "@/contexts/AuthContext";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("男生");
  const [target, setTarget] = useState("女生");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user || nickname.length < 2) return;
    setSaving(true);

    const { data: { user: authUser } } = await supabaseAuth.auth.getUser();
    if (!authUser) return;

    // On user's Supabase, users.id IS the auth uid
    const { data: existing } = await supabaseAuth
      .from("users")
      .select("id")
      .eq("id", authUser.id)
      .maybeSingle();

    if (existing) {
      await supabaseAuth
        .from("users")
        .update({ nickname, gender, email: authUser.email })
        .eq("id", authUser.id);
    } else {
      await supabaseAuth
        .from("users")
        .insert({ id: authUser.id, nickname, gender, email: authUser.email, opt_in: true });
    }

    localStorage.setItem("user_nickname", nickname);
    localStorage.setItem("user_gender", gender);
    localStorage.setItem("user_target", target);

    setSaving(false);
    navigate("/quiz");
  };

  return (
    <AppShell>
      <div className="p-8 pt-12">
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold mb-2 text-foreground">完善你的资料</h2>
          <p className="text-muted-foreground">
            已验证：{user?.email}
            <CheckCircle2 className="inline ml-1 align-text-bottom" size={16} style={{ color: "hsl(var(--lunar-teal))" }} />
          </p>
        </div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ease: [0.4, 0, 0.2, 1] }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">昵称</label>
            <input
              maxLength={8}
              minLength={2}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="怎么称呼你？"
              className="lunar-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">你的性别</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="lunar-input appearance-none"
              >
                <option>男生</option>
                <option>女生</option>
                <option>不想说</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase ml-1">想认识</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="lunar-input appearance-none"
              >
                <option>女生</option>
                <option>男生</option>
                <option>都可以</option>
              </select>
            </div>
          </div>

          <button
            className="lunar-btn-primary"
            disabled={nickname.length < 2 || saving}
            onClick={handleSubmit}
          >
            {saving ? "保存中…" : "开始测评 →"}
          </button>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Onboarding;

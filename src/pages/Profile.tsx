import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AppShell from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";

const Profile: React.FC = () => {
  const nickname = localStorage.getItem("user_nickname") || "未设置";
  const email = localStorage.getItem("user_email") || "未验证";
  const gender = localStorage.getItem("user_gender") || "未设置";
  const targetGender = localStorage.getItem("user_target") || "未设置";

  const [optIn, setOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("users")
          .select("opt_in")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          setOptIn(data.opt_in);
        }
      }
    };
    loadProfile();
  }, []);

  const handleOptInToggle = async (checked: boolean) => {
    setOptIn(checked);
    if (!userId) return;
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("users")
          .update({ opt_in: checked })
          .eq("user_id", userId);
      } else {
        await supabase
          .from("users")
          .insert({
            user_id: userId,
            opt_in: checked,
            email: email !== "未验证" ? email : null,
            nickname: nickname !== "未设置" ? nickname : null,
            gender: gender !== "未设置" ? gender : null,
            target_gender: targetGender !== "未设置" ? targetGender : null,
          });
      }
    } catch (err) {
      console.error("Failed to update opt_in:", err);
      setOptIn(!checked); // revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell showNav>
      <div className="p-6 pt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4"
          >
            <User className="text-primary" size={32} />
          </motion.div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{nickname}</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
            <Mail size={14} /> {email}
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center p-4 bg-muted rounded-2xl">
            <span className="text-sm text-muted-foreground">性别</span>
            <span className="text-sm font-medium text-foreground">{gender}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted rounded-2xl">
            <span className="text-sm text-muted-foreground">想认识</span>
            <span className="text-sm font-medium text-foreground">{targetGender}</span>
          </div>
        </div>

        {/* Opt-in Toggle */}
        <div className="p-5 rounded-2xl border-2 border-border bg-card mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="opt-in" className="text-base font-semibold text-foreground cursor-pointer">
                参加本周匹配
              </Label>
              <p className="text-xs text-muted-foreground">
                关闭后本周三/周日的匹配将不会选中你
              </p>
            </div>
            <Switch
              id="opt-in"
              checked={optIn}
              onCheckedChange={handleOptInToggle}
              disabled={loading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            className="lunar-btn-secondary flex items-center justify-center gap-2"
            onClick={() => {
              localStorage.removeItem("quiz_answers");
              window.location.href = "/quiz";
            }}
          >
            <RefreshCw size={16} /> 重新测评
          </button>
        </div>

        {/* App info */}
        <div className="mt-12 text-center">
          <p className="text-2xl mb-1">🌙</p>
          <p className="text-xs text-muted-foreground">月亮 🌙 · v1.0 Demo</p>
        </div>
      </div>
    </AppShell>
  );
};

export default Profile;

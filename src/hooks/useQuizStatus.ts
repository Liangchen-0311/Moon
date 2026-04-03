import { useState, useEffect } from "react";
import { supabaseAuth as supabase } from "@/integrations/supabase/auth-client";
import { useAuth } from "@/contexts/AuthContext";

export function useQuizStatus() {
  const { user, loading: authLoading } = useAuth();
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const check = async () => {
      const { data } = await supabase
        .from("users")
        .select("profile_summary")
        .eq("user_id", user.id)
        .maybeSingle();

      setHasCompletedQuiz(!!data?.profile_summary);
      setLoading(false);
    };
    check();
  }, [user, authLoading]);

  return { hasCompletedQuiz, loading };
}

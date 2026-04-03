import { useState, useEffect } from "react";
import { supabaseAuth } from "@/integrations/supabase/auth-client";
import { useAuth } from "@/contexts/AuthContext";

export function useQuizStatus() {
  const { user, loading: authLoading } = useAuth();
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const check = async () => {
      if (!user) {
        setHasCompletedQuiz(false);
        setLoading(false);
        return;
      }

      const { data: { user: authUser } } = await supabaseAuth.auth.getUser();
      if (!authUser) {
        setHasCompletedQuiz(false);
        setLoading(false);
        return;
      }

      const { data } = await supabaseAuth
        .from("quiz_answers")
        .select("user_id")
        .eq("user_id", authUser.id)
        .maybeSingle();

      setHasCompletedQuiz(!!data);
      setLoading(false);
    };

    check();
  }, [user, authLoading]);

  return { hasCompletedQuiz, loading };
}

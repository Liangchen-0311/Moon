
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid NOT NULL,
  user_b uuid NOT NULL,
  match_score float NOT NULL DEFAULT 0,
  match_reason text,
  match_type text NOT NULL DEFAULT 'weekly',
  week_of date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matches"
ON public.matches FOR SELECT TO authenticated
USING (auth.uid() IN (
  (SELECT user_id FROM public.users WHERE id = user_a),
  (SELECT user_id FROM public.users WHERE id = user_b)
));

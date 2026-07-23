-- Discovery questions for the AION 2026 registration form.
--
-- Four open-text answers the booth team uses to prep conversations:
--   team_challenges        What are some of the biggest challenges your team is currently facing?
--   reporting_challenges   Are there any reporting or analytics challenges?
--   ai_ml_exploration      Are you exploring AI or Machine Learning for any business functions?
--   ai_adoption_challenge  What is the biggest challenge you are facing in adopting AI?

ALTER TABLE event_leads
  ADD COLUMN IF NOT EXISTS team_challenges TEXT,
  ADD COLUMN IF NOT EXISTS reporting_challenges TEXT,
  ADD COLUMN IF NOT EXISTS ai_ml_exploration TEXT,
  ADD COLUMN IF NOT EXISTS ai_adoption_challenge TEXT;

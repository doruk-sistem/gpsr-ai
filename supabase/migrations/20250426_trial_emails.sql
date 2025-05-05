-- supabase/migrations/20250426_trial_emails.sql
/*
# Trial Emails Tracking

1. New Tables
  - `trial_emails` - Tracks all trial-related emails sent to users
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `email_type` (enum)
    - `sent_at` (timestamp)
    - `metadata` (JSONB)

2. Security
  - Enable RLS on `trial_emails` table
  - Add policy for administrators to manage trial emails
  - Add policy for users to view their own trial emails
*/

-- Create enum type for email types
CREATE TYPE trial_email_type AS ENUM (
  'trial_started',
  'trial_reminder_7days',
  'trial_reminder_48hours',
  'trial_ended',
  'trial_converted',
  'trial_canceled'
);

-- Create table for tracking trial emails
CREATE TABLE IF NOT EXISTS trial_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email_type trial_email_type NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE trial_emails ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own trial emails
CREATE POLICY "Users can view their own trial emails"
  ON trial_emails
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy for administrators to manage all trial emails
CREATE POLICY "Administrators can manage all trial emails"
  ON trial_emails
  FOR ALL
  TO service_role
  USING (true);

-- Create function to check if a specific trial email has been sent
CREATE OR REPLACE FUNCTION has_received_trial_email(
  _user_id UUID,
  _email_type trial_email_type
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM trial_emails 
    WHERE user_id = _user_id 
    AND email_type = _email_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for users to check their trial email status
CREATE OR REPLACE VIEW user_trial_emails WITH (security_invoker = true) AS
SELECT 
  te.email_type,
  te.sent_at,
  te.metadata
FROM trial_emails te
WHERE te.user_id = auth.uid()
ORDER BY te.sent_at DESC;

-- Grant select on the view to authenticated users
GRANT SELECT ON user_trial_emails TO authenticated;

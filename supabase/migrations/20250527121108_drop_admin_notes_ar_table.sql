-- Drop admin_notes column from authorised_representative_requests table
ALTER TABLE authorised_representative_requests DROP COLUMN IF EXISTS admin_notes;

import "server-only";

/**
 * ! DO NOT USE THIS ON THE CLIENT-SIDE
 */

import { createClient } from "@supabase/supabase-js";

/**
 * This is a Supabase Client for use on the server-side framework.
 *
 * It is used to access the admin API.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

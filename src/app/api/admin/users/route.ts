import { NextResponse } from "next/server";

import { isSuperAdmin } from "@/lib/utils/admin-helpers";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET() {
  try {
    const supabase = await createClient();

    /**
     * User list is only accessible to superadmin and admin
     * So we need to check if the current user is a superadmin or admin
     * If not, we return a 401 Unauthorized error
     */
    const isAuthorized = await isSuperAdmin(supabase);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

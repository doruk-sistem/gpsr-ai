import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/utils/admin-helpers";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the URL and pathname for debugging
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Check for URL params that might indicate we should skip auth checks (for debugging)
  const skipAuth = url.searchParams.get("skipAuth") === "true";
  if (skipAuth) {
    return supabaseResponse;
  }

  // Get the auth cookie for debugging
  const authCookie = request.cookies.get("sb-access-token");

  // If user tried to access dashboard without authentication, redirect to login
  if (
    !user &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))
  ) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // If authenticated user tried to access auth pages, redirect to appropriate dashboard
  if (
    user &&
    pathname.startsWith("/auth") &&
    !pathname.startsWith("/auth/logout")
  ) {
    // Check if user is an admin
    const adminStatus = await isAdmin(user, supabase);

    if (adminStatus) {
      url.pathname = "/admin/dashboard";
    } else {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.redirect(url);
  }

  // If user tries to access admin routes, check if they're an admin
  if (user && pathname.startsWith("/admin")) {
    const adminStatus = await isAdmin(user, supabase);

    if (!adminStatus) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // If authenticated user trying to access dashboard pages, handle profile completion check
  if (user && pathname.startsWith("/dashboard")) {
    // Missing profile info and not on complete-profile page
    const isProfileComplete =
      user?.user_metadata?.first_name &&
      user?.user_metadata?.last_name &&
      user?.user_metadata?.company;

    if (!isProfileComplete && pathname !== "/dashboard/complete-profile") {
      url.pathname = "/dashboard/complete-profile";
      return NextResponse.redirect(url);
    }

    // Profile complete but on complete-profile page
    if (isProfileComplete && pathname === "/dashboard/complete-profile") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Check for paid plan requirement on certain paths - but only after profile is complete
    if (isProfileComplete) {
      const privatePaths = [
        "/dashboard/products",
        "/dashboard/manufacturers",
        "/dashboard/representative",
      ];

      const { data: subscription, error } = await supabase
        .from("stripe_user_subscriptions")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("[Middleware] Error fetching subscription:", error);
        throw error;
      }

      const hasActiveSubscription = subscription?.has_active_subscription;

      if (!hasActiveSubscription && privatePaths.includes(pathname)) {
        url.pathname = "/dashboard/billing";
        return NextResponse.redirect(url);
      }
    }
  }

  // Special handling for login success - check if user is admin and redirect accordingly
  if (
    user &&
    pathname === "/auth/login" &&
    url.searchParams.get("redirected") !== "true"
  ) {
    try {
      const adminStatus = await isAdmin(user);

      if (adminStatus) {
        url.pathname = "/admin/dashboard";
        url.searchParams.set("redirected", "true");
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error(
        "[Middleware] Error checking admin status after login:",
        error
      );
    }
  }

  return supabaseResponse;
}
